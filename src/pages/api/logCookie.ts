// src/pages/api/logCookie.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

const logCookie = (req: NextApiRequest, cookieName: string): void => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const parsedCookies = parse(cookies);
    const cookieValue = parsedCookies[cookieName];
    console.log(`${cookieName}: ${cookieValue}`);
  } else {
    console.log('No cookies found');
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  logCookie(req, 'spotify_access_token');
  res.status(200).json({ message: 'Cookie logged on server' });
}