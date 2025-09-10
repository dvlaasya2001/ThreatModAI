import os
import json
import re
from dotenv import load_dotenv
import logging

load_dotenv()

from openai import AzureOpenAI
client = AzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_repo(repo_data):

    logger.info("Generating system description...")

    repo_summary = {}
    for category, files in repo_data.items():
        repo_summary[category] = []
        for file_data in files:

            content_preview = file_data.get("content", "")[:500]
            if len(file_data.get("content", "")) > 500:
                content_preview += "... [truncated]"
                
            repo_summary[category].append({
                "path": file_data.get("path", ""),
                "content_preview": content_preview
            })
    
    repo_content = json.dumps(repo_summary, indent=2)

    description_prompt = f"""
You are a senior software architect reviewing a codebase. 
Based on the repository files provided, create a detailed end-to-end description of the system.
Include:
- Overall purpose and functionality
- Main components and their responsibilities
- Key technologies and frameworks used
- Data flow between components
- External dependencies and integrations
- Security considerations

Repository data:
{repo_content}

Provide ONLY the description, no diagrams or other content.
"""

    description_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[
            {"role": "system", "content": "You are a helpful assistant for software architecture and system design."},
            {"role": "user", "content": description_prompt}
        ],
        temperature=0.2
    )

    system_description = description_response.choices[0].message.content.strip()
    
    logger.info("Generating PlantUML diagram...")
    
    diagram_prompt = f"""
You are a senior software architect creating a C4 container diagram.
Based on the system description below, create a valid PlantUML C4 container diagram.
relation ships should be between containers and the interactions shoud represent the flow of data not the rendering.
System description:
{system_description}


Do NOT escape newlines - use actual line breaks
IMPORTANT: Instead of using local includes, use the StandardC4 online includes like this:
   !include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Return ONLY the PlantUML code with @startuml at the beginning and @enduml at the end. before giving it validate it with no syntax errors

"""

    diagram_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[
            {"role": "system", "content": "You are a software architect specializing in PlantUML diagrams."},
            {"role": "user", "content": diagram_prompt}
        ],
        temperature=0.2
    )

    system_diagram = diagram_response.choices[0].message.content.strip()
    system_diagram = system_diagram.replace('\\n', '\n')
    
    if not system_diagram.startswith('@startuml'):
        system_diagram = '@startuml\n' + system_diagram
    if not system_diagram.endswith('@enduml'):
        system_diagram = system_diagram + '\n@enduml'

    logger.info("Generating threats...")
    
    threat_prompt = f"""
You are a senior security engineer. Based on the following system description and PlantUML diagram:

System Description:
{system_description}

System Diagram:
{system_diagram}

Perform STRIDE-based threat modeling.
Identify:
- Assets
- Threats
- Severity (High, Medium, Low)
- Countermeasures

Return the result strictly as a JSON array with objects:
[
  {{
    "asset": "string",
    "threat": "string",
    "severity": "High|Medium|Low",
    "countermeasure": "string"
  }}
]
"""

    threat_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[
            {"role": "system", "content": "You are a security expert specialized in threat modeling."},
            {"role": "user", "content": threat_prompt}
        ],
        temperature=0.3
    )

    threats_output = threat_response.choices[0].message.content.strip()

    try:
        threats_json = json.loads(threats_output)
    except json.JSONDecodeError:

        json_match = re.search(r'\[\s*\{.*\}\s*\]', threats_output, re.DOTALL)
        if json_match:
            try:
                threats_json = json.loads(json_match.group(0))
            except:
                threats_json = {"error": "Could not parse JSON", "raw_output": threats_output}
        else:
            threats_json = {"error": "Could not parse JSON", "raw_output": threats_output}

    logger.info("Threat model generated successfully")

    return {
        "description": system_description,
        "diagram": system_diagram,
        "threats": threats_json,
        
    }

