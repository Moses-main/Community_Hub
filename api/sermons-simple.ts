import { VercelRequest, VercelResponse } from '@vercel/node';

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

    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Method not allowed',
        method: req.method,
        message: 'Only GET requests are supported'
      });
    }

    // Mock sermons data for testing
    const mockSermons = [
      {
        id: 1,
        title: "The Power of Community",
        speaker: "Pastor John Doe",
        date: "2026-01-28T16:02:52.606Z",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        audioUrl: null,
        series: "Better Together",
        description: "Discover why we need each other to grow in faith.",
        thumbnailUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=60",
        createdAt: "2026-01-28T16:02:52.727Z"
      },
      {
        id: 2,
        title: "Finding Peace in Chaos",
        speaker: "Pastor Jane Smith",
        date: "2026-01-21T16:02:52.844Z",
        videoUrl: null,
        audioUrl: null,
        series: "Peace of Mind",
        description: "How to maintain inner peace when the world is crazy.",
        thumbnailUrl: "https://images.unsplash.com/photo-1507692049790-de58293a4697?w=800&auto=format&fit=crop&q=60",
        createdAt: "2026-01-28T16:02:52.963Z"
      }
    ];

    const response = {
      status: 'success',
      data: mockSermons,
      count: mockSermons.length,
      timestamp: new Date().toISOString(),
      message: 'Sermons retrieved successfully (mock data)'
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Sermons Simple API Error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      endpoint: 'sermons-simple'
    });
  }
}
