import { BoardService } from '../../../../services/backend/BoardService';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;
    const { phoneNumber } = req.body;

    try {
        const response = await BoardService.subscribe(id, phoneNumber);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
