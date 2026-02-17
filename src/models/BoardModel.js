import { dynamo, AWS_CONSTANTS } from '../lib/aws/AWS';

export const BoardModel = {
    /**
     * fileById
     * @param {string} id 
     * @returns {Promise<Object|null>} The board item or null if not found
     */
    findById: async (id) => {
        const params = {
            TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME,
            Key: { id },
        };
        const { Item } = await dynamo.get(params).promise();
        return Item || null;
    },

    /**
     * create
     * @param {Object} item 
     * @returns {Promise<Object>} The created item
     */
    create: async (item) => {
        const params = {
            TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME,
            Item: item,
        };
        await dynamo.put(params).promise();
        return item;
    },

    /**
     * update
     * @param {Object} item 
     * @returns {Promise<Object>} The updated item
     */
    update: async (item) => {
        // Ensure lastUpdated is set
        item.lastUpdated = Date.now();

        const params = {
            TableName: AWS_CONSTANTS.SQUARES_TABLE_NAME,
            Item: item,
        };
        await dynamo.put(params).promise();
        return item;
    }
};
