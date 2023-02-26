const AWS = require('./AWS');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { publishMessage, subscribeToBoard } = require('./sns.js');

const getSquaresBoard = async (boardName) => {
	const { Item } = await dynamo
		.get({
			TableName: 'SquaresTable',
			Key: { boardName },
		})
		.promise();
	if (Item) {
		const updatedItem = await handleModelChanges(Item);
		return { Item: updatedItem };
	}
	return {};
};

const handleModelChanges = async (Item) => {
	let propertyAdded = false;
	if (!Item.results) {
		Item.results = [{ quarter: 'Q1' }, { quarter: 'Q2' }, { quarter: 'Q3' }, { quarter: 'Q4' }];
		propertyAdded = true;
	}
	if (!Item.payoutSliderValues) {
		Item.squarePrice = 0;
		Item.payoutSliderValues = [25, 50, 75, 100];
		propertyAdded = true;
	}
	if (propertyAdded) {
		await dynamo.put({ TableName: 'SquaresTable', Item }).promise();
	}
	return Item;
};

const handleGet = async (event) => {
	const { boardName, userCode, adminCode } = event.queryStringParameters;
	const { Item } = await getSquaresBoard(boardName);
	if (Item && adminCode) {
		return Item.adminCode === adminCode ? { Item } : { error: 'Admin code does not match.' };
	} else if (Item && userCode) {
		return Item.userCode === userCode ? { Item } : { error: 'User code does not match.' };
	} else if (!adminCode && !userCode) {
		return { error: 'Please provide a code.' };
	} else if (!Item) {
		return { error: 'Squares with this name could not be found.' };
	}
};

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

const handleUpdate = async (event) => {
	const { boardName, row, col, value, operation } = JSON.parse(event.body);
	const { Item } = await getSquaresBoard(boardName);
	if (operation === 'numbers') {
		const ordered = Array.from(Array(10).keys());
		const horizontal = [null, ...ordered.sort((a, b) => 0.5 - Math.random())];
		const vertical = [null, ...ordered.sort((a, b) => 0.5 - Math.random())];
		Item.gridData = Item.gridData.map((roww, rowIndex) => {
			if (rowIndex) {
				const verticalValue = vertical[rowIndex];
				roww.shift();
				return [verticalValue, ...roww];
			}
			return horizontal;
		});
	}
	if (operation === 'select' && !Item.gridData[row][col]) {
		Item.gridData[row][col] = value;
	}
	if (operation === 'remove') {
		Item.gridData[row][col] = null;
	}
	if (operation === 'result') {
		const { gridData } = Item;
		if (!Item.results) {
			Item.results = [];
		}
		Item.results[value] = {
			quarter: Item.results[value].quarter,
			horizontal: gridData[row][0],
			vertical: gridData[0][col],
			winner: gridData[row][col],
		};
		await publishMessage(boardName);
	}
	if (operation === 'finances') {
		const { squarePrice, payoutSliderValues } = value;
		Item.squarePrice = squarePrice;
		Item.payoutSliderValues = payoutSliderValues;
	}
	const updateRequest = {
		TableName: 'SquaresTable',
		Item,
	};
	// Using dynamo.put() rather than dynamo.update() because put is simpler
	await dynamo.put(updateRequest).promise();
	return { Item };
};

module.exports = {
	handleGet,
	handleCreate,
	handleUpdate,
	handlePost,
};
