import { notFound } from "next/navigation";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { getServicePageContent, hasServicePageContent } from "@/lib/serviceContent";

interface ServicePageProps {
    params: Promise<{
        category: string;
        service: string;
    }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { category, service } = await params;

    if (!hasServicePageContent(category, service)) {
        notFound();
    }

    return <ServiceDetailPage {...getServicePageContent(category, service)} />;
}
