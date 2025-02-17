const Joi = require("joi");
const axiosRetry = require("axios-retry").default;
const axios = require("axios");
const qs = require("qs");
const config = require("./config");

const SalesforceTokenValidetionSchema = Joi.object({
	data: Joi.object({
		access_token: Joi.string().min(1).required(),
		instance_url: Joi.string().min(1).required(),
	}).required(),
}).required();

class SalesforceClient {
	constructor() {}

	async initialize() {
		try {
			this.salesforceAuth = await this.obtainSalesforceToken();
			console.log("Salesforce client initialized.");
		} catch (error) {
			console.error("Failed to initialize Salesforce client:", error);
			process.exit(1);
		}
	}

	async obtainSalesforceToken() {
		const data = {
			grant_type: "password",
			client_id: config.salesforceClientId,
			client_secret: config.salesforceClientSecret,
			username: config.salesforceUsername,
			password: config.salesforcePassword + config.salesforceSecurityToken,
		};

		try {
			console.log("Authenticating with Salesforce.");
			const response = await axios.post(config.salesforceLoginUrl, qs.stringify(data), {
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});

			const { error } = SalesforceTokenValidetionSchema.validate(response, {
				allowUnknown: true,
			});

			if (error) {
				console.error(
					"Invalid Salesforce token data:",
					error.details.map((d) => d.message).join(", ")
				);
				throw new Error("Invalid Salesforce token data.");
			}

			console.log("Obtained Salesforce access token.");
			return {
				access_token: response.data?.access_token,
				instance_url: response.data?.instance_url,
			};
		} catch (error) {
			console.error(
				"Error obtaining Salesforce token:",
				error.response ? error.response?.data : error.message
			);
			throw error;
		}
	}

	async upsertAccount(account) {
		const salesforceApiUrl = `${this.salesforceAuth.instance_url}/services/data/${config.salesforceApiVersion}/sobjects/Account`;
		const headers = {
			Authorization: `Bearer ${this.salesforceAuth.access_token}`,
			"Content-Type": "application/json",
		};

		try {
			const query = `SELECT Id FROM Account WHERE ERP_Account_Number__c = ${account.ERP_Account_Number__c} LIMIT 1`;
			const queryUrl = `${this.salesforceAuth.instance_url}/services/data/${config.salesforceApiVersion}/query/?q=${encodeURIComponent(
				query
			)}`;

			const queryResponse = await axios.get(queryUrl, { headers });

			if (queryResponse.data.records.length > 0) {
				const accountId = queryResponse.data.records[0].Id;
				const updateUrl = `${salesforceApiUrl}/${accountId}`;
				await axios.patch(updateUrl, account, { headers });
				console.log(
					`Account updated successfully: ERP Account Number ${account.ERP_Account_Number__c}`
				);
			} else {
				const createResponse = await axios.post(salesforceApiUrl, account, {
					headers,
				});
				console.log(
					`Account created successfully. Salesforce ID: ${createResponse.data.id}`
				);
			}
		} catch (error) {
			if (error.response && error.response.data) {
				console.error("Error upserting to Salesforce:", error.response.data);
			} else {
				console.error("Error upserting to Salesforce:", error.message);
			}
		}
	}
}

axiosRetry(axios, {
	retries: config.retryCount,
	retryDelay: axiosRetry.exponentialDelay,
	shouldRetry: (error) => {
		return (
			(error.response && error.response.status >= 500) ||
			axiosRetry.isNetworkError(error)
		);
	},
});

module.exports = SalesforceClient;