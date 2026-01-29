import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, closeDb } from './lib/db';
import { sermons } from '../shared/schema';
import { desc, eq } from 'drizzle-orm';

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

    const db = getDb();
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case 'GET':
        try {
          // Check if this is a request for a specific sermon
          if (id && !isNaN(Number(id))) {
            const sermon = await db.select().from(sermons).where(eq(sermons.id, Number(id))).limit(1);

            if (sermon.length === 0) {
              return res.status(404).json({
                status: 'error',
                message: "Sermon not found"
              });
            }

            return res.status(200).json({
              status: 'success',
              data: sermon[0],
              timestamp: new Date().toISOString()
            });
          } else {
            // List all sermons, ordered by date descending
            const allSermons = await db.select().from(sermons).orderBy(desc(sermons.date));

            return res.status(200).json({
              status: 'success',
              data: allSermons,
              count: allSermons.length,
              timestamp: new Date().toISOString()
            });
          }
        } catch (dbError) {
          console.error('Database query error:', dbError);
          return res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: dbError instanceof Error ? dbError.message : 'Unknown database error'
          });
        }

      case 'POST':
        try {
          const { title, speaker, date, videoUrl, audioUrl, series, description, thumbnailUrl } = req.body;

          if (!title || !speaker || !date) {
            return res.status(400).json({
              status: 'error',
              message: 'Missing required fields: title, speaker, date'
            });
          }

          const newSermon = await db.insert(sermons).values({
            title,
            speaker,
            date: new Date(date),
            videoUrl: videoUrl || null,
            audioUrl: audioUrl || null,
            series: series || null,
            description: description || null,
            thumbnailUrl: thumbnailUrl || null
          }).returning();

          return res.status(201).json({
            status: 'success',
            data: newSermon[0],
            message: 'Sermon created successfully',
            timestamp: new Date().toISOString()
          });
        } catch (dbError) {
          console.error('Database insert error:', dbError);
          return res.status(500).json({
            status: 'error',
            message: 'Failed to create sermon',
            error: dbError instanceof Error ? dbError.message : 'Unknown database error'
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({
          status: 'error',
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('Sermons API Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      endpoint: 'sermons-db'
    });
  } finally {
    // Note: In serverless environments, we typically don't close connections
    // as they may be reused across invocations for performance
    // await closeDb();
  }
}
