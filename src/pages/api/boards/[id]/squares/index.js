import { BoardService } from '../../../../../services/backend/BoardService';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        if (req.method === 'POST') {
            const { row, col, value } = req.body;
            const board = await BoardService.selectSquare(id, row, col, value);
            res.status(200).json({ Item: board });
        } else if (req.method === 'DELETE') {
            const { row, col } = req.body;
            // In some REST designs DELETE bodies are discouraged, but they are valid.
            // Alternatively we could use query params: ?row=X&col=Y
            // For now, let's support body to match previous pattern or refactor if needed.
            // But wait, standard nextjs fetch behavior with DELETE body is fine.
            // However, if we want to be stricter REST, we could do /squares/[row]/[col] but that's overkill.
            // Let's stick to body or query for row/col.
            // If body is empty, check query? No, let's assume body for now like original implementation.
            // Original implementation was a PUT with operation 'remove'.

            // If req.body is empty (common in some DELETE implementations), we might need to look at query.
            // But let's try body first.
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
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}
