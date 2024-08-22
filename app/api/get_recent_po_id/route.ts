import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/utils/prisma';

interface PurchaseOrder {
    po_id: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const results = await query(`
                SELECT po_id FROM purchase_orders ORDER BY po_id DESC LIMIT 1
            `) as PurchaseOrder[];
            if (results.length > 0) {
                res.status(200).json({ po_id: results[0].po_id });
            } else {
                res.status(404).json({ error: 'No purchase orders found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}