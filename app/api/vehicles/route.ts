import { NextResponse } from 'next/server';
import rawMakeModels from '@/lib/data/makeModels_cached.json';

type ApiResponse = { data: unknown[] };

const makeModels: { [make: string]: string[] } = rawMakeModels;

// Optional: static trim-level data for popular models
const makeModelTrims: { [make: string]: { [model: string]: string[] } } = {
    'Ford': {
        'Fusion': ['S', 'SE', 'SEL', 'Titanium', 'Sport', 'Platinum', 'Hybrid SE', 'Hybrid SEL', 'Hybrid Titanium', 'Energi SE', 'Energi Titanium'],
        'Focus': ['S', 'SE', 'SEL', 'Titanium', 'ST', 'RS', 'Electric'],
        'F-150': ['XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Limited', 'Raptor', 'Tremor'],
        'Mustang': ['EcoBoost', 'GT', 'Mach 1', 'Shelby GT350', 'Shelby GT500', 'Bullitt', 'California Special'],
    },
    'Toyota': {
        'Camry': ['L', 'LE', 'SE', 'XLE', 'XSE', 'TRD', 'Hybrid LE', 'Hybrid SE', 'Hybrid XLE'],
        'Corolla': ['L', 'LE', 'SE', 'XLE', 'XSE', 'Hybrid LE', 'Hybrid XLE'],
        'Prius': ['L Eco', 'LE', 'XLE', 'Limited', 'Prime SE', 'Prime XSE'],
        'Tacoma': ['SR', 'SR5', 'TRD Sport', 'TRD Off-Road', 'Limited', 'TRD Pro'],
        'Tundra': ['SR', 'SR5', 'Limited', 'Platinum', '1794 Edition', 'TRD Pro', 'Capstone'],
    }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        let data: ApiResponse | undefined;

        if (type === 'makes') {
            const makesList = Object.keys(makeModels).sort();
            const makes = makesList.map((name, index) => ({
                make_id: (index + 1).toString(),
                make_display: name
            }));
            data = { data: makes };
        } else if (type === 'years') {
            const make = searchParams.get('make');
            if (!make) return NextResponse.json({ error: 'Make required' }, { status: 400 });
            const currentYear = new Date().getFullYear() + 1;
            const startYear = 1981;
            const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({ year: startYear + i }))
                .sort((a, b) => b.year - a.year);
            data = { data: years };
        } else if (type === 'models') {
            const make = searchParams.get('make');
            const year = searchParams.get('year');
            if (!make || !year) return NextResponse.json({ error: 'Make and year required' }, { status: 400 });
            const modelsList = makeModels[make] || [];
            const models = modelsList.map(name => ({ model_name: name }));
            data = { data: models };
        } else if (type === 'trims') {
            const make = searchParams.get('make');
            const model = searchParams.get('model');
            const year = searchParams.get('year');
            if (!make || !model || !year) return NextResponse.json({ error: 'Make, year, and model required' }, { status: 400 });
            const trimsList = makeModelTrims[make]?.[model] || ['Base', 'SE', 'LE', 'XLE', 'Limited', 'Sport', 'Premium', 'Platinum'];
            const trims = trimsList.map(name => ({ model_trim: name }));
            data = { data: trims };
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        if (!data || data.data.length === 0) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Vehicle data error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
