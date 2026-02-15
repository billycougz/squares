import { dynamo, AWS_CONSTANTS } from '../aws/AWS';
import { subscribeToBoard, sendSmsMessage } from '../aws/sns';
import { v4 as uuidv4 } from 'uuid';

const handlePost = async (body) => {
    const { operation, data } = body;
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
        const userLink = encodeURI(`${AWS_CONSTANTS.BASE_FRONTEND_URL}/?id=${id}`);
        const msg = `You've successfully subscribed to Squares notifications for ${boardName}. Consider adding this phone number to your contacts. ${userLink}`;
        await sendSmsMessage(phoneNumber, msg);
    }
    return response;
};

const handleCreate = async (boardData) => {
    // We don't need to store the admin's phoneNumber with the board data
    const { phoneNumber } = boardData;
    delete boardData.phoneNumber;

    const initializeGrid = () => {
        const emptyValues = Array.from({ length: 11 }).map(() => null);
        return emptyValues.map(() => [...emptyValues]);
    };

    // Initialize the board
    boardData.createdAt = Date.now();
    boardData.lastUpdated = Date.now();
    boardData.id = uuidv4(); // V2: Provide ID if not present?
    boardData.adminCode = uuidv4();
    boardData.gridData = initializeGrid();
    boardData.squarePrice = 0;
    boardData.maxSquares = 0;
    boardData.payoutSliderValues = [25, 50, 75, 100];
    boardData.results = [{ quarter: 'Q1' }, { quarter: 'Q2' }, { quarter: 'Q3' }, { quarter: 'Final' }];

    // V2: Add version and players object
    boardData.version = 2;
    boardData.players = {};

    // Create the board
    await dynamo
        .put({
            TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME,
            Item: boardData,
        })
        .promise();

    if (phoneNumber) {
        // Send details to the board creator
        const { id, boardName, adminCode } = boardData;
        const userLink = `${AWS_CONSTANTS.BASE_FRONTEND_URL}/?id=${id}`;
        const adminLink = `${userLink}&adminCode=${adminCode}`;
        const message = `Your Squares board ${boardName} is ready!\n\nUse this link to administer your board (keep it to yourself):\n\n${adminLink}\n\nShare this link with your participants:\n\n${userLink}.`;
        await sendSmsMessage(phoneNumber, message);
        await subscribeToBoard(id, phoneNumber);
        boardData.subscribedPhoneNumber = phoneNumber;
    }

    return boardData;
};

export default handlePost;
