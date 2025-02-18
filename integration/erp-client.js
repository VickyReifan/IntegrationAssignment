const axios = require("axios");
const config = require("./config");
const {accountValidationSchema} = require("./validation-schemas");

class ErpClient {
	constructor() {
	}

	async fetchErpData() {
		try {
			const response = await axios.get(config.erpApiUrl);
			console.log("Successfully fetched ERP data.");

			const validAccounts = [];
			for (const account of response.data) {
				const {error} = accountValidationSchema.validate(account);
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
}

module.exports = ErpClient;
