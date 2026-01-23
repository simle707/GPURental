import { NextRequest, NextResponse } from "next/server";

interface createInstanceRequest{
    host_machine_id: string,
    units: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const IMAGE_ID = process.env.NEXT_PUBLIC_IMAGE_ID

export async function GET(req:NextRequest) {
    try {
        const sessionToken = req.cookies.get('featurize-hub-session')?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
        }
        const busRes = await fetch(`${API_BASE_URL}/bus/api/v1/virtual_machine`,{
            method: 'GET',
            headers: {
                'Cookie': `featurize-hub-session=${sessionToken}`,
                'Content-Type': 'application/json'
            }
        })
        if (!busRes.ok) {
            const errorDetail = await busRes.text();
            return NextResponse.json({ 
                error: 'Bus API response error', 
                status: busRes.status,
                detail: errorDetail 
            }, { status: busRes.status });
        }
        const data = await busRes.json()
        return NextResponse.json(data);


    } catch (err) {
        console.error("API call error: ", err);
        return NextResponse.json({
            success: false,
            message: String(err)
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: createInstanceRequest = await req.json()

        if (!body.host_machine_id || !body.units) {
            return NextResponse.json(
                {error: 'Missing required fields: host_machine_id and units are required'},
                {status: 400}
            )
        }

        const sessionToken = req.cookies.get('featurize-hub-session')?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: 'Session token not found' }, { status: 401 });
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Cookie': `featurize-hub-session=${sessionToken}`,
        };
        const bodyWithImage = {
            host_machine_id: body.host_machine_id,
            units: body.units,
            image: IMAGE_ID
        }

        const response = await fetch(`${API_BASE_URL}/bus/api/v1/virtual_machine`, {
            method: "POST",
            headers,
            body: JSON.stringify(bodyWithImage),
        })

        if (response.status === 401) {
            return NextResponse.json({ error: 'Auth failed at Bus API' }, { status: 401 });
        }

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                { error: 'Bus API error', detail: data },
                { status: response.status }
            );
        }
        

        return NextResponse.json({
            success: true,
            data,
            message: "Instance created successfully"
        });
    } catch(err) {
        return NextResponse.json({ error: 'Login failed', detail: String(err) }, { status: 500 });
    }
    
    
}