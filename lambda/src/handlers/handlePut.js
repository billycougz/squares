const { dynamo } = require('./helpers/AWS');
const getSquaresBoard = require('./helpers/getSquaresBoard');
const { publishMessage } = require('./helpers/sns.js');

async function handlePut(event) {
	return updateBoard(event);
}

const updateBoard = async (event) => {
	const { boardName, row, col, value, operation } = JSON.parse(event.body);
	const { Item } = await getSquaresBoard(boardName);
	switch (operation) {
		case 'select':
			if (!Item.gridData[row][col]) {
				Item.gridData[row][col] = value;
			}
			break;
		case 'remove':
			Item.gridData[row][col] = null;
			break;
		case 'result':
			const { gridData } = Item;
			Item.results[value] = {
				quarter: Item.results[value].quarter,
				horizontal: gridData[row][0],
				vertical: gridData[0][col],
				winner: gridData[row][col],
			};
			await publishMessage(boardName, Item.userCode);
			break;
		case 'numbers':
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
			break;
		case 'finances':
			const { squarePrice, payoutSliderValues } = value;
			Item.squarePrice = squarePrice;
			Item.payoutSliderValues = payoutSliderValues;
			break;
		default:
			break;
	}
	const updateRequest = {
		TableName: 'SquaresTable',
		Item,
	};
	// Using dynamo.put() rather than dynamo.update() because put is simpler
	await dynamo.put(updateRequest).promise();
	return { Item };
};

module.exports = handlePut;
