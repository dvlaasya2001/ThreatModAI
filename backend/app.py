import os
import logging
import requests
import json
import time
from flask import Flask, session, request, jsonify, redirect
from services.consent_screen import get_descope_consent_url
from services.descope_auth import handle_validate_auth
from dotenv import load_dotenv
from langgraph_flow import run_analysis
from flask_cors import CORS

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.getenv("APP_SECRET_KEY")


CORS(app, resources={r"/*": {"origins": "*"}})

client_id = os.getenv("AGENT_A_CLIENT_ID")
client_secret = os.getenv("AGENT_A_CLIENT_SECRET")
token_endpoint = os.getenv("AGENT_A_TOKEN_URL")


#Triggers the consent flow
@app.route("/start-analysis", methods=["GET"])
def start_analysis():
    repo_url = request.args.get("repo_url")
    if not repo_url:
        return "Missing repo_url parameter", 400
    state = json.dumps({"flow": "agent_a_flows", "repo_url": repo_url})
    if "agent_b_token" not in session:
        return redirect(get_descope_consent_url(state))


# Helper function to execute LangGraph workflow
def execute_langgraph_workflow(access_token,repo_url):
    
    try:
        
        logger.info(f"Starting LangGraph workflow for repository: {repo_url}")
        result = run_analysis(access_token,repo_url)
        
        return result, None
        
    except ImportError as e:
        logger.error(f"Failed to import LangGraph flow: {str(e)}")
        return None, "Analysis service unavailable - LangGraph flow not found"
        
    except Exception as flow_error:
        logger.exception(f"Error in LangGraph workflow: {str(flow_error)}")
        return None, f"Analysis failed: {str(flow_error)}"
    

#Validate Descope auth token
@app.route("/api/auth/validate", methods=["POST"])
def validate_auth():
    try:
       
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.split(' ')[1]
        status_code, response_data = handle_validate_auth(token)
        return jsonify(response_data), status_code
    except Exception as e:
        logger.exception("Error in auth validation endpoint")
        return jsonify({"success": False, "message": str(e)}), 500


#Route to search repository
@app.route("/api/github/search", methods=["GET"])
def search_repos():
    try:
        query = request.args.get('query')      
        headers = {"Accept": "application/vnd.github.v3+json"}
        
        if query:
            url = f"https://api.github.com/search/repositories?q={query}&sort=stars&order=desc&per_page=20"
            response = requests.get(url, headers=headers)
            data = response.json()
            repos = data.get("items", [])
        else:
            url = "https://api.github.com/repositories?per_page=20"
            response = requests.get(url, headers=headers)
            repos = response.json()
        
        return jsonify(repos), response.status_code
    
    except Exception as e:
        logger.exception("Error searching GitHub repositories")
        return jsonify({"error": str(e)}), 500


#Route which triggers the langgraph workflow
@app.route("/api/github/analyze", methods=["POST"])
def analyze_repo():

    try:
        data = request.json
        if not data or not data.get("repo_url"):
            logger.warning("Missing repo_url in request")
            return jsonify({"error": "repo_url is required"}), 400
            
        repo_url = data.get("repo_url")
        auth_header = request.headers.get('Authorization', '')
        access_token = auth_header.split(' ')[1]
        analysis_result = execute_langgraph_workflow(access_token,repo_url)

        # Remove the extracted field
        if analysis_result and isinstance(analysis_result, tuple) and analysis_result[0]:
            if isinstance(analysis_result[0], dict) and 'extracted' in analysis_result[0]:
                analysis_result[0].pop('extracted', None)

        analysis_id = f"analysis_{int(time.time())}"
        logger.info(f"Analysis completed successfully with ID: {analysis_id}")
        
        return jsonify({
            "status": "success",
            "message": f"Repository {repo_url} analyzed successfully",
            "result": analysis_result,
            "analysis_id": analysis_id
        }), 200
            
    except Exception as e:
        logger.exception("Error processing repository analysis request")
        return jsonify({"error": str(e)}), 500
    
    
#Callback Route after consent 
@app.route("/callback/agent_a",methods=["POST"])
def agent_a_callback():
    
    data=request.json
    code = data.get("code")
    state_data = json.loads(data.get("state"))
    redirect_uri = os.getenv("AGENT_A_REDIRECT_URI")
   
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    resp = requests.post(token_endpoint, data=data,headers=headers)
    token_response = resp.json()
    access_token = token_response.get("access_token")

    return jsonify({"success": True, "message": "Consent complete, workflow started","access_token":access_token})


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    logger.info(f"Starting server on port {port}, debug mode: {debug}")
    app.run(host="0.0.0.0", port=port, debug=debug)