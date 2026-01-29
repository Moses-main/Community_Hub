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
        // List all prayer requests
        const requests = await storage.getPrayerRequests();
        return res.json(requests);

      case 'POST':
        // Check if this is a pray action request
        if (id && url.pathname.includes('/pray')) {
          const updated = await storage.incrementPrayCount(Number(id));
          if (!updated) {
            return res.status(404).json({ message: "Request not found" });
          }
          return res.json(updated);
        } else {
          // Create new prayer request (auth would be checked here in real implementation)
          try {
            const input = api.prayer.create.input.parse(req.body);
            // In real implementation, you would inject user ID from auth
            // const user = req.user as any;
            // const requestWithUser = { ...input, userId: user?.claims?.sub };
            const request = await storage.createPrayerRequest(input);
            return res.status(201).json(request);
          } catch (err) {
            if (err instanceof z.ZodError) {
              return res.status(400).json({ message: err.errors[0].message });
            }
            throw err;
          }
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Prayer Requests API Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
