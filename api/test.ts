import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Method not allowed',
        method: req.method
      });
    }

    // Simple test response
    const testData = {
      status: 'success',
      message: 'Test API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      headers: req.headers,
      url: req.url,
      method: req.method
    };

    return res.status(200).json(testData);

  } catch (error) {
    console.error('Test API Error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error in test API',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
