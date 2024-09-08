import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { ls_name } = req.query;

        if (typeof ls_name !== 'string') {
            return res.status(400).json({ error: 'Invalid ls_name parameter' });
        }

        try {
            const existingShelf = await prisma.location_shelf.findFirst({
                where: { ls_name },
            });

            res.status(200).json({ exists: !!existingShelf });
        } catch (error) {
            console.error('Error checking shelf location name:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}