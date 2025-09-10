
import requests
import logging
from functools import wraps

logger = logging.getLogger(__name__)

def get_agent_token(client_id,client_secret,token_endpoint,scopes):
    
    try:
        
        if not client_id or not client_secret or not token_endpoint:
            logger.error("Missing required environment variables for token request")
            raise ValueError("Missing Agent configuration")

        payload = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
            "scope": scopes
        }
        
        response = requests.post(
            token_endpoint, 
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code != 200:
            logger.error(f"Token request failed: {response.status_code} - {response.text}")
            raise Exception(f"Failed to get token: {response.status_code}")
            
        response_data = response.json()        
        access_token = response_data.get("access_token")

        if not access_token:
            logger.error("Token response missing access_token")
            raise ValueError("Invalid response from token endpoint")
            
        return access_token
        
    except requests.RequestException as e:
        logger.exception(f"Network error during token request: {str(e)}")
        raise Exception(f"Network error during token request: {str(e)}")
    except Exception as e:
        logger.exception(f"Failed to get Agent token: {str(e)}")
        raise Exception(f"Failed to get Agent A token: {str(e)}")

