import { BoardModel } from '../../models/BoardModel';
import { appConfig } from '../../lib/config';
import { NotificationService } from './NotificationService';
import { getSportConfig, getDefaultResults, getPeriodLabel } from '../../lib/sportConfig';
import { v4 as uuidv4 } from 'uuid';

import type { Team } from '../../lib/constants';

/* ─── Types ─────────────────────────────────────────────────── */

interface BoardTeams {
    horizontal: Team;
    vertical: Team;
}

interface CreateBoardData {
    boardName: string;
    sport?: string;
    customPeriods?: number;
    teams: BoardTeams;
    test?: boolean;
}

interface Result {
    quarter: string;
    scores?: { horizontal: number; vertical: number };
    row?: number;
    col?: number;
    winner?: string;
}

interface Board {
    id: string;
    adminCode: string;
    boardName: string;
    sport?: string;
    customPeriods?: number;
    teams: BoardTeams;
    gridData: (string | number | null)[][];
    squarePrice: number;
    maxSquares: number;
    payoutSliderValues: number[];
    results: Result[];
    version: number;
    players: Record<string, string>;
    createdAt: number;
    lastUpdated: number;
    adminIntroComplete?: boolean;
    venmoUsername?: string;
    financeMessage?: string;
    retainAmount?: number;
    reversePercent?: number;
    subscribedPhoneNumber?: string;
    [key: string]: unknown;
}

/* ─── Service ───────────────────────────────────────────────── */

export const BoardService = {
    /**
     * getBoard
     * Retrieves a board by ID and optionally validates admin access.
     */
    getBoard: async (id: string, adminCode?: string): Promise<Board> => {
        const board = await BoardModel.findById(id) as Board | null;
        if (!board) {
            throw new Error(`A Squares board with ID ${id} could not be found.`);
        }

        // Handle legacy data migration 'on-read'
        // Legacy boards won't have a sport field — default to NFL
        if (!board.sport) {
            board.sport = 'nfl';
        }

        // Legacy: rename Q4 → Final if needed
        if (board.results && board.results[3] && board.results[3].quarter !== 'Final') {
            board.results[3].quarter = 'Final';
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
    createBoard: async (data: CreateBoardData): Promise<Board> => {
        const { ...boardData } = data;
        const sportKey = boardData.sport || 'nfl';
        const customPeriods = boardData.customPeriods;
        const sportConfig = getSportConfig(sportKey, customPeriods);

        // Initialize/Default values
        const newBoard: Board = {
            ...boardData,
            sport: sportKey,
            id: uuidv4(),
            adminCode: uuidv4(),
            createdAt: Date.now(),
            lastUpdated: Date.now(),
            // Initialize 11x11 grid (header + 10x10)
            gridData: Array.from({ length: 11 }).map(() => Array.from({ length: 11 }).fill(null)) as (string | number | null)[][],
            squarePrice: 0,
            maxSquares: 0,
            payoutSliderValues: [...sportConfig.defaultPayouts],
            results: getDefaultResults(sportKey, customPeriods),
            version: 2,
            players: {},
        };

        await BoardModel.create(newBoard);

        return newBoard;
    },

    /**
     * setAdminPhone
     * Sets the admin phone number, sends intro SMS, and subscribes to notifications.
     */
    setAdminPhone: async (id: string, phoneNumber: string): Promise<{ subscribedPhoneNumber: string }> => {
        const board = await BoardModel.findById(id) as Board | null;
        if (!board) throw new Error('Board not found');

        const { boardName, adminCode } = board;
        const userLink = `${appConfig.baseUrl}/?id=${id}`;
        const adminLink = `${userLink}&adminCode=${adminCode}`;
        const message = `Your Squares board ${boardName} is ready!\n\nUse this link to administer your board (keep it to yourself):\n\n${adminLink}\n\nShare this link with your participants:\n\n${userLink}.`;

        try {
            await NotificationService.sendSmsMessage(phoneNumber, message);
            await NotificationService.subscribeToBoard(id, phoneNumber);
        } catch (error) {
            console.error('Failed to send admin SMS:', error);
        }

        return { subscribedPhoneNumber: phoneNumber };
    },

    /**
     * subscribe
     */
    subscribe: async (id: string, phoneNumber: string) => {
        const board = await BoardModel.findById(id) as Board | null;
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
    updateSettings: async (id: string, updates: Partial<Board>) => {
        const board = await BoardModel.findById(id) as Board | null;
        if (!board) throw new Error('Board not found');

        const updatedBoard = { ...board, ...updates };
        await BoardModel.update(updatedBoard);
        return updatedBoard;
    },

    /**
     * selectSquare
     *
     * Name is bundled here (not a separate endpoint) to avoid amplifying the
     * read-modify-write race condition in BoardModel.update(). See BACKLOG.md
     * for the full rationale and DynamoDB UpdateExpression migration plan.
     */
    selectSquare: async (id: string, row: number, col: number, value: string, name?: string) => {
        const board = await BoardModel.findById(id) as Board | null;
        if (!board) throw new Error('Board not found');

        // Validate symbol-name uniqueness
        if (name && board.players) {
            const existingName = board.players[value];
            if (existingName && existingName !== name) {
                throw new Error(`SYMBOL_CONFLICT:${existingName}`);
            }
        }

        // Check if already taken
        if (!board.gridData[row][col]) {
            board.gridData[row][col] = value;

            // Store the symbol→name mapping
            if (name) {
                if (!board.players) board.players = {};
                board.players[value] = name;
            }

            await BoardModel.update(board);
        }
        return board;
    },

    /**
     * removeSquare
     */
    removeSquare: async (id: string, row: number, col: number) => {
        const board = await BoardModel.findById(id) as Board | null;
        if (!board) throw new Error('Board not found');

        board.gridData[row][col] = null;
        await BoardModel.update(board);
        return board;
    },

    /**
     * generateNumbers
     */
    generateNumbers: async (id: string) => {
        const board = await BoardModel.findById(id) as Board | null;
        if (!board) throw new Error('Board not found');

        const ordered = Array.from(Array(10).keys());
        const horizontal = [null, ...ordered.sort(() => 0.5 - Math.random())];
        const vertical = [null, ...ordered.sort(() => 0.5 - Math.random())];

        board.gridData = board.gridData.map((rowItem, rowIndex) => {
            if (rowIndex === 0) {
                return horizontal;
            }
            const verticalValue = vertical[rowIndex];
            const [, ...rest] = rowItem;
            return [verticalValue, ...rest];
        });

        await BoardModel.update(board);
        return board;
    },

    /**
     * setResult
     */
    setResult: async (id: string, resultIndex: number, scores: { horizontal: number; vertical: number }, row: number, col: number) => {
        const board = await BoardModel.findById(id) as Board | null;
        if (!board) throw new Error('Board not found');

        const periodKey = board.results[resultIndex].quarter;
        const winner = board.gridData[row][col] as string;

        board.results[resultIndex] = {
            quarter: periodKey,
            scores,
            row,
            col,
            winner,
        };

        await BoardModel.update(board);

        // Build sport-aware SMS message
        const periodLabel = getPeriodLabel(periodKey, board.sport);

        const boardDeepLink = encodeURI(`${appConfig.baseUrl}?id=${id}&anchor=results`);
        const rawWinnerName = board.players?.[winner];
        const winnerName = rawWinnerName && typeof rawWinnerName === 'string' ? rawWinnerName : null;
        const winnerDisplay = winnerName ? `${winnerName} (${winner})` : winner;
        const smsMessage = `The ${periodLabel} Squares results for ${board.boardName} are in. With a score of ${board.teams.horizontal.name}: ${scores.horizontal}, ${board.teams.vertical.name}: ${scores.vertical}, the win goes to ${winnerDisplay}!\n\nTap the following link to open your Squares board. ${boardDeepLink}`;

        try {
            await NotificationService.publishMessage(smsMessage, id);
        } catch (error) {
            console.error('Failed to publish result SMS:', error);
        }

        return board;
    }
};
