import handleGet from '../../lib/handlers/handleGet';
import handlePost from '../../lib/handlers/handlePost';
import handlePut from '../../lib/handlers/handlePut';

export default async function handler(req, res) {
    const { method } = req;
    let result;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this for production security
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        switch (method) {
            case 'GET':
                result = await handleGet(req.query);
                break;
            case 'POST':
                result = await handlePost(req.body);
                break;
            case 'PUT':
                result = await handlePut(req.body);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
