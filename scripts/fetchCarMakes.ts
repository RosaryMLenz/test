import fs from 'node:fs';
import fetch from 'node-fetch';

interface MakeResult {
    MakeId: number;
    MakeName: string;
    VehicleTypeId: number;
    VehicleTypeName: string;
}

interface ModelResult {
    Model_ID: number;
    Make_ID: number;
    Make_Name: string;
    Model_Name: string;
}

interface MakesResponse {
    Count: number;
    Message: string;
    Results: MakeResult[];
}

interface ModelsResponse {
    Count: number;
    Message: string;
    Results: ModelResult[];
}

async function fetchMakes(): Promise<string[]> {
    const res = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
    );
    const data = (await res.json()) as MakesResponse;

    console.log('🧪 Raw API response:', JSON.stringify(data, null, 2));

    return data.Results
        .map((m) => m.MakeName)
        .filter(
            (name): name is string =>
                Boolean(name) &&
                !name.includes(',') &&
                !/llc|group|inc/i.test(name) &&
                name.trim().length > 1
        );
}


async function fetchModelsForMakeYear(make: string, year: number): Promise<string[]> {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(
        make
    )}/modelyear/${year}?format=json`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`⚠️  API failed for ${make} (${year}) - Status: ${res.status}`);
            return [];
        }

        const data = (await res.json()) as ModelsResponse;
        return data.Results.map((r) => r.Model_Name);
    } catch (err) {
        console.error(`❌ Failed fetching models for ${make} (${year})`, err);
        return [];
    }
}

async function main(): Promise<void> {
    console.log('⏳ Fetching makes tagged as "car"...');
    const makes = await fetchMakes();

    console.log('✅ Makes received:', makes);

    const makeModels: Record<string, Set<string>> = {};

    for (const make of makes) {
        console.log(`📦 Fetching models for: ${make}`);
        for (let year = new Date().getFullYear(); year >= new Date().getFullYear() - 4; year--) {
            const models = await fetchModelsForMakeYear(make, year);
            if (!models.length) continue;

            if (!makeModels[make]) makeModels[make] = new Set();
            models.forEach((model) => makeModels[make].add(model));
        }
    }

    const output: Record<string, string[]> = {};
    for (const make in makeModels) {
        output[make] = Array.from(makeModels[make]).sort();
    }

    fs.writeFileSync('makeModels_cached.json', JSON.stringify(output, null, 2));
    console.log('✅ Saved as makeModels_cached.json');
}

main().catch((err) => {
    console.error('❌ Script failed:', err);
});
