const AWS = require('aws-sdk');

if (process.env.AWS_ENDPOINT) {
	AWS.config.endpoint = process.env.AWS_ENDPOINT;
}

module.exports = AWS;
