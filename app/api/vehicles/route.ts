import { NextResponse } from 'next/server';

interface Make {
    make_id: string;
    make_display: string;
}

interface ApiModel {
    model_name: string;
}

interface Trim {
    model_year: string;
    model_trim?: string;
}

type ApiResponse =
    | { Makes: Make[] }
    | { Models: ApiModel[] }
    | { Trims: Trim[] };

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        let url = 'https://www.carqueryapi.com/api/0.3/?';
        let data: { data: unknown[] } | undefined;

        if (type === 'makes') {
            url += 'cmd=getMakes&sold_in_us=1';
        } else if (type === 'years') {
            const make = searchParams.get('make');
            if (!make) return NextResponse.json({ error: 'Make required' }, { status: 400 });
            url += `cmd=getTrims&make=${encodeURIComponent(make)}&sold_in_us=1`;
        } else if (type === 'models') {
            const make = searchParams.get('make');
            const year = searchParams.get('year');
            if (!make || !year) return NextResponse.json({ error: 'Make and year required' }, { status: 400 });
            url += `cmd=getModels&make=${encodeURIComponent(make)}&year=${year}&sold_in_us=1`;
        } else if (type === 'trims') {
            const make = searchParams.get('make');
            const year = searchParams.get('year');
            const model = searchParams.get('model');
            if (!make || !year || !model) return NextResponse.json({ error: 'Make, year, and model required' }, { status: 400 });
            url += `cmd=getTrims&make=${encodeURIComponent(make)}&year=${year}&model=${encodeURIComponent(model)}&sold_in_us=1`;
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        const response = await fetch(url);
        if (!response.ok) return NextResponse.json({ error: 'Failed to fetch from CarQuery API' }, { status: 500 });

        const apiData: ApiResponse = await response.json();

        if (type === 'years') {
            if ('Trims' in apiData && apiData.Trims) {
                const uniqueYearsArray = [...new Set(apiData.Trims.map((t) => parseInt(t.model_year)))] as number[];
                const sortedYears = uniqueYearsArray.sort((a: number, b: number) => b - a);
                const uniqueYears = sortedYears.map((y: number) => ({ year: y }));
                data = { data: uniqueYears };
            } else {
                return NextResponse.json({ error: 'No trims data' }, { status: 400 });
            }
        } else if (type === 'makes') {
            if ('Makes' in apiData) {
                data = { data: apiData.Makes };
            } else {
                return NextResponse.json({ error: 'No makes data' }, { status: 400 });
            }
        } else if (type === 'models') {
            if ('Models' in apiData) {
                data = { data: apiData.Models };
            } else {
                return NextResponse.json({ error: 'No models data' }, { status: 400 });
            }
        } else if (type === 'trims') {
            if ('Trims' in apiData && apiData.Trims) {
                data = { data: apiData.Trims.map((t) => ({ model_trim: t.model_trim || 'Base' })) };
            } else {
                return NextResponse.json({ error: 'No trims data' }, { status: 400 });
            }
        }

        if (!data) {
            return NextResponse.json({ error: 'Data not assigned' }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Vehicle API proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}