// File: app/admin/dashboard/page.tsx
// ✅ No "use client"

import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/admin/DashboardClient"; // We'll move interactive logic here

export default async function AdminDashboardPage() {
    const session = await checkAdminSession();

    if (!session.authorized) {
        redirect("/admin/login");
    }

    return <DashboardClient />;
}
