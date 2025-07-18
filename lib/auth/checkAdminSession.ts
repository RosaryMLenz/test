// File: lib/auth/checkAdminSession.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient, User } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

interface CheckAdminSessionResult {
    authorized: boolean;
    status: number;
    message: string;
    user: User | null;
}

export async function checkAdminSession(): Promise<CheckAdminSessionResult> {
    const session = await getServerSession(authOptions);

    console.log("🧠 SESSION:", session); // Debug log

    if (!session?.user?.email) {
        return {
            authorized: false,
            status: 401,
            message: "Unauthorized: No session email",
            user: null,
        };
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return {
            authorized: false,
            status: 404,
            message: "User not found",
            user: null,
        };
    }

    if (user.role !== "ADMIN") {
        return {
            authorized: false,
            status: 403,
            message: "Forbidden: User is not admin",
            user: null,
        };
    }

    return {
        authorized: true,
        status: 200,
        message: "Authorized",
        user,
    };
}
