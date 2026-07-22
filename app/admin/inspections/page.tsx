import { redirect } from "next/navigation";
import InspectionHistory from "@/components/admin/InspectionHistory";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";

export default async function InspectionsPage() {
    const session = await checkAdminSession();
    if (!session.authorized) redirect("/admin/login");

    return <InspectionHistory />;
}
