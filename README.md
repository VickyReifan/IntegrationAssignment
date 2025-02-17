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

---

## Setup & Installation

1. _Clone the Repository:_

   bash
   git clone https://github.com/VickyReifan/IntegrationAssignment  
   cd IntegrationAssignment

2. _Create the .env Files:_

    - Create mock-erp/.env (empty file) and integration/.env as described above.
    - Ensure integration/.env contains your environment-specific configuration and credentials.

3. In your salesforce developer Account add a custom field to the Account object called "ERP_Account_Number__c" of type Number.  
4. _Build and Run the Containers:_

   From the project root, run:

   bash
   docker-compose up --build

   This command builds the Docker images for both services and starts the containers.
4. _Verify the Services:_

   After the containers start, you should see output in the terminal indicating that both services are running.

   The integration service logs its progress to the console, including ERP data retrieval, Salesforce token acquisition, and Salesforce API calls.

---

## Running the Project

- The _mock-erp_ service starts on port _8054_ and serves ERP data at:

  http://localhost:8054/erp/accounts

- The _integration_ service automatically starts after the mock-erp service. It:
    - Fetches ERP data from the ERP_API_URL
    - Obtains an OAuth access token from Salesforce
    - Transforms and pushes the ERP data to Salesforce (creating Account records)
    - Logs output to the console

## Security & Configuration

- _Sensitive Data:_  
  All sensitive data (Salesforce credentials, tokens, etc.) are stored in .env files which are excluded from Git via the .gitignore rule.

- _Production Considerations:_  
  In a real production environment, consider using a dedicated secrets management service (e.g., Azure Key Vault).

---
