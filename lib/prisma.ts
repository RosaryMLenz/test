// lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

function createPrismaClient() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is required to initialize Prisma Client.");
    }

    // pg currently treats `require` as full certificate verification, but that
    // behavior is changing. Keep the existing secure behavior explicit.
    const connectionString = process.env.DATABASE_URL.replace(
        /([?&])sslmode=require(?=(&|$))/i,
        "$1sslmode=verify-full",
    );

    const adapter = new PrismaPg({
        connectionString,
    });

    return new PrismaClient({ adapter });
}

export function getPrisma() {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
    }

    return globalForPrisma.prisma;
}
