import { BoardService } from '../../../../services/backend/BoardService';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;
    const { phoneNumber } = req.body;

    if (!phoneNumber || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await BoardService.setAdminPhone(id, phoneNumber);
        res.status(200).json(result);
    } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        if (message === 'Board not found') {
            res.status(404).json({ error: message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: message });
        }
    }
}
