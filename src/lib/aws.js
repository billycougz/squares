import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { SNSClient } from "@aws-sdk/client-sns";

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocument.from(dynamoClient, {
    marshallOptions: {
        removeUndefinedValues: true,
    },
});

const snsClient = new SNSClient({});

export {
    dynamo,
    snsClient
};
