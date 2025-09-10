from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
import os, logging
from dotenv import load_dotenv
from services.agent_a_services import extract_repo
from services.agent_b_services import analyze_repo
from services.agent_c_services import create_document
from services.token_generator import get_agent_token
from services.token_validator import is_token_valid
from services.send_email import send_email
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
\
load_dotenv()


a_client_id = os.getenv("AGENT_A_CLIENT_ID")
a_client_secret = os.getenv("AGENT_A_CLIENT_SECRET")
a_token_endpoint = os.getenv("AGENT_A_TOKEN_URL")

b_client_id = os.getenv("AGENT_B_CLIENT_ID")
b_client_secret = os.getenv("AGENT_B_CLIENT_SECRET")
b_token_endpoint = os.getenv("AGENT_B_TOKEN_URL")

c_client_id = os.getenv("AGENT_C_CLIENT_ID")
c_client_secret = os.getenv("AGENT_C_CLIENT_SECRET")
c_token_endpoint = os.getenv("AGENT_C_TOKEN_URL")


class State(TypedDict):
    repo_url: str
    access_token:str
    extracted: str
    threats: str
    report_path: str
    diagram:str
    description:str
    error: Optional[str]       

# ---------- AGENT A: Repository Data Extractor ----------
def agent_a(state: State):

    try:
        repo_url = state["repo_url"]
        logger.info(f"Agent A: Starting data extraction for {repo_url}")
        
        try:
            #token = get_agent_token(a_client_id, a_client_secret, a_token_endpoint,"repo:read diagram:generate")
            token = state.get("access_token")
            is_valid, error = is_token_valid(token, a_client_id, required_scopes=["repo:read" ,"diagram:generate"])
            if not is_valid:
                logger.error(f"Agent A: Token validation failed: {error}")
                return {"error": f"Agent A token validation failed: {error}"}
                
            logger.info("Agent A: Token generated and validated successfully")
        except Exception as e:
            logger.exception(f"Agent A: Token generation failed: {str(e)}")
            return {"error": f"Agent A token generation failed: {str(e)}"}
        
        result=extract_repo(repo_url)
        if "error" in result:
            logger.error(f"Agent A: Extraction error: {result['error']}")
            return {"error": result["error"]}

        return {"extracted":result}
    except Exception as e:
        logger.exception(f"Agent A failed: {str(e)}")
        return {"error": f"Extraction error: {str(e)}"}


# ---------- AGENT B: Threat Analyzer ----------
def agent_b(state: State):

    try:
        if "error" in state and state["error"]:
            logger.error(f"Agent B: Previous error detected: {state['error']}")
            return {} 
            
        if not state.get("extracted"):
            logger.error("Agent B: No extracted data available")
            return {"error": "No repository data available for analysis"}
        
        logger.info("Agent B: Starting threat analysis")

        try:
            token = get_agent_token(b_client_id, b_client_secret, b_token_endpoint,"threats:analyze")
            
            is_valid, error = is_token_valid(token, b_client_id, required_scopes=["threats:analyze"])
            if not is_valid:
                logger.error(f"Agent B: Token validation failed: {error}")
                return {"error": f"Agent B token validation failed: {error}"}
                
            logger.info("Agent B: Token generated and validated successfully")
        except Exception as e:
            logger.exception(f"Agent B: Token generation failed: {str(e)}")
            return {"error": f"Agent B token generation failed: {str(e)}"}

        output=analyze_repo(state.get("extracted"))   
        return {"threats": output.get("threats", ""), "diagram":output.get("diagram",""),"description":output.get("description","")}
                  
    except Exception as e:
        logger.exception(f"Agent B failed: {str(e)}")
        return {"error": f"Security analysis error: {str(e)}"}

# ---------- AGENT C: Report Generator ----------
def agent_c(state: State):

    try:
        if "error" in state and state["error"]:
            logger.error(f"Agent C: Previous error detected: {state['error']}")
            return {} 
            
        logger.info("Agent C: Starting report generation")

        try:

            token = get_agent_token(c_client_id, c_client_secret, c_token_endpoint,"report:generate")
            
            is_valid, error = is_token_valid(token, c_client_id, required_scopes=["report:generate"])
            if not is_valid:
                logger.error(f"Agent C: Token validation failed: {error}")
                return {"error": f"Agent C token validation failed: {error}"}
                
            logger.info("Agent C: Token generated and validated successfully")
        except Exception as e:
            logger.exception(f"Agent C: Token generation failed: {str(e)}")
            return {"error": f"Agent C token generation failed: {str(e)}"}
        
        file_path=create_document(state["description"],state["diagram"],state["threats"]) 
        send_email(file_path)
        return {"report_path": file_path}
    except Exception as e:
        logger.exception(f"Agent C failed: {str(e)}")
        return {"error": f"Report generation error: {str(e)}"}


# ---------- BUILD GRAPH ----------
def build_graph():
    """Build the workflow graph with error handling"""
    workflow = StateGraph(State)
    
    workflow.add_node("agent_a", agent_a)
    workflow.add_node("agent_b", agent_b)
    workflow.add_node("agent_c", agent_c)
    
    def route_after_agent_a(state):
        if "error" in state and state["error"]:
            return "END"
        return "agent_b"
    
    def route_after_agent_b(state):
        if "error" in state and state["error"]:
            return "END"
        return "agent_c"
    
    workflow.add_conditional_edges("agent_a", route_after_agent_a)
    workflow.add_conditional_edges("agent_b", route_after_agent_b)
    workflow.add_edge("agent_c", END)
    
    workflow.set_entry_point("agent_a")
    
    return workflow.compile()

app = build_graph()

def run_analysis(access_token,repo_url):

    state = {
        "repo_url": repo_url,
        "access_token":access_token,
        "extracted": "",
        "threats": "",
        "report_path": "",
        "diagram":"",
        "description":"",
        "error": None,
        
    }
    
    logger.info(f"Starting LangGraph workflow for repo: {repo_url}")
    try:
        result = app.invoke(state)
        logger.info("LangGraph workflow completed successfully")
        return result
    except Exception as e:
        logger.exception(f"LangGraph workflow failed: {str(e)}")
        return {
            **state,
            "error": f"Workflow execution failed: {str(e)}"
        }

