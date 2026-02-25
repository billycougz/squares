import { dynamo } from '../lib/aws';
import { awsConfig } from '../lib/config';

export const BoardModel = {
    /**
     * fileById
     * @param {string} id 
     * @returns {Promise<Object|null>} The board item or null if not found
     */
    findById: async (id) => {
        const params = {
            TableName: awsConfig.tableName,
            Key: { id },
        };
        const { Item } = await dynamo.get(params);
        return Item || null;
    },

    /**
     * findNameById
     * Lightweight lookup that returns only the board name (for OG meta tags).
     * @param {string} id
     * @returns {Promise<string|null>}
     */
    findNameById: async (id) => {
        const params = {
            TableName: awsConfig.tableName,
            Key: { id },
            ProjectionExpression: 'boardName',
        };
        const { Item } = await dynamo.get(params);
        return Item?.boardName || null;
    },

    /**
     * create
     * @param {Object} item 
     * @returns {Promise<Object>} The created item
     */
    create: async (item) => {
        const params = {
            TableName: awsConfig.tableName,
            Item: item,
        };
        await dynamo.put(params);
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
            TableName: awsConfig.tableName,
            Item: item,
        };
        await dynamo.put(params);
        return item;
    }
};
