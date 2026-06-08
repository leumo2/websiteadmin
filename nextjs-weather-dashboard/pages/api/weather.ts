// pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { city, lat, lon } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'API Key not configured'
    });
  }

  try {
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;

    if (city) {
      url += `&q=${city}`;
    } else if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else {
      return res.status(400).json({
        success: false,
        error: 'City or coordinates required'
      });
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
