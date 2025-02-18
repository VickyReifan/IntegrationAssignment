const Joi = require("joi");

const SalesforceTokenValidationSchema = Joi.object({
	data: Joi.object({
		access_token: Joi.string().min(1).required(),
		instance_url: Joi.string().min(1).required(),
	}).required(),
}).required();

const accountValidationSchema = Joi.object({
	id: Joi.number().integer().required(),
	name: Joi.string().min(1).required(),
	industry: Joi.string().min(1).required(),
}).required();


module.exports = {
	SalesforceTokenValidationSchema,
	accountValidationSchema
}
