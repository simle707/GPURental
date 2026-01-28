import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: "Session cleared" 
  });

  const commonOptions = {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    expires: new Date(0),
  };

  response.cookies.set('featurize-hub-session', '', commonOptions);

  response.cookies.set('user_info', '', {
    ...commonOptions,
  });

  return response;
}