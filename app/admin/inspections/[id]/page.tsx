import { redirect } from "next/navigation";
import InspectionForm from "@/components/admin/InspectionForm";
import { checkAdminSession } from "@/lib/auth/checkAdminSession";

export default async function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await checkAdminSession();
    if (!session.authorized) redirect("/admin/login");
    const { id } = await params;

    return <InspectionForm defaultTechnician={session.user?.name || "Admin"} inspectionId={id} />;
}
