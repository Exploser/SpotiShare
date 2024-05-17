import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export const logCookie = (req: NextApiRequest, cookieName: string): void => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const parsedCookies = parse(cookies);
    const cookieValue = parsedCookies[cookieName];
    console.log(`${cookieName}: ${cookieValue}`);
  } else {
    console.log('No cookies found');
  }
};
