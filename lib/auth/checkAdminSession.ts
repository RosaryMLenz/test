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

    if (!session || !session.user) {
        return {
            authorized: false,
            status: 401,
            message: "Unauthorized",
            user: null,
        };
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email ?? undefined },
    });

    if (!user || user.role !== "admin") {
        return {
            authorized: false,
            status: 403,
            message: "Forbidden",
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
