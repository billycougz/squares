const { dynamo } = require('./helpers/AWS');
const { subscribeToBoard, sendSmsMessage } = require('./helpers/sns.js');
const { v4: uuidv4 } = require('uuid');

const handlePost = async (event) => {
	const { operation, id, boardName, phoneNumber } = JSON.parse(event.body);
	if (operation === 'subscribe') {
		const response = await subscribeToBoard(id, phoneNumber);
		if (response.msg === 'Successfully subscribed to board notifications.') {
			const msg = `You've successfully subscribed to Squares notifications for ${boardName}.\n\nConsider adding this phone number to your contacts.`;
			await sendSmsMessage(phoneNumber, msg);
		}
		return response;
	}
	return handleCreate(event);
};

const handleCreate = async (event) => {
	// Localized function to initialize the gird
	const initializeGrid = () => {
		const emptyValues = Array.from({ length: 11 }).map(() => null);
		return emptyValues.map(() => [...emptyValues]);
	};

	// Initialize the board
	const requestBody = JSON.parse(event.body);
	requestBody.Item.createdAt = Date.now();
	requestBody.Item.id = uuidv4();
	requestBody.Item.adminCode = uuidv4();
	requestBody.Item.gridData = initializeGrid();
	requestBody.Item.squarePrice = 0;
	requestBody.Item.payoutSliderValues = [25, 50, 75, 100];
	requestBody.Item.results = [{ quarter: 'Q1' }, { quarter: 'Q2' }, { quarter: 'Q3' }, { quarter: 'Q4' }];

	// Create the board
	await dynamo.put(requestBody).promise();

	if (requestBody.Item.phoneNumber) {
		// Send details to the board creator
		const userLink = `https://squares-lviii.com/?id=${requestBody.Item.id}`;
		const adminLink = `${userLink}&adminCode=${requestBody.Item.adminCode}`;
		const message = `Your Squares board ${requestBody.Item.boardName} is ready!\n\nUse this link to administer your board:\n\n${adminLink}\n\nShare this link with your participants:\n\n${userLink}.`;
		sendSmsMessage(requestBody.Item.phoneNumber, message);
	}

	return requestBody.Item;
};

module.exports = handlePost;
