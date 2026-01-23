import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
    const sessionToken = req.cookies.get('featurize_hub_session')?.value

    try {
        const res = await fetch(`${API_BASE_URL}/bus/api/v1/virtual_machine/${id}`, {
            method: 'GET',
            headers: {
                'Cookie': `featurize-hub-session=${sessionToken}`,
                'Accept': 'application/json'
            }
        })

        const data = await res.json()
        return NextResponse.json({ success: res.ok, data: data.data});
    } catch(error) {
        return NextResponse.json( {success: false }, { status: 500 } )
    }
}

export async function DELETE(req: NextRequest) {
  try {
    const { instance_id } = await req.json();

    if (!instance_id) {
      return NextResponse.json({ error: 'Instance ID is required' }, { status: 400 });
    }

    const sessionToken = req.cookies.get('featurize-hub-session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const targetUrl = `${API_BASE_URL}/bus/api/v1/virtual_machine/${instance_id}`;
    const busRes = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Cookie': `featurize-hub-session=${sessionToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (busRes.ok) {
      return NextResponse.json({ success: true, message: 'Instance termination initiated' });
    } else {
      const errorDetail = await busRes.text();
      return NextResponse.json({ 
        error: 'Bus API failed to terminate', 
        status: busRes.status,
        detail: errorDetail 
      }, { status: busRes.status });
    }

  } catch (err: any) {
    return NextResponse.json({ error: 'Server error', detail: err.message }, { status: 500 });
  }
}