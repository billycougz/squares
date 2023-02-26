const { dynamo } = require('./helpers/AWS');
const getSquaresBoard = require('./helpers/getSquaresBoard');
const { subscribeToBoard } = require('./helpers/sns.js');

const handlePost = (event) => {
	const { operation, boardName, phoneNumber } = JSON.parse(event.body);
	if (operation === 'subscribe') {
		return subscribeToBoard(boardName, phoneNumber);
	}
	return handleCreate(event);
};

const handleCreate = async (event) => {
	const initializeGrid = () => {
		const emptyValues = Array.from({ length: 11 }).map(() => null);
		return emptyValues.map(() => [...emptyValues]);
	};
	const requestBody = JSON.parse(event.body);
	const data = await getSquaresBoard(requestBody.Item.boardName);
	if (data.Item) {
		return { error: 'This Squares name already exists. Please choose another name.' };
	} else {
		requestBody.Item.gridData = initializeGrid();
		requestBody.Item.squarePrice = 0;
		requestBody.Item.payoutSliderValues = [25, 50, 75, 100];
		requestBody.Item.results = [{ quarter: 'Q1' }, { quarter: 'Q2' }, { quarter: 'Q3' }, { quarter: 'Q4' }];
		await dynamo.put(requestBody).promise();
		return requestBody.Item;
	}
};

module.exports = handlePost;
