import { NextResponse } from 'next/server';

type ApiResponse = { data: unknown[] };

const makeModels: { [key: string]: string[] } = {
    'Acura': ['ADX', 'Integra', 'MDX', 'RDX', 'RSX', 'TLX', 'ZDX'],
    'AFEELA': ['Sedan'],
    'Alfa Romeo': ['Giulia', 'Stelvio', 'Tonale'],
    'Aston Martin': ['DB12', 'DBX', 'Vanquish', 'Vantage'],
    'Audi': ['A3', 'A4', 'A4 allroad', 'A5', 'A5 Sportback', 'A6', 'A6 allroad', 'A6 e-tron', 'A6 Sportback e-tron', 'A7', 'A8', 'e-tron GT', 'Q3', 'Q4 e-tron', 'Q4 Sportback e-tron', 'Q5', 'Q5 Sportback', 'Q6 e-tron', 'Q6 Sportback e-tron', 'Q7', 'Q8', 'Q8 e-tron', 'Q8 Sportback e-tron', 'RS 3', 'RS 5', 'RS 5 Sportback', 'RS 6', 'RS 7', 'RS e-tron GT', 'RS Q8', 'S e-tron GT', 'S3', 'S4', 'S5', 'S5 Sportback', 'S6', 'S6 e-tron', 'S6 Sportback e-tron', 'S7', 'S8', 'SQ5', 'SQ5 Sportback', 'SQ6 e-tron', 'SQ6 Sportback e-tron', 'SQ7', 'SQ8', 'SQ8 e-tron', 'SQ8 Sportback e-tron'],
    'Bentley': ['Bentayga', 'Bentayga EWB', 'Continental GT', 'Continental GTC', 'Flying Spur'],
    'BMW': ['i4', 'i5', 'i7', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8', 'X1', 'X2', 'X3', 'X3 M', 'X4', 'X4 M', 'X5', 'X5 M', 'X6', 'X6 M', 'X7', 'XM', 'Z4', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series'],
    'Buick': ['Enclave', 'Encore GX', 'Envision', 'Envista'],
    'Cadillac': ['Celestiq', 'CT4', 'CT4-V', 'CT5', 'CT5-V', 'Escalade', 'Escalade ESV', 'Escalade IQ', 'Escalade IQL', 'LYRIQ', 'LYRIQ-V', 'OPTIQ', 'OPTIQ-V', 'VISTIQ', 'XT4', 'XT5', 'XT6'],
    'Chevrolet': ['Blazer', 'Blazer EV', 'Camaro', 'Colorado Crew Cab', 'Corvette', 'Equinox', 'Equinox EV', 'Express 2500 Cargo', 'Express 2500 Passenger', 'Express 3500 Cargo', 'Express 3500 Passenger', 'Malibu', 'Silverado 1500 Crew Cab', 'Silverado 1500 Double Cab', 'Silverado 1500 Regular Cab', 'Silverado 2500 HD Crew Cab', 'Silverado 2500 HD Double Cab', 'Silverado 2500 HD Regular Cab', 'Silverado 3500 HD Crew Cab', 'Silverado 3500 HD Double Cab', 'Silverado 3500 HD Regular Cab', 'Silverado EV', 'Suburban', 'Tahoe', 'Trailblazer', 'Traverse', 'Traverse Limited', 'Trax'],
    'Chrysler': ['Pacifica', 'Pacifica Hybrid', 'Voyager'],
    'Dodge': ['Charger', 'Charger Daytona', 'Durango', 'Hornet'],
    'Ferrari': ['F8', 'Portofino M', 'Purosangue', 'Roma', 'SF90', '296 GTB', '296 GTS', '812 Competizione', '812 GTS'],
    'FIAT': ['500e'],
    'Fisker': ['Ocean'],
    'Ford': ['Bronco', 'Bronco Sport', 'E-Transit 350 Cargo Van', 'Edge', 'Escape', 'Escape Plug-in Hybrid', 'Expedition', 'Expedition MAX', 'Explorer', 'F150 Lightning', 'F150 Regular Cab', 'F150 Super Cab', 'F150 SuperCrew Cab', 'F250 Super Duty Crew Cab', 'F250 Super Duty Regular Cab', 'F250 Super Duty Super Cab', 'F350 Super Duty Crew Cab', 'F350 Super Duty Regular Cab', 'F350 Super Duty Super Cab', 'F450 Super Duty Crew Cab', 'F450 Super Duty Regular Cab', 'Maverick', 'Mustang', 'Mustang MACH-E', 'Ranger SuperCrew', 'Transit 150 Cargo Van', 'Transit 250 Cargo Van', 'Transit 350 Cargo Van', 'Transit 350 HD Cargo Van', 'Transit 350 Passenger Van'],
    'GMC': ['Acadia', 'Canyon Crew Cab', 'HUMMER EV Pickup', 'HUMMER EV SUV', 'Savana 2500 Cargo', 'Savana 2500 Passenger', 'Savana 3500 Cargo', 'Savana 3500 Passenger', 'Sierra 1500 Crew Cab', 'Sierra 1500 Double Cab', 'Sierra 1500 Regular Cab', 'Sierra 2500 HD Crew Cab', 'Sierra 2500 HD Double Cab', 'Sierra 2500 HD Regular Cab', 'Sierra 3500 HD Crew Cab', 'Sierra 3500 HD Double Cab', 'Sierra 3500 HD Regular Cab', 'Terrain', 'Yukon', 'Yukon XL'],
    'Honda': ['Accord', 'Civic', 'CR-V', 'HR-V', 'Pilot', 'Odyssey', 'Passport', 'Ridgeline'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Ioniq 5', 'Ioniq 6'],
    'Infiniti': ['Q50', 'Q60', 'QX50', 'QX55', 'QX60', 'QX80'],
    'Jaguar': ['F-PACE', 'F-TYPE', 'XF'],
    'Jeep': ['Compass', 'Gladiator', 'Grand Cherokee', 'Grand Wagoneer', 'Renegade', 'Wagoneer', 'Wrangler'],
    'Kia': ['Forte', 'K5', 'Sportage', 'Sorento', 'Telluride', 'Carnival', 'EV6', 'EV9'],
    'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
    'Lexus': ['ES', 'GX', 'IS', 'LX', 'NX', 'RC', 'RX', 'TX', 'UX'],
    'Lincoln': ['Aviator', 'Corsair', 'Nautilus', 'Navigator'],
    'Mazda': ['CX-30', 'CX-5', 'CX-50', 'CX-70', 'CX-90', 'MX-5 Miata', '3', '6'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'EQB', 'EQE', 'EQS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class'],
    'MINI': ['Clubman', 'Convertible', 'Countryman', 'Hardtop'],
    'Mitsubishi': ['Eclipse Cross', 'Mirage', 'Outlander', 'Outlander Sport'],
    'Nissan': ['Altima', 'Sentra', 'Versa', 'Ariya', 'Frontier Crew Cab', 'GT-R', 'Kicks', 'Leaf', 'Murano', 'Pathfinder', 'Rogue', 'Rogue Sport', 'Titan Crew Cab', 'Z'],
    'Porsche': ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
    'Ram': ['1500 Crew Cab', '1500 Quad Cab', '2500 Crew Cab', '3500 Crew Cab', 'ProMaster Cargo Van', 'ProMaster City'],
    'Scion': ['FR-S', 'iA', 'iM', 'iQ', 'tC', 'xA', 'xB', 'xD'],
    'Subaru': ['Ascent', 'BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'Solterra', 'WRX'],
    'Tesla': ['Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y'],
    'Toyota': ['4Runner', 'bZ4X', 'Camry', 'Corolla', 'Corolla Cross', 'Corolla Hatchback', 'Crown', 'GR86', 'GR Corolla', 'GR Supra', 'Grand Highlander', 'Highlander', 'Land Cruiser', 'Mirai', 'Prius', 'Prius Prime', 'RAV4', 'RAV4 Prime', 'Sequoia', 'Sienna', 'Tacoma Double Cab', 'Tacoma XtraCab', 'Tundra CrewMax', 'Tundra Double Cab', 'Venza'],
    'Volkswagen': ['Arteon', 'Atlas', 'Atlas Cross Sport', 'Golf GTI', 'Golf R', 'ID.4', 'ID.Buzz', 'Jetta', 'Passat', 'Taos', 'Tiguan'],
    'Volvo': ['EX30', 'EX90', 'S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90']
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
            // Hardcode years from 1981 to current year +1
            const currentYear = new Date().getFullYear() + 1;
            const startYear = 1981;
            const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({ year: startYear + i })).sort((a, b) => b.year - a.year);
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
            const year = searchParams.get('year');
            const model = searchParams.get('model');
            if (!make || !year || !model) return NextResponse.json({ error: 'Make, year, and model required' }, { status: 400 });
            // Hardcode some common trims
            const trimsList = ['Base', 'SE', 'LE', 'XLE', 'Limited', 'Sport', 'Premium', 'Platinum'];
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