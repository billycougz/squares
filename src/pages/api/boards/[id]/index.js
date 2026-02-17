import { BoardService } from '../../../../services/backend/BoardService';

export default async function handler(req, res) {
    const { id, adminCode } = req.query;

    try {
        if (req.method === 'GET') {
            const board = await BoardService.getBoard(id, adminCode);
            // Legacy code returned { Item: board } or { error }.
            // New standardized API should probably return board directly, but let's stick to JSON.
            // Legacy frontend expects { Item: ... } or { error ... }.
            // We will update frontend to expect { ...board }.
            res.status(200).json(board);
        } else if (req.method === 'PUT') {
            // General update (settings, etc)
            // Corresponds to 'update' or 'finances' operation in legacy
            const updatedBoard = await BoardService.updateSettings(id, req.body);
            res.status(200).json({ Item: updatedBoard }); // Maintain { Item } structure for now if convenient, or switch to clean
        } else {
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        if (error.message === 'Board not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Admin code does not match.') {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}
