const getSquaresBoard = require('./helpers/getSquaresBoard');

const handleGet = async (event) => {
	const { id, adminCode } = event.queryStringParameters;
	const { Item } = await getSquaresBoard(id);
	if (Item && adminCode) {
		return Item.adminCode === adminCode ? { Item } : { error: 'Admin code does not match.' };
	}
	if (Item) {
		return { Item };
	}
	return { error: `A Squares board with ID ${id} could not be found.` };
};

module.exports = handleGet;
