# ThreatModAI: AI-Powered Security Threat Modeling

## Global MCP Hackathon 2025 Submission


## 🎯 Hackathon Challenge Addressed

This project addresses the **Secure agent - agent communication with descope** theme of the Global MCP Hackathon, focusing on leveraging AI to automate and enhance the security threat modeling process for software repositories. ThreatModAI aims to make advanced security analysis accessible to developers who might not have extensive security expertise.

## 🔍 What I Built

ThreatModAI is an intelligent threat modeling application that automatically analyzes GitHub repositories to identify potential security vulnerabilities. The system:

1. Extracts code repository structure and architecture
2. Identifies security threats and vulnerabilities
3. Generates comprehensive threat models with severity assessments
4. Creates detailed security reports with recommended countermeasures
5. Delivers reports via email and downloadable PDF

### Objectives
Threat ModAI aims to automate the threat modeling process while ensuring secure agent-to-agent communication using Descope. The project:
1.Automate the traditionally manual steps in threat modeling, including threat identification, risk assessment, and mitigation recommendation.
2.Enable multi-agent collaboration, where different agents can analyze different aspects of the system (e.g., code, architecture, configuration) securely.
3.Use Descope to manage authentication, authorization, and consent between agents, ensuring secure and compliant agent-to-agent communication.
4.Provide a scalable solution that can be integrated with CI/CD pipelines or security dashboards for continuous threat assessment.
### Key Features

- **Automated Security Analysis**: Scans GitHub repositories to detect potential security threats
- **System Architecture Visualization**: Generates diagrams showing system components and their relationships
- **Threat Severity Assessment**: Categorizes threats by High, Medium, and Low severity
- **Countermeasure Recommendations**: Provides actionable security recommendations
- **PDF Report Generation**: Creates comprehensive security reports
- **Email Delivery**: Automatically emails security reports to users

## 🛠️ Tech Stack

- **Frontend**:
  - React with Vite
  - TailwindCSS for styling

- **Backend**:
  - Python with Flask
  - LangGraph for multi-agent orchestration
  - OpenAI API for AI analysis
  - PlantUML for system architecture diagrams

- **Authentication & Email**:
  - Descope for user authentication
  - Descope Inbound Apps for secure communication with descope
  - Descope Outbound Apps for email delivery via Gmail API

- **AI**:
  - AI/ML: Azure OpenAI API for security threat analysis

## 🚀 How to Run the Project

### Prerequisites
- Python 3.8+
- Node.js 16+
- Descope account with Gmail Outbound App and inbound apps configured
- Azure OpenAI API key

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
### Demo Video Link
https://www.youtube.com/watch?v=-4v0hfxf60k

