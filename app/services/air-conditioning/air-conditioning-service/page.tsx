import ServiceDetailPage from "@/components/ServiceDetailPage";

export default function Page() {
    return <ServiceDetailPage
        eyebrowEn="Stay comfortable"
        eyebrowEs="Mantén la comodidad"
        titleEn="A/C service"
        titleEs="Servicio de A/C"
        introEn="Las Vegas heat puts your vehicle’s air conditioning to work. We check cooling performance and help identify the reason for weak or inconsistent air."
        introEs="El calor de Las Vegas exige mucho del aire acondicionado. Revisamos el enfriamiento y ayudamos a identificar la causa de un aire débil o irregular."
        image="/redesign/generated/service-ac-cutout.png"
        altEn="Automotive air conditioning compressor"
        altEs="Compresor de aire acondicionado automotriz"
        includesEn={["Vent-temperature and airflow check", "Visual inspection of accessible components", "System-performance assessment", "Explanation of recommended next steps"]}
        includesEs={["Revisión de temperatura y flujo de aire", "Inspección visual de componentes accesibles", "Evaluación del rendimiento del sistema", "Explicación de los próximos pasos recomendados"]}
        signsEn={["The air is not as cold as before", "Cooling changes while driving or idling", "Airflow is weak", "You hear a new sound when the A/C runs"]}
        signsEs={["El aire ya no enfría como antes", "El enfriamiento cambia al conducir o detenerse", "El flujo de aire es débil", "Escuchas un ruido nuevo al encender el A/C"]}
    />;
}
