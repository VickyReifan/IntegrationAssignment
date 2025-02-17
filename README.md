# Salesforce Integration Flow Proof-of-Concept

This project demonstrates a minimal end-to-end integration flow using Node.js and Docker. It simulates an on-prem ERP system that feeds data into Salesforce via a REST API. The integration extracts ERP data, transforms it into the Salesforce Account format, and pushes records to Salesforce.

> _Data Flow:_  
> On-prem ERP (mocked via an Express API) → Integration Service (Node.js) → Salesforce (via OAuth and REST API)

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment File Setup](#environment-file-setup)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Testing the Integration Flow](#testing-the-integration-flow)
- [Error Handling & Logging](#error-handling--logging)
- [Security & Configuration](#security--configuration)
- [Cleanup](#cleanup)
- [Additional Notes](#additional-notes)

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- A Salesforce Developer account with a _Connected App_ configured for the OAuth username–password flow.
- Valid Salesforce credentials, including:
  - _Consumer Key_ (a.k.a. Client ID)
  - _Consumer Secret_
  - _Username_
  - _Password_
  - _Security Token_ (obtainable via your Salesforce personal settings)

---

## Environment File Setup

For security, sensitive credentials and configuration values are stored in .env files (which are not committed to version control). You must create these files manually in each service directory.

### Create mock-erp/.env

ini

# mock-erp/.env

PORT=8054

### Create integration/.env

ini

# integration/.env

ERP_API_URL=http://mock-erp:8054/erp/accounts
SALESFORCE_LOGIN_URL=https://login.salesforce.com/services/oauth2/token
SALESFORCE_CLIENT_ID=your_consumer_key
SALESFORCE_CLIENT_SECRET=your_consumer_secret
SALESFORCE_USERNAME=your_salesforce_username
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_SECURITY_TOKEN=your_salesforce_security_token
SALESFORCE_API_VERSION=v54.0

> _Note:_ Replace the placeholder values (e.g., your_consumer_key) with your actual Salesforce credentials.

### Update .gitignore

In your project root .gitignore, add the following line to ensure that all .env files in any subfolder are ignored:

\*\*/.env

---

## Setup & Installation

1. _Clone the Repository:_

   bash
   git clone <repository_url>
   cd project-root

2. _Create the .env Files:_

   - Create mock-erp/.env and integration/.env as described above.
   - Ensure these files contain your environment-specific configuration and credentials.

3. _Build and Run the Containers:_

   From the project root, run:

   bash
   docker-compose up --build

   This command builds the Docker images for both services and starts the containers.

---

## Running the Project

- The _mock-erp_ service starts on port _8054_ and serves ERP data at:

  http://localhost:8054/erp/accounts

- The _integration_ service automatically starts after the mock-erp service. It:
  - Fetches ERP data from the ERP_API_URL
  - Obtains an OAuth access token from Salesforce
  - Transforms and pushes the ERP data to Salesforce (creating Account records)
  - Logs output to the console

---

## Testing the Integration Flow

1. _Verify the ERP Service:_

   Open your browser or use Postman to GET:

   http://localhost:8054/erp/accounts

   You should see a JSON array similar to:

   json
   [
   {"id": 1, "name": "Acme Corp", "industry": "Manufacturing"},
   {"id": 2, "name": "Globex Inc", "industry": "Finance"}
   ]

2. _Check the Integration Logs:_

   Monitor the console output from Docker Compose. You should see log messages indicating:

   - Successful retrieval of ERP data.
   - Successful acquisition of a Salesforce access token.
   - Status of Account creation calls to Salesforce (including any errors).

---

## Error Handling & Logging

- _Network and API Errors:_  
  The integration service handles errors when fetching ERP data or making Salesforce API calls. Errors are logged with details to help diagnose issues.

- _Logging:_  
  The application logs key events (e.g., token retrieval, API call successes/failures) to the console.

- _Retry Logic:_  
  Basic error handling is in place; additional retry logic can be implemented as needed.

---

## Security & Configuration

- _Sensitive Data:_  
  All sensitive data (Salesforce credentials, tokens, etc.) are stored in .env files which are excluded from Git via the .gitignore rule.

- _Production Considerations:_  
  In a real production environment, consider using a dedicated secrets management service (e.g., Azure AD).

---

## Cleanup

To stop the containers, press Ctrl+C in the terminal running Docker Compose, then run:

bash
docker-compose down

---

## Additional Notes

- _File Watch & Development:_  
  For local development, consider mounting your source code as volumes and using a file-watching tool (e.g., nodemon) to auto-restart the application when code changes are detected.

- _Salesforce Integration:_  
  Ensure that your Connected App in Salesforce is properly configured for the OAuth username–password flow and that your credentials are correct.  
  If you encounter authentication errors, verify that your password is concatenated with your security token (if required) and that no IP restrictions are causing issues.

- _Customizations:_  
   This proof-of-concept can be extended with additional error handling, logging, and transformation logic as needed.
  ~
