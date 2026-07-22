import ServiceDetailPage from "@/components/ServiceDetailPage";

export default function Page() {
    return <ServiceDetailPage
        eyebrowEn="Find the cause"
        eyebrowEs="Encontrar la causa"
        titleEn="Vehicle diagnostics"
        titleEs="Diagnóstico del vehículo"
        introEn="Start with the symptoms. We use inspection and diagnostic information to narrow down the issue and explain the next step."
        introEs="Empezamos con los síntomas. Usamos la inspección y la información de diagnóstico para identificar el problema y explicar el siguiente paso."
        image="/redesign/generated/service-diagnostics-cutout.png"
        altEn="Automotive diagnostic scan tool"
        altEs="Escáner de diagnóstico automotriz"
        includesEn={["Conversation about the symptoms", "Diagnostic-code scan when appropriate", "Focused visual and functional checks", "Explanation of findings and next steps"]}
        includesEs={["Conversación sobre los síntomas", "Lectura de códigos cuando corresponda", "Revisiones visuales y funcionales enfocadas", "Explicación de hallazgos y próximos pasos"]}
        signsEn={["A warning light is on", "The vehicle runs or starts differently", "You notice a new sound, smell, or vibration", "Performance or fuel economy has changed"]}
        signsEs={["Se encendió una luz de advertencia", "El vehículo funciona o enciende diferente", "Notas un ruido, olor o vibración nueva", "Cambió el rendimiento o consumo de combustible"]}
    />;
}
