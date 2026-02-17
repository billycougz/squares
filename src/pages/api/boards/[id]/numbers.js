import { BoardService } from '../../../../services/backend/BoardService';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;

    try {
        const board = await BoardService.generateNumbers(id);
        res.status(200).json({ Item: board });
    } catch (error) {
        console.error(error);
        if (error.message === 'Board not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}
