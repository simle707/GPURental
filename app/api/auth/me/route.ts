import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('featurize-hub-session')?.value;
  const userInfoCookie = req.cookies.get('user_info')?.value;

  if (!sessionToken || !userInfoCookie) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    const userInfo = JSON.parse(Buffer.from(userInfoCookie, 'base64').toString());
    const busRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bus/api/v1/sessions`, {
      headers: { 'Cookie': `featurize-hub-session=${sessionToken}` }
    });

    const busData = await busRes.json();

    if (busRes.ok && busData.status === 0) {
      return NextResponse.json({ 
        isLoggedIn: true, 
        user: {
          uid: userInfo.uid,
          displayName: userInfo.displayName,
          email: userInfo.email,
          photoURL: userInfo.photoURL,
        }
      });
    }
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false }, { status: 500 });
  }
}