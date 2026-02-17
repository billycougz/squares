const appConfig = {
    baseUrl: process.env.BASE_FRONTEND_URL,
};

const awsConfig = {
    tableName: process.env.SQUARES_TABLE_NAME,
    topicArn: process.env.SNS_TOPIC_ARN,
};

if (!appConfig.baseUrl) {
    throw new Error('BASE_FRONTEND_URL environment variable is not defined');
}

if (!awsConfig.tableName) {
    throw new Error('SQUARES_TABLE_NAME environment variable is not defined');
}

if (!awsConfig.topicArn) {
    console.warn('SNS_TOPIC_ARN environment variable is not defined. SNS features may not work.');
}

export {
    appConfig,
    awsConfig,
};
