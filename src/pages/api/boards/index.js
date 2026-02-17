import { BoardService } from '../../../services/backend/BoardService';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const board = await BoardService.createBoard(req.body); // req.body should be the board data (formerly 'data' in legacy post)
        // Note: Legacy passed { operation: 'create', data: ... }. New API expects just data.
        // We will update frontend to match.
        res.status(200).json(board);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
