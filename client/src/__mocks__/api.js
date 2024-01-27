const localDbKey = 'squares-local-db';

const getLocalDb = () => {
	const data = window.localStorage.getItem(localDbKey);
	return data ? JSON.parse(data) : [];
};

const updateLocalDb = (updatedBoard) => {
	const records = getLocalDb();
	const otherBoards = records.filter(({ id }) => id !== updatedBoard.id);
	window.localStorage.setItem(localDbKey, JSON.stringify([updatedBoard, ...otherBoards]));
};

export const createBoard = ({ boardName, teams, phoneNumber }) => {
	const initializeGrid = () => {
		const emptyValues = Array.from({ length: 11 }).map(() => null);
		return emptyValues.map(() => [...emptyValues]);
	};
	const boardData = {
		id: Date.now(),
		createdAt: Date.now(),
		adminCode: Date.now(),
		boardName,
		teams,
		squarePrice: 0,
		maxSquares: 0,
		payoutSliderValues: [25, 50, 75, 100],
		results: [{ quarter: 'Q1' }, { quarter: 'Q2' }, { quarter: 'Q3' }, { quarter: 'Q4' }],
		gridData: initializeGrid(),
	};
	updateLocalDb(boardData);
	console.warn('Board created locally.');
	return boardData;
};

export const loadBoard = ({ id, adminCode }) => {
	const records = getLocalDb();
	const boardData = records.find((record) => String(record.id) === String(id));
	if (boardData && !adminCode) {
		delete boardData.adminCode;
	}
	console.warn('Board loaded locally.');
	return boardData ? boardData : { error: 'Board not found in local DB.' };
};

export const updateBoard = (updateData) => {
	const { id, boardName, row, col, value, operation, scores = {} } = updateData;
	let Item = getLocalDb()?.find(({ id }) => id === updateData.id);
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
			const quarter = Item.results[value].quarter;
			const winner = gridData[row][col];
			Item.results[value] = {
				quarter,
				scores,
				row,
				col,
				winner,
			};
			// Disabled SMS in MOCK
			// const boardDeepLink = encodeURI(`${AWS_CONSTANTS.BASE_FRONTEND_URL}?id=${id}&anchor=results`);
			// const smsMessage = `The ${quarter} Squares results for ${boardName} are in. With a score of ${Item.teams.horizontal.name}: ${scores.horizontal}, ${Item.teams.vertical.name}: ${scores.vertical}, the win goes to ${winner}!\n\nTap the following link to open your Squares board.\n\n${boardDeepLink}`;
			// await publishMessage(smsMessage, id);
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
			// const { squarePrice, payoutSliderValues, maxSquares } = value;
			// Might want to handle this better
			Item = { ...Item, ...value };
			break;
		case 'update':
			Item = { ...Item, ...value };
			break;
		default:
			break;
	}
	updateLocalDb(Item);
	console.warn('Board updated locally.');
	return { Item };
};
