
import os
import logging
from jwt.exceptions import InvalidTokenError
from descope import DescopeClient
from flask import request, jsonify
from functools import wraps

logger = logging.getLogger(__name__)

PROJECT_ID= os.getenv("DESCOPE_PROJECT_ID")

descope_client = DescopeClient(project_id=PROJECT_ID)


def is_token_valid(token,client_id, required_scopes=None):
    audience=[client_id,PROJECT_ID]
    try:
        if not token:
            return False, "No token provided"
        try:
            
            jwt_response = descope_client.validate_session(session_token=token,audience=audience)
            if required_scopes:
                   
                    if "scope" in jwt_response:
                        if isinstance(jwt_response["scope"], str):
                            scopes = jwt_response["scope"].split()                           
                        else:
                            scopes = jwt_response["scope"]
                            print(f"[8] Using array scope: {scopes}")
                    else:
                       return False, "Token does not contain any scope information"
            missing_scopes = [scope for scope in required_scopes if scope not in scopes]
            if missing_scopes:
                    return False, f"Token missing required scope(s): {', '.join(missing_scopes)}"
            return True, None
            
        except Exception as e:
            return False, f"Token validation failed: {str(e)}"
    except Exception as e:
        print(f"[ERROR] Unexpected error during token validation: {str(e)}")
        return False, f"Unexpected error during token validation: {str(e)}"