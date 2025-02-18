const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const SalesforceClient = require("./salesforce-client");
const config = require("./config");
const ErpClient = require("./erp-client");
const {mapErpToSfAccount} = require("./mappers");

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

async function main() {
	try {
		const salesforceClient = new SalesforceClient();
		await salesforceClient.initialize();
	
		const erpClient = new ErpClient();
		const erpData = await erpClient.fetchErpData();
		if (!erpData || erpData.length === 0) {
			console.info("No ERP data to process. Exiting.");
			return;
		}
	
		for (const record of erpData) {
			const account = mapErpToSfAccount(record);
			await salesforceClient.upsertAccount(account);
		}
	} catch (error) {
		console.error("An error occurred during integration:", error);
	}
}

main();
