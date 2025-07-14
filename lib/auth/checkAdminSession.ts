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

    // ✅ SAFETY CHECK: make sure session and session.user.email are defined
    if (!session?.user?.email) {
        return {
            authorized: false,
            status: 401,
            message: "Unauthorized - no email in session",
            user: null,
        };
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || user.role !== "admin") {
        return {
            authorized: false,
            status: 403,
            message: "Forbidden - not an admin",
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
