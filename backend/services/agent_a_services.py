import os
import re
import logging
import tempfile
import shutil
from dotenv import load_dotenv
import git
import json

load_dotenv()

from openai import AzureOpenAI
client = AzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

FILE_PATTERNS = {
    "documentation": [
        r"README\.md$",
        r"ARCHITECTURE\.md$",
        r"DESIGN\.md$"
    ],
    "code": [
        r"\.py$",
        r"\.js$",
        r"\.ts$",
        r"\.java$",
        r"\.go$"
    ],
    "dependencies": [
        r"package\.json$",
        r"requirements\.txt$"
    ],
    "docker": [
        r"Dockerfile$",
        r"docker-compose\.ya?ml$"
    ],
    "api_specs": [
        r"swagger\.json$",
        r"openapi\.ya?ml$"
    ],
    "terraform": [
        r"\.tf$"
    ],
    "workflows": [
        r"\.github/workflows/.*\.ya?ml$"
    ]
}

def extract_repo(repo_url):
    logger.info(f"Starting repository extraction for {repo_url}")

    extracted = _get_repo_details(repo_url)

    filename_summary = _create_filename_summary(extracted)

    ai_relevant_files = _get_ai_relevant_files(filename_summary)
    logger.info("Received AI file recommendations")
    
    filtered_extracted = _filter_extracted_by_ai_result(extracted, ai_relevant_files)
    logger.info("Filtered repository data based on AI recommendations")

    return filtered_extracted

def _get_repo_details(repo_url):
    extracted = {key: [] for key in FILE_PATTERNS.keys()}
    temp_dir = tempfile.mkdtemp(prefix="repo_clone_")

    try:
        logger.info(f"Cloning repository {repo_url}")
        git.Repo.clone_from(repo_url, temp_dir, depth=1)

        for root, _, files in os.walk(temp_dir):
            if '.git' in root:
                continue

            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, temp_dir)

                for category, patterns in FILE_PATTERNS.items():
                    for pattern in patterns:
                        if re.search(pattern, rel_path, re.IGNORECASE):
                            try:
                                with open(file_path, 'r', encoding='utf-8') as f:
                                    content = f.read()
                            except UnicodeDecodeError:
                                try:
                                    with open(file_path, 'r', encoding='latin-1') as f:
                                        content = f.read()
                                except Exception as e:
                                    content = f"[ERROR reading file: {str(e)}]"
                            except Exception as e:
                                content = f"[ERROR reading file: {str(e)}]"

                            extracted[category].append({
                                "path": rel_path,
                                "content": content
                            })
                            logger.info(f"Extracted {rel_path} in category {category}")
                            break

    except Exception as e:
        logger.error(f"Error cloning or reading the repository: {str(e)}")
    finally:
        try:
            shutil.rmtree(temp_dir)
            logger.info(f"Removed temporary directory {temp_dir}")
        except Exception as e:
            logger.error(f"Failed to remove temporary directory: {str(e)}")
    
    return extracted


def _create_filename_summary(extracted):

    summary = {}
    for category, files in extracted.items():
        summary[category] = []
        for file in files:
            truncated_content = file['content'][:200] + "..." if len(file['content']) > 200 else file['content']
            summary[category].append({"path": file['path'], "content": truncated_content})
    return summary


def _filter_extracted_by_ai_result(extracted, ai_relevant_files):

    filtered = {}
    for category, files in extracted.items():

        relevant_items = ai_relevant_files.get(category, [])
        
        relevant_paths = []
        for item in relevant_items:
            if isinstance(item, str):
                relevant_paths.append(item)
            elif isinstance(item, dict) and 'path' in item:
                relevant_paths.append(item['path']) 
        
        filtered[category] = [f for f in files if f['path'] in relevant_paths]
        
    return filtered
def _get_ai_relevant_files(filename_summary):
    """
    Send filenames to Azure OpenAI and get relevant files.
    """
    summary_str = json.dumps(filename_summary, indent=2)

    prompt = f"""
You are given a list of filenames categorized by type from a GitHub repository.
Decide which files are relevant for understanding total flow of a system and code reviewing. Include the files which tells about the system and gets good diagram .  Return the output in JSON format with the same categories, 
but only include filenames that are relevant.

Input:
{summary_str}

Output:
    """

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[
            {"role": "system", "content": "You are an expert code reviewer and repository analyzer."},
            {"role": "user", "content": prompt}
        ],
        max_completion_tokens=800
    )

    ai_reply = response.choices[0].message.content

    try:
        relevant_files = json.loads(ai_reply)
        
    except json.JSONDecodeError:
        print(ai_reply)
        relevant_files = {}

    return relevant_files
