export default function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      // Mock sermons data
      const sermons = [
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
        },
        {
          id: 3,
          title: "Walking in Faith",
          speaker: "Pastor Emmanuel Moses",
          date: "2026-01-14T16:02:52.844Z",
          videoUrl: "https://www.youtube.com/watch?v=sample3",
          audioUrl: null,
          series: "Faith Journey",
          description: "Learning to trust God in every step of our journey.",
          thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
          createdAt: "2026-01-28T16:02:52.963Z"
        }
      ];

      return res.status(200).json(sermons);
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({
      error: 'Method not allowed',
      method: req.method,
      message: 'Only GET requests are supported for sermons endpoint'
    });

  } catch (error) {
    console.error('Sermons API Error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve sermons',
      timestamp: new Date().toISOString(),
      details: error.message || 'Unknown error occurred'
    });
  }
}
