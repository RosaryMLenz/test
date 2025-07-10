import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function seedAdmin() {
    const hashedPassword = await bcrypt.hash("YourStrongAdminPassword", 10);
    await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@rainforest21.com",
            password: hashedPassword,
            role: "admin",
        },
    });
    console.log("Admin user created.");
}

seedAdmin().finally(() => prisma.$disconnect());
