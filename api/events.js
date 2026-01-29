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
      // Mock events data
      const events = [
        {
          id: 1,
          title: "Sunday Service",
          description: "Join us for worship and a message that will inspire and encourage you.",
          date: "2026-02-02T08:00:00.000Z",
          location: "Main Sanctuary",
          imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop&q=60",
          createdAt: "2026-01-28T16:02:53.439Z"
        },
        {
          id: 2,
          title: "Youth Group Night",
          description: "Fun, games, and fellowship for teens. Bring your friends and join us for an exciting evening!",
          date: "2026-02-05T18:00:00.000Z",
          location: "Youth Hall",
          imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=60",
          createdAt: "2026-01-28T16:02:53.672Z"
        },
        {
          id: 3,
          title: "Women's Fellowship",
          description: "A time of fellowship, prayer, and encouragement for all women in our community.",
          date: "2026-02-08T10:00:00.000Z",
          location: "Fellowship Hall",
          imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60",
          createdAt: "2026-01-28T16:02:53.800Z"
        },
        {
          id: 4,
          title: "Bible Study",
          description: "Weekly Bible study session. Come and grow deeper in God's word with us.",
          date: "2026-02-12T19:00:00.000Z",
          location: "Study Room A",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
          createdAt: "2026-01-28T16:02:53.900Z"
        }
      ];

      // Sort events by date (upcoming first)
      const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

      return res.status(200).json(sortedEvents);
    }

    if (req.method === 'POST') {
      // For now, just return a success message for RSVP
      return res.status(200).json({
        success: true,
        message: "RSVP successful! We look forward to seeing you at the event.",
        timestamp: new Date().toISOString()
      });
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({
      error: 'Method not allowed',
      method: req.method,
      message: 'Only GET and POST requests are supported for events endpoint'
    });

  } catch (error) {
    console.error('Events API Error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve events',
      timestamp: new Date().toISOString(),
      details: error.message || 'Unknown error occurred'
    });
  }
}
