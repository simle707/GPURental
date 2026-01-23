import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const sessionToken = req.cookies.get('featurize-hub-session')?.value;

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
        const res = await fetch(`${API_BASE_URL}/bus/api/v1/host_machine`, {
            method: 'GET',
            headers: {
                'Cookie': `featurize-hub-session=${sessionToken}`,
                'Content-Type': 'application/json',
            }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const busData = await res.json();

        if (busData.status !== 0) {
            return NextResponse.json({ 
                success: false, 
                message: busData.message || 'Failed to fetch from BUS' 
            }, { status: 400 });
        }

        const filteredData = busData.data.records.filter((record: any) => {
            const type = (record.gpu_type || '').toUpperCase();
            return type.includes('4090');
        });

        return NextResponse.json({
            status: 0,
            success: true,
            data: filteredData,
            message: 'Fetched GPU specifications successfully'
        })

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({
        status: -1,
        success: false,
        message: 'Internal Server Error'
        }, { status: 500 });
    }

    
}