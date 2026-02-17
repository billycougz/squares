import AWS from 'aws-sdk';

if (process.env.AWS_ENDPOINT) {
    AWS.config.endpoint = process.env.AWS_ENDPOINT;
}

// In Next.js, we might want to ensure we don't initialize multiple times in dev,
// but for now, simple port is fine.
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const AWS_CONSTANTS = {
    SQUARES_TABLE_NAME: process.env.SQUARES_TABLE_NAME,
    BASE_FRONTEND_URL: process.env.BASE_FRONTEND_URL,
};

if (!AWS_CONSTANTS.SQUARES_TABLE_NAME) {
    throw new Error('SQUARES_TABLE_NAME environment variable is not defined');
}
if (!AWS_CONSTANTS.BASE_FRONTEND_URL) {
    throw new Error('BASE_FRONTEND_URL environment variable is not defined');
}

export {
    AWS,
    dynamo,
    sns,
    AWS_CONSTANTS,
};
