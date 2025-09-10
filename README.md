# ThreatModAI

An AI-powered tool to analyze GitHub repositories, identify issues, and provide explanations with fixes.

## Features

- **Repository Exploration**: Clones GitHub repositories and analyzes their structure
- **Code Review**: Performs security and code quality analysis using tools like Semgrep and Bandit
- **AI Explanations**: Uses OpenAI to explain issues in simple terms and suggest fixes
- **API Access**: Secure API with Descope authentication

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ThreatModAI.git
   cd ThreatModAI
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables:
   ```bash
   # Required for AI explanations
   export OPENAI_API_KEY=your_openai_api_key
   
   # Optional: set port
   export PORT=5000
   
   # Optional: set environment
   export FLASK_ENV=development
   ```

## Usage

### Running the API server

```bash
python app.py
```

### Making API requests

```bash
curl -X POST http://localhost:5000/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"repo_url": "https://github.com/username/repo.git"}'
```

### Example response

```json
{
  "repo_summary": {
    "summary": "Repository structure details...",
    "diagram": "graph TD diagram content..."
  },
  "review_results": {
    "raw_findings": [
      {"issue": "Security vulnerability details..."},
      {"issue": "Code quality issue details..."}
    ]
  },
  "mentor_explanations": [
    "Explanation of issue 1 with suggested fix...",
    "Explanation of issue 2 with suggested fix..."
  ]
}
```

## Optional Tools

For full functionality, install these additional tools:

- [Semgrep](https://semgrep.dev/docs/getting-started/): `pip install semgrep`
- [Bandit](https://github.com/PyCQA/bandit): `pip install bandit`
- [Radon](https://radon.readthedocs.io/): `pip install radon`

## Architecture

ThreatModAI uses a three-agent workflow:

1. **Agent A**: Repository exploration and structure analysis
2. **Agent B**: Code review using security and quality tools
3. **Agent C**: AI-powered explanation of findings with suggested fixes

## License

MIT
