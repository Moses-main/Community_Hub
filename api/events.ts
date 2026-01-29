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
        // Check if this is a request for a specific event
        if (id && !isNaN(Number(id))) {
          const event = await storage.getEvent(Number(id));
          if (!event) {
            return res.status(404).json({ message: "Event not found" });
          }
          return res.json(event);
        } else {
          // List all events
          const events = await storage.getEvents();
          return res.json(events);
        }

      case 'POST':
        // Check if this is an RSVP request
        if (id && url.pathname.includes('/rsvp')) {
          // Mock RSVP for now (would require auth in real implementation)
          return res.json({ message: "RSVP successful" });
        } else {
          // Create new event (auth would be checked here in real implementation)
          try {
            const input = api.events.create.input.parse(req.body);
            const event = await storage.createEvent(input);
            return res.status(201).json(event);
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
    console.error('Events API Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
