import { dynamo, AWS_CONSTANTS } from './AWS';

const getSquaresBoard = async (id) => {
    const { Item } = await dynamo
        .get({
            TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME,
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
    // ToDo: Implement rules upon breaking model changes
    if (propertyAdded) {
        await dynamo.put({ TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME, Item }).promise();
    }
    // ToDo: Added Feb 2024 - last minute hack to account for swap from Q4 to final
    if (Item.results && Item.results[3]) {
        Item.results[3].quarter = 'Final';
    }
    return Item;
};

export default getSquaresBoard;
