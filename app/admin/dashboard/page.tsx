import DashboardClient from "@/components/admin/DashboardClient";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";
import { redirect } from "next/navigation";

const validFilters = new Set(["all", "today", "past", "upcoming"]);

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string | string[] }>;
}) {
    const session = await checkAdminSession();

    if (!session.authorized) {
        redirect("/admin/login");
    }

    const params = await searchParams;
    const filter = Array.isArray(params.filter) ? params.filter[0] : params.filter;

    if (!filter || !validFilters.has(filter)) {
        redirect("/admin/dashboard?filter=today");
    }

    return <DashboardClient />;
}
