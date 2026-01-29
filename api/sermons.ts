import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { api } from '../shared/routes';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const { method } = req;
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1];

    switch (method) {
      case 'GET':
        // Check if this is a request for a specific sermon
        if (id && !isNaN(Number(id))) {
          const sermon = await storage.getSermon(Number(id));
          if (!sermon) {
            return res.status(404).json({ message: "Sermon not found" });
          }
          return res.json(sermon);
        } else {
          // List all sermons
          const sermons = await storage.getSermons();
          return res.json(sermons);
        }

      case 'POST':
        // Create new sermon (auth would be checked here in real implementation)
        try {
          const input = api.sermons.create.input.parse(req.body);
          const sermon = await storage.createSermon(input);
          return res.status(201).json(sermon);
        } catch (err) {
          if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
          }
          throw err;
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Sermons API Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
