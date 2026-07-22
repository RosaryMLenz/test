import ServiceDetailPage from "@/components/ServiceDetailPage";

export default function Page() {
    return <ServiceDetailPage
        eyebrowEn="Routine maintenance"
        eyebrowEs="Mantenimiento preventivo"
        titleEn="Oil change"
        titleEs="Cambio de aceite"
        introEn="Fresh oil and a clean filter help protect your engine and keep everyday performance smooth."
        introEs="Aceite nuevo y un filtro limpio ayudan a proteger el motor y mantener un rendimiento uniforme."
        image="/redesign/generated/service-oil-cutout.png"
        altEn="Motor oil and oil filter"
        altEs="Aceite de motor y filtro de aceite"
        includesEn={["Oil and filter replacement", "Fluid-level check", "Visual inspection for obvious leaks", "Maintenance guidance based on your vehicle"]}
        includesEs={["Cambio de aceite y filtro", "Revisión de niveles de fluidos", "Inspección visual de fugas evidentes", "Orientación según el mantenimiento de tu vehículo"]}
        signsEn={["Your maintenance reminder is on", "The oil looks dark or low", "The engine sounds louder than usual", "You have reached the recommended service interval"]}
        signsEs={["Se encendió el recordatorio de mantenimiento", "El aceite se ve oscuro o bajo", "El motor suena más fuerte de lo normal", "Llegaste al intervalo recomendado de servicio"]}
    />;
}
