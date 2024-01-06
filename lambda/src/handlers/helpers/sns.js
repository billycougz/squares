const { sns } = require('./AWS');

const TopicArn = 'arn:aws:sns:us-east-1:210534634664:SquaresTopic';

async function publishMessage(Message, boardName) {
	const params = {
		Message,
		MessageAttributes: {
			boardName: {
				DataType: 'String',
				StringValue: boardName,
			},
		},
		TopicArn: TopicArn,
	};

	try {
		const response = await sns.publish(params).promise();
		console.log(`Message published: ${JSON.stringify(params)}`);
		console.log(`Response: ${JSON.stringify(response)}`);
		return { msg: 'Successfully published message to topic.' };
	} catch (error) {
		console.error(`Error publishing message to SNS topic: ${params.TopicArn}`);
		console.error(error);
		return { msg: 'Error publishing message to topic.', error };
	}
}

async function sendSmsMessage(phoneNumber, message) {
	const params = {
		Message: message,
		PhoneNumber: phoneNumber,
	};
	try {
		const response = await sns.publish(params).promise();
		console.log(`Message sent: ${JSON.stringify(params)}`);
		console.log(`Response: ${JSON.stringify(response)}`);
		return { msg: 'Successfully sent message.' };
	} catch (error) {
		console.error(`Error sending message.`);
		console.error(error);
		return { msg: 'Error sending message.', error };
	}
}

async function subscribeToBoard(boardName, phoneNumber) {
	try {
		// Check if phone number is already subscribed to SNS topic
		const listSubscriptionsResponse = await sns.listSubscriptionsByTopic({ TopicArn }).promise();
		const subscription = listSubscriptionsResponse.Subscriptions.find(
			(sub) => sub.Protocol === 'sms' && sub.Endpoint === phoneNumber
		);
		if (subscription) {
			const { Attributes } = await sns
				.getSubscriptionAttributes({ SubscriptionArn: subscription.SubscriptionArn })
				.promise();
			subscription.Attributes = Attributes;
			const existingFilterPolicy = JSON.parse(subscription.Attributes.FilterPolicy);
			if (existingFilterPolicy?.boardName?.some((name) => name === boardName)) {
				const msg = 'This phone number is already subscribed to this board.';
				console.log(msg);
				return { msg };
			}
			existingFilterPolicy.boardName.push(boardName);
			const setSubscriptionAttributesResponse = await sns
				.setSubscriptionAttributes({
					SubscriptionArn: subscription.SubscriptionArn,
					AttributeName: 'FilterPolicy',
					AttributeValue: JSON.stringify(existingFilterPolicy),
				})
				.promise();
			console.log(`Successfully updated SNS subscription filter policy: ${JSON.stringify(existingFilterPolicy)}`);
			console.log(`Response: ${JSON.stringify(setSubscriptionAttributesResponse)}`);
			return { msg: 'Successfully subscribed to board notifications.' };
		} else {
			// Phone number is not subscribed to SNS topic - create a new subscription with filter policy
			const subscribeResponse = await sns
				.subscribe({
					Protocol: 'sms',
					TopicArn,
					Endpoint: phoneNumber,
					Attributes: {
						FilterPolicy: JSON.stringify({ boardName: [boardName] }),
					},
				})
				.promise();

			console.log(
				`Successfully subscribed phone number to SNS topic with filter policy: ${JSON.stringify({
					boardName: [boardName],
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

module.exports = {
	publishMessage,
	subscribeToBoard,
	sendSmsMessage,
};
