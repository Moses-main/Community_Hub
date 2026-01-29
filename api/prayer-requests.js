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
      // Mock prayer requests data
      const prayerRequests = [
        {
          id: 1,
          userId: null,
          authorName: "Anonymous",
          content: "Please pray for my family's health and safety during these challenging times.",
          isAnonymous: true,
          createdAt: "2026-01-28T10:30:00.000Z",
          prayCount: 15
        },
        {
          id: 2,
          userId: "user123",
          authorName: "Sarah M.",
          content: "Seeking prayers for wisdom as I make important career decisions.",
          isAnonymous: false,
          createdAt: "2026-01-27T14:20:00.000Z",
          prayCount: 8
        },
        {
          id: 3,
          userId: null,
          authorName: "Anonymous",
          content: "Please pray for healing and strength for my mother who is in the hospital.",
          isAnonymous: true,
          createdAt: "2026-01-26T18:45:00.000Z",
          prayCount: 23
        },
        {
          id: 4,
          userId: "user456",
          authorName: "Michael K.",
          content: "Grateful for God's blessings. Please pray for continued guidance in my ministry work.",
          isAnonymous: false,
          createdAt: "2026-01-25T09:15:00.000Z",
          prayCount: 12
        },
        {
          id: 5,
          userId: null,
          authorName: "Anonymous",
          content: "Requesting prayers for financial breakthrough and provision for my family.",
          isAnonymous: true,
          createdAt: "2026-01-24T16:30:00.000Z",
          prayCount: 18
        }
      ];

      // Sort by creation date (newest first)
      const sortedRequests = prayerRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json(sortedRequests);
    }

    if (req.method === 'POST') {
      const { content, authorName, isAnonymous } = req.body;

      // Basic validation
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Prayer request content is required',
          field: 'content'
        });
      }

      if (content.length > 1000) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Prayer request content must be less than 1000 characters',
          field: 'content'
        });
      }

      // Create mock prayer request response
      const newPrayerRequest = {
        id: Math.floor(Math.random() * 10000) + 100,
        userId: null, // Would normally come from authentication
        authorName: isAnonymous ? "Anonymous" : (authorName || "Anonymous"),
        content: content.trim(),
        isAnonymous: Boolean(isAnonymous),
        createdAt: new Date().toISOString(),
        prayCount: 0
      };

      return res.status(201).json({
        success: true,
        message: "Prayer request submitted successfully. Our community will pray for you.",
        data: newPrayerRequest,
        timestamp: new Date().toISOString()
      });
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({
      error: 'Method not allowed',
      method: req.method,
      message: 'Only GET and POST requests are supported for prayer requests endpoint'
    });

  } catch (error) {
    console.error('Prayer Requests API Error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process prayer request',
      timestamp: new Date().toISOString(),
      details: error.message || 'Unknown error occurred'
    });
  }
}
