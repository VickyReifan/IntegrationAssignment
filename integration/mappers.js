function mapErpToSfAccount(record) {
	return {
		ERP_Account_Number__c: String(record.id),
		Name: record.name,
		Industry: record.industry,
	};
}

module.exports = {
	mapErpToSfAccount
}
