import AWS from 'aws-sdk';

if (process.env.AWS_ENDPOINT) {
    AWS.config.endpoint = process.env.AWS_ENDPOINT;
}

// In Next.js, we might want to ensure we don't initialize multiple times in dev,
// but for now, simple port is fine.
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const AWS_CONSTANTS = {
    SQUARES_TABLE_NAME: 'SquaresTable',
    BASE_FRONTEND_URL: 'https://squares.billycougan.com', // ToDo: Make this dynamic or env var
};

export {
    AWS,
    dynamo,
    sns,
    AWS_CONSTANTS,
};
