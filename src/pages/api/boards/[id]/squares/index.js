import { BoardService } from '../../../../../services/backend/BoardService';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        if (req.method === 'POST') {
            const { row, col, value, name } = req.body;
            const board = await BoardService.selectSquare(id, row, col, value, name);
            res.status(200).json({ Item: board });
        } else if (req.method === 'DELETE') {
            const { row, col } = req.body;
            const board = await BoardService.removeSquare(id, row, col);
            res.status(200).json({ Item: board });
        } else {
            res.setHeader('Allow', ['POST', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        if (error.message === 'Board not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message.startsWith('SYMBOL_CONFLICT:')) {
            const existingName = error.message.replace('SYMBOL_CONFLICT:', '');
            res.status(409).json({ error: 'symbol_conflict', existingName });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}

