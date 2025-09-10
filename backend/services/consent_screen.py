import urllib.parse
import os

def get_descope_consent_url(state):
    base_url = os.getenv("AGENT_A_AUTHORIZATION_URL")
    client_id = os.getenv("AGENT_A_CLIENT_ID")
    redirect_uri = os.getenv("AGENT_A_REDIRECT_URI")
    scopes = "repo:read diagram:generate"

    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": scopes,
        "state": state
  
    }

    return f"{base_url}?{urllib.parse.urlencode(params)}"
