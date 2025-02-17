require("dotenv").config();

module.exports = {
	salesforceLoginUrl: process.env.SALESFORCE_LOGIN_URL,
	salesforceClientId: process.env.SALESFORCE_CLIENT_ID,
	salesforceClientSecret: process.env.SALESFORCE_CLIENT_SECRET,
	salesforceUsername: process.env.SALESFORCE_USERNAME,
	salesforcePassword: process.env.SALESFORCE_PASSWORD,
	salesforceSecurityToken: process.env.SALESFORCE_SECURITY_TOKEN,
	salesforceApiVersion: process.env.SALESFORCE_API_VERSION || "v54.0",
	erpApiUrl: process.env.ERP_API_URL || "http://mock-erp:8085/erp/accounts",
	retryCount: process.env.RETRY_COUNT? parseInt(process.env.RETRY_COUNT, 10): 3,
};