import os
import requests
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import base64
from dotenv import load_dotenv
load_dotenv()

DESCOPE_PROJECT_ID = os.getenv("DESCOPE_PROJECT_ID")
DESCOPE_MANAGEMENT_KEY = os.getenv("DESCOPE_MANAGEMENT_KEY")
DESCOPE_API_BASE = "https://api.descope.com/v1/mgmt/outbound/app"
USER_ID=os.getenv("USER_ID")
OUTBOUND_APP_ID = os.getenv("OUTBOUND_APP_ID")
RECIPIENT = os.getenv("RECIPIENT")

import requests
 
def get_outbound_token(app_id, user_id, scopes=None):
    
    
    url = "https://api.descope.com/v1/mgmt/outbound/app/user/token/latest"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DESCOPE_PROJECT_ID}:{DESCOPE_MANAGEMENT_KEY}"
    }
    
    payload = {
        "appId": app_id,
        "userId": user_id,
        "scopes": scopes or [],
       
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code != 200:
        raise Exception(f"Failed to fetch token: {response.status_code} {response.text}")
    
    data = response.json()
    token=data.get("token")
    return token.get("accessToken")

def send_email_with_attachment(access_token, recipient, subject, html_body, file_path):

    creds = Credentials(token=access_token)
    service = build("gmail", "v1", credentials=creds)

    message = MIMEMultipart()
    message["to"] = recipient
    message["subject"] = subject

    # Add HTML body
    message.attach(MIMEText(html_body, "html"))

    # Add attachment
    with open(file_path, "rb") as f:
        mime_base = MIMEBase("application", "octet-stream")
        mime_base.set_payload(f.read())
        encoders.encode_base64(mime_base)
        mime_base.add_header(
            "Content-Disposition",
            f'attachment; filename="{file_path.split("/")[-1]}"'
        )
        message.attach(mime_base)

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

    return service.users().messages().send(
        userId="me",
        body={"raw": raw}
    ).execute()
def send_email(file_path):
    try:
        access_token = get_outbound_token(OUTBOUND_APP_ID,USER_ID, scopes=["https://www.googleapis.com/auth/gmail.send"])
        print("Fetched Gmail access token.", access_token)
        subject = "Threat Model Report"
        html_body = "<p>Hello from ThreatModAI!</p><p>Please find the attached threat model report generated from ThreatModAI.</p>"
        send_email_with_attachment(access_token, RECIPIENT, subject, html_body,file_path)
        print("Email sent successfully.")
    except Exception as e:
        print(f"Error sending email: {str(e)}")

