const getSquaresBoard = require('./helpers/getSquaresBoard');

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
		return { error: `A Squares board named ${boardName} could not be found.` };
	}
};

module.exports = handleGet;
