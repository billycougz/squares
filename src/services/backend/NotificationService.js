import { PublishCommand, SubscribeCommand, ListSubscriptionsByTopicCommand, GetSubscriptionAttributesCommand, SetSubscriptionAttributesCommand } from "@aws-sdk/client-sns";
import { snsClient } from '../../lib/aws';
import { awsConfig } from '../../lib/config';

const TopicArn = awsConfig.topicArn;

if (!TopicArn) {
    throw new Error('SNS_TOPIC_ARN environment variable is not defined for NotificationService');
}

export const NotificationService = {
    publishMessage: async (Message, id) => {
        const params = {
            Message,
            MessageAttributes: {
                boardId: {
                    DataType: 'String',
                    StringValue: id,
                },
            },
            TopicArn: TopicArn,
        };

        try {
            const command = new PublishCommand(params);
            const response = await snsClient.send(command);
            console.log(`Message published: ${JSON.stringify(params)}`);
            console.log(`Response: ${JSON.stringify(response)}`);
            return { msg: 'Successfully published message to topic.' };
        } catch (error) {
            console.error(`Error publishing message to SNS topic: ${params.TopicArn}`);
            console.error(error);
            return { msg: 'Error publishing message to topic.', error };
        }
    },

    sendSmsMessage: async (phoneNumber, message) => {
        const params = {
            Message: message,
            PhoneNumber: phoneNumber,
        };
        try {
            const command = new PublishCommand(params);
            const response = await snsClient.send(command);
            console.log(`Message sent: ${JSON.stringify(params)}`);
            console.log(`Response: ${JSON.stringify(response)}`);
            return { msg: 'Successfully sent message.' };
        } catch (error) {
            console.error(`Error sending message.`);
            console.error(error);
            return { msg: 'Error sending message.', error };
        }
    },

    subscribeToBoard: async (id, phoneNumber) => {
        try {
            // Check if phone number is already subscribed to SNS topic
            const listCommand = new ListSubscriptionsByTopicCommand({ TopicArn });
            const listSubscriptionsResponse = await snsClient.send(listCommand);

            const subscription = listSubscriptionsResponse.Subscriptions?.find(
                (sub) => sub.Protocol === 'sms' && sub.Endpoint === phoneNumber.replace(/\s/g, '')
            );

            if (subscription) {
                const getAttributesCommand = new GetSubscriptionAttributesCommand({ SubscriptionArn: subscription.SubscriptionArn });
                const { Attributes } = await snsClient.send(getAttributesCommand);

                subscription.Attributes = Attributes;
                const existingFilterPolicy = JSON.parse(subscription.Attributes.FilterPolicy || '{}');

                if (existingFilterPolicy?.boardId?.some((existingId) => existingId === id)) {
                    const msg = 'This phone number is already subscribed.';
                    console.log(msg);
                    return { msg };
                }

                if (!existingFilterPolicy.boardId) {
                    existingFilterPolicy.boardId = [];
                }
                existingFilterPolicy.boardId.push(id);

                const setAttributesCommand = new SetSubscriptionAttributesCommand({
                    SubscriptionArn: subscription.SubscriptionArn,
                    AttributeName: 'FilterPolicy',
                    AttributeValue: JSON.stringify(existingFilterPolicy),
                });

                const setSubscriptionAttributesResponse = await snsClient.send(setAttributesCommand);

                console.log(`Successfully updated SNS subscription filter policy: ${JSON.stringify(existingFilterPolicy)}`);
                console.log(`Response: ${JSON.stringify(setSubscriptionAttributesResponse)}`);
                return { msg: 'Successfully subscribed to board notifications.' };
            } else {
                // Phone number is not subscribed to SNS topic - create a new subscription with filter policy
                const subscribeCommand = new SubscribeCommand({
                    Protocol: 'sms',
                    TopicArn,
                    Endpoint: phoneNumber,
                    Attributes: {
                        FilterPolicy: JSON.stringify({ boardId: [id] }),
                    },
                });

                const subscribeResponse = await snsClient.send(subscribeCommand);

                console.log(
                    `Successfully subscribed phone number to SNS topic with filter policy: ${JSON.stringify({
                        boardId: [id],
                    })}`
                );
                console.log(`Response: ${JSON.stringify(subscribeResponse)}`);
                return { msg: 'Successfully subscribed to board notifications.' };
            }
        } catch (error) {
            console.error(`Error subscribing phone number to SNS topic: ${error}`);
            return { msg: 'There was an error trying to subscribe to notifications.' };
        }
    }
};
