import { redirect } from "next/navigation";
import InspectionForm from "@/components/admin/InspectionForm";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";

export default async function NewInspectionPage() {
    const session = await checkAdminSession();
    if (!session.authorized) redirect("/admin/login");

    return <InspectionForm defaultTechnician={session.user?.name || "Admin"} />;
}
