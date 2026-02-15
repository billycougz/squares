import { dynamo, AWS_CONSTANTS } from '../aws/AWS';
import getSquaresBoard from '../aws/getSquaresBoard';
import { publishMessage } from '../aws/sns';

async function handlePut(body) {
    return updateBoard(body);
}

const updateBoard = async (body) => {
    const { id, boardName, row, col, value, operation, scores = {} } = body;
    console.log('requesting table');
    let { Item } = await getSquaresBoard(id);
    console.log('received table');
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
            const boardDeepLink = encodeURI(`${AWS_CONSTANTS.BASE_FRONTEND_URL}?id=${id}&anchor=results`);
            const smsMessage = `The ${quarter} Squares results for ${boardName} are in. With a score of ${Item.teams.horizontal.name}: ${scores.horizontal}, ${Item.teams.vertical.name}: ${scores.vertical}, the win goes to ${winner}!\n\nTap the following link to open your Squares board. ${boardDeepLink}`;
            await publishMessage(smsMessage, id);
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
    Item.lastUpdated = Date.now();
    const updateRequest = {
        TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME,
        Item,
    };
    // Using dynamo.put() rather than dynamo.update() because put is simpler
    await dynamo.put(updateRequest).promise();
    return { Item };
};

export default handlePut;
