import { redirect } from "next/navigation";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";

export default async function AdminPage() {
    const session = await checkAdminSession();

    if (session.authorized) {
        redirect("/admin/dashboard");
    }

    redirect("/admin/login");
}
