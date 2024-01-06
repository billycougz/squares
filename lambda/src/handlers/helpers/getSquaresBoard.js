const { dynamo } = require('./AWS');

const getSquaresBoard = async (id) => {
	const { Item } = await dynamo
		.get({
			TableName: 'SquaresTable-v2',
			Key: { id },
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
	if (!Item.teams) {
		Item.teams = {
			horizontal: { code: 'PHI', name: 'Eagles', location: 'Philadelphia', color: '#004C54' },
			vertical: { code: 'KC', name: 'Chiefs', location: 'Kansas City', color: '#E31837' },
		};
		propertyAdded = true;
	}
	if (propertyAdded) {
		await dynamo.put({ TableName: 'SquaresTable-v2', Item }).promise();
	}
	return Item;
};

module.exports = getSquaresBoard;
