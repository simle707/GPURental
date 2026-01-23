import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(req: NextRequest) {
  try {
    const { idToken, userProfile } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const sub = payload?.sub;
    

    const apiToken = process.env.NEXT_PUBLIC_BUS_API_TOKEN;
    const busRes = await fetch(`${API_BASE_URL}/bus/api/v1/international/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sub })
    });
    const busData = await busRes.json();

    if (busData.status !== 0) {
      return NextResponse.json({ error: 'Login failed', detail: busData }, { status: 401 });
    }

    const response = NextResponse.json({ user: busData.data.user });
    response.cookies.set('featurize-hub-session', busData.data.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    });

    const userInfoStr = JSON.stringify(userProfile);
    response.cookies.set('user_info', Buffer.from(userInfoStr).toString('base64'), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: 'Abnormal login process', detail: String(e) }, { status: 500 });
  }
}