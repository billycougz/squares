const AWS = require('aws-sdk');

if (process.env.AWS_ENDPOINT) {
	AWS.config.endpoint = process.env.AWS_ENDPOINT;
}

module.exports = AWS;
module.exports.dynamo = new AWS.DynamoDB.DocumentClient();
module.exports.sns = new AWS.SNS();

module.exports.AWS_CONSTANTS = {
	SQUARES_TABLE_NAME: 'SquaresTable-v2',
	BASE_FRONTEND_URL: 'https://squares-lviii.com',
};
