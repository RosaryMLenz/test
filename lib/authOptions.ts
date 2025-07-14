import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user && "role" in user && typeof user.role === "string") {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // Use proper type assertion instead of any
                (session.user as typeof session.user & { role: string | null }).role =
                    typeof token.role === "string" ? token.role : null;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};