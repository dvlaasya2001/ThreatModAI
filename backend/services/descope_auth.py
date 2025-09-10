from functools import wraps
from flask import request, jsonify
import os
import logging
from dotenv import load_dotenv
from descope import DescopeClient
from descope.exceptions import AuthException

load_dotenv()

logger = logging.getLogger(__name__)

project_id = os.getenv("DESCOPE_PROJECT_ID")
logger.info(f"Initializing Descope client with project ID: {project_id}")

try:
    descope_client = DescopeClient(project_id=project_id)
except Exception as e:
    logger.error(f"Error initializing Descope client: {str(e)}")
    descope_client = DescopeClient(project_id=project_id)

def handle_validate_auth(token):

    if not token:
        logger.warning("Empty token provided for validation")
        return 401, {
            "success": False,
            "message": "No token provided"
        }
    
    try:
        jwt_response = descope_client.validate_session(session_token=token)
        logger.info("Token validated successfully")
        
        return 200, {
            "success": True,
            "message": "Authentication validated successfully"
        }
        
    except AuthException as e:
        logger.error(f"Auth validation failed: {str(e)}")
        return 401, {
            "success": False,
            "message": "Invalid or expired token",
            "details": str(e)
        }
        
        
    except Exception as e:
        logger.exception(f"Unexpected error during validation: {str(e)}")
        return 500, {
            "success": False,
            "message": "Failed to validate authentication",
            "details": str(e)
        }

