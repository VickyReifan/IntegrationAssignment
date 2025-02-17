const Joi = require("joi");
const axios = require("axios");
const SalesforceClient = require("./salesforce-client");
const config = require("./config");

const accountValidetionSchema = Joi.object({
	id: Joi.number().integer().required(),
	name: Joi.string().min(1).required(),
	industry: Joi.string().min(1).required(),
}).required();

class ErpToSalesforceIntegration {
	constructor(salesforceClient) {
		this.salesforceClient = salesforceClient;
	}

	async fetchErpData() {
		try {
			const response = await axios.get(config.erpApiUrl);
			console.log("Successfully fetched ERP data.");

			const validAccounts = [];
			for (const account of response.data) {
				const { error } = accountValidetionSchema.validate(account);
				if (error) {
					console.error(
						`Invalid account data (ID: ${account.id}):`,
						error.details.map((d) => d.message).join(", ")
					);
					continue;
				}
				validAccounts.push(account);
			}

			if (validAccounts.length === 0) {
				console.log("No valid accounts found.");
			} else {
				console.log("Valid accounts:", validAccounts);
			}

			return validAccounts;
		} catch (error) {
			console.error("Failed to fetch ERP data:", error.message);
			return [];
		}
	}

	transformData(record) {
		return {
			ERP_Account_Number__c: String(record.id),
			Name: record.name,
			Industry: record.industry,
		};
	}

	async run() {
		const erpData = await this.fetchErpData();
		if (!erpData || erpData.length === 0) {
			console.error("No ERP data to process. Exiting.");
			return;
		}

		for (const record of erpData) {
			const account = this.transformData(record);
			await this.salesforceClient.upsertAccount(account);
		}
	}
}

async function main() {
	const salesforceClient = new SalesforceClient();
	await salesforceClient.initialize();

	const integration = new ErpToSalesforceIntegration(salesforceClient);
	await integration.run();
}

main();