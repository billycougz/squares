const { dynamo, AWS_CONSTANTS } = require('./helpers/AWS');
const { subscribeToBoard, sendSmsMessage } = require('./helpers/sns.js');
const { v4: uuidv4 } = require('uuid');

const handlePost = async (event) => {
	const { operation, data } = JSON.parse(event.body);
	switch (operation) {
		case 'subscribe':
			return handleSubscribe(data);
		case 'create':
			return handleCreate(data);
		default:
			console.error(`Error: Unknown POST operation ${operation}.`);
	}
};

const handleSubscribe = async ({ id, phoneNumber, boardName }) => {
	const response = await subscribeToBoard(id, phoneNumber);
	if (response.msg === 'Successfully subscribed to board notifications.') {
		const msg = `You've successfully subscribed to Squares notifications for ${boardName}.\n\nConsider adding this phone number to your contacts.`;
		await sendSmsMessage(phoneNumber, msg);
	}
	return response;
};

const handleCreate = async (boardData) => {
	const { id, boardName, adminCode, phoneNumber } = boardData;
	delete boardData.phoneNumber; // Don't need to persist this with the other boardData

	const initializeGrid = () => {
		const emptyValues = Array.from({ length: 11 }).map(() => null);
		return emptyValues.map(() => [...emptyValues]);
	};

	// Initialize the board
	boardData.createdAt = Date.now();
	boardData.id = uuidv4();
	boardData.adminCode = uuidv4();
	boardData.gridData = initializeGrid();
	boardData.squarePrice = 0;
	boardData.maxSquares = 0;
	boardData.payoutSliderValues = [25, 50, 75, 100];
	boardData.results = [{ quarter: 'Q1' }, { quarter: 'Q2' }, { quarter: 'Q3' }, { quarter: 'Q4' }];

	// Create the board
	await dynamo
		.put({
			TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME,
			Item: boardData,
		})
		.promise();

	if (phoneNumber) {
		// Send details to the board creator
		const userLink = `${AWS_CONSTANTS.BASE_FRONTEND_URL}/?id=${id}`;
		const adminLink = `${userLink}&adminCode=${adminCode}`;
		const message = `Your Squares board ${boardName} is ready!\n\nUse this link to administer your board (keep it to yourself):\n\n${adminLink}\n\nShare this link with your participants:\n\n${userLink}.`;
		await sendSmsMessage(phoneNumber, message);
		await subscribeToBoard(id, phoneNumber);
		boardData.subscribedPhoneNumber = phoneNumber;
	}

	return boardData;
};

module.exports = handlePost;
