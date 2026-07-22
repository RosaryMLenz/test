import ServiceDetailPage from "@/components/ServiceDetailPage";

export default function Page() {
    return <ServiceDetailPage
        eyebrowEn="Safety and control"
        eyebrowEs="Seguridad y control"
        titleEn="Brake service"
        titleEs="Servicio de frenos"
        introEn="A careful brake inspection helps identify wear, noise, vibration, and stopping concerns before they become bigger problems."
        introEs="Una inspección cuidadosa ayuda a detectar desgaste, ruidos, vibraciones y problemas de frenado antes de que empeoren."
        image="/redesign/generated/service-brakes-cutout.png"
        altEn="Brake rotor and caliper"
        altEs="Disco y cáliper de freno"
        includesEn={["Brake pad and rotor inspection", "Brake-fluid condition check", "Visual inspection of related hardware", "Clear explanation of recommended work"]}
        includesEs={["Inspección de pastillas y discos", "Revisión del líquido de frenos", "Inspección visual de componentes relacionados", "Explicación clara del trabajo recomendado"]}
        signsEn={["Squealing, grinding, or clicking", "The steering wheel shakes while braking", "The brake pedal feels soft or different", "The vehicle pulls while stopping"]}
        signsEs={["Chirridos, rechinidos o golpeteos", "El volante vibra al frenar", "El pedal se siente blando o diferente", "El vehículo se desvía al detenerse"]}
    />;
}
