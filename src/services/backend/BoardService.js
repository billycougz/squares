import { BoardModel } from '../../models/BoardModel';
import { appConfig } from '../../lib/config';
import { NotificationService } from './NotificationService';
import { v4 as uuidv4 } from 'uuid';

export const BoardService = {
    /**
     * getBoard
     * Retrieves a board by ID and optionally validates admin access.
     */
    getBoard: async (id, adminCode) => {
        const board = await BoardModel.findById(id);
        if (!board) {
            throw new Error(`A Squares board with ID ${id} could not be found.`);
        }

        // Handle legacy data migration 'on-read' if necessary (similar to original getSquaresBoard)
        if (board.results && board.results[3] && board.results[3].quarter !== 'Final') {
            board.results[3].quarter = 'Final';
            // We could save this back, but let's just return the corrected version for now or save async
        }

        if (adminCode) {
            if (board.adminCode !== adminCode) {
                throw new Error('Admin code does not match.');
            }
            return board;
        }

        return board;
    },

    /**
     * createBoard
     * Creates a new board and handles initial notifications.
     */
    createBoard: async (data) => {
        const { phoneNumber, ...boardData } = data;

        // Initialize/Default values
        const newBoard = {
            ...boardData,
            id: uuidv4(),
            adminCode: uuidv4(),
            createdAt: Date.now(),
            lastUpdated: Date.now(),
            // Initialize 11x11 grid (header + 10x10) - logic kept from original handlePost
            gridData: Array.from({ length: 11 }).map(() => Array.from({ length: 11 }).fill(null)),
            squarePrice: 0,
            maxSquares: 0,
            payoutSliderValues: [25, 50, 75, 100],
            results: [{ quarter: 'Q1' }, { quarter: 'Q2' }, { quarter: 'Q3' }, { quarter: 'Final' }],
            version: 2,
            players: {},
        };

        await BoardModel.create(newBoard);

        if (phoneNumber) {
            const { id, boardName, adminCode } = newBoard;
            const userLink = `${appConfig.baseUrl}/?id=${id}`;
            const adminLink = `${userLink}&adminCode=${adminCode}`;
            const message = `Your Squares board ${boardName} is ready!\n\nUse this link to administer your board (keep it to yourself):\n\n${adminLink}\n\nShare this link with your participants:\n\n${userLink}.`;

            try {
                await NotificationService.sendSmsMessage(phoneNumber, message);
                await NotificationService.subscribeToBoard(id, phoneNumber);
                // We could update the board with subscribedPhoneNumber if needed, strictly following original logic
                // boardData.subscribedPhoneNumber = phoneNumber; 
                // avoiding re-save for now unless critical
            } catch (error) {
                console.error('Failed to send initial SMS:', error);
            }
        }

        return newBoard;
    },

    /**
     * subscribe
     */
    subscribe: async (id, phoneNumber) => {
        const board = await BoardModel.findById(id);
        if (!board) throw new Error('Board not found');

        const response = await NotificationService.subscribeToBoard(id, phoneNumber);

        if (response.msg === 'Successfully subscribed to board notifications.') {
            const userLink = encodeURI(`${appConfig.baseUrl}/?id=${id}`);
            const msg = `You've successfully subscribed to Squares notifications for ${board.boardName}. Consider adding this phone number to your contacts. ${userLink}`;
            await NotificationService.sendSmsMessage(phoneNumber, msg);
        }
        return response;
    },

    /**
     * updateSettings
     * General update for board settings (finances, etc)
     */
    updateSettings: async (id, updates) => {
        const board = await BoardModel.findById(id);
        if (!board) throw new Error('Board not found');

        const updatedBoard = { ...board, ...updates };
        await BoardModel.update(updatedBoard);
        return updatedBoard;
    },

    /**
     * selectSquare
     */
    selectSquare: async (id, row, col, value) => {
        const board = await BoardModel.findById(id);
        if (!board) throw new Error('Board not found');

        // Check if already taken
        if (!board.gridData[row][col]) {
            board.gridData[row][col] = value;
            await BoardModel.update(board);
        }
        return board;
    },

    /**
     * removeSquare
     */
    removeSquare: async (id, row, col) => {
        const board = await BoardModel.findById(id);
        if (!board) throw new Error('Board not found');

        board.gridData[row][col] = null;
        await BoardModel.update(board);
        return board;
    },

    /**
     * generateNumbers
     */
    generateNumbers: async (id) => {
        const board = await BoardModel.findById(id);
        if (!board) throw new Error('Board not found');

        const ordered = Array.from(Array(10).keys());
        const horizontal = [null, ...ordered.sort(() => 0.5 - Math.random())];
        const vertical = [null, ...ordered.sort(() => 0.5 - Math.random())];

        board.gridData = board.gridData.map((rowItem, rowIndex) => {
            if (rowIndex === 0) {
                return horizontal;
            }
            // rowIndex > 0
            const verticalValue = vertical[rowIndex];
            const newRow = [...rowItem];
            // Safe logic 
            const [, ...rest] = rowItem; // remove first
            return [verticalValue, ...rest];
        });

        await BoardModel.update(board);
        return board;
    },

    /**
     * setResult
     */
    setResult: async (id, resultIndex, scores, row, col) => {
        const board = await BoardModel.findById(id);
        if (!board) throw new Error('Board not found');

        const quarter = board.results[resultIndex].quarter;
        const winner = board.gridData[row][col];

        board.results[resultIndex] = {
            quarter,
            scores,
            row,
            col,
            winner,
        };

        await BoardModel.update(board);

        const boardDeepLink = encodeURI(`${appConfig.baseUrl}?id=${id}&anchor=results`);
        const smsMessage = `The ${quarter} Squares results for ${board.boardName} are in. With a score of ${board.teams.horizontal.name}: ${scores.horizontal}, ${board.teams.vertical.name}: ${scores.vertical}, the win goes to ${winner}!\n\nTap the following link to open your Squares board. ${boardDeepLink}`;

        try {
            await NotificationService.publishMessage(smsMessage, id);
        } catch (error) {
            console.error('Failed to publish result SMS:', error);
        }

        return board;
    }
};
