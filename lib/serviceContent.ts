export interface ServicePageContent {
    eyebrowEn: string;
    eyebrowEs: string;
    titleEn: string;
    titleEs: string;
    introEn: string;
    introEs: string;
    image: string;
    altEn: string;
    altEs: string;
    includesEn: string[];
    includesEs: string[];
    signsEn: string[];
    signsEs: string[];
}

type CategoryContent = Omit<ServicePageContent, "titleEn" | "titleEs" | "introEn" | "introEs" | "altEn" | "altEs"> & {
    introLeadEn: string;
    introLeadEs: string;
};

const serviceTitles: Record<string, [string, string]> = {
    "car-tires": ["Car tires", "Neumáticos para autos"],
    "suv-truck-tires": ["SUV & truck tires", "Neumáticos para SUV y camionetas"],
    "tire-repair": ["Tire repair", "Reparación de neumáticos"],
    "tire-rotation-replacement": ["Tire rotation & replacement", "Rotación y reemplazo de neumáticos"],
    "wheel-alignment": ["Wheel alignment", "Alineación de ruedas"],
    "wheel-bearings": ["Wheel bearings", "Rodamientos de ruedas"],
    "wheel-balancing": ["Wheel balancing", "Balanceo de ruedas"],
    "performance-tires": ["Performance tires", "Neumáticos de alto rendimiento"],
    "alternator-starter-repair": ["Alternator & starter repair", "Reparación de alternador y arrancador"],
    "car-batteries": ["Car batteries", "Baterías para autos"],
    "battery-diagnostics": ["Battery diagnostics", "Diagnóstico de baterías"],
    "battery-terminal-cleaning": ["Battery terminal cleaning", "Limpieza de terminales de batería"],
    "battery-cable-replacement": ["Battery cable replacement", "Reemplazo de cables de batería"],
    "charging-system-inspection": ["Charging system inspection", "Inspección del sistema de carga"],
    "battery-installation": ["Battery installation", "Instalación de batería"],
    "battery-recycling": ["Battery recycling", "Reciclaje de baterías"],
    "ac-condensers-evaporators": ["A/C condensers & evaporators", "Condensadores y evaporadores de A/C"],
    "air-conditioning-service": ["Air conditioning service", "Servicio de aire acondicionado"],
    "ac-recharge": ["A/C recharge", "Recarga de A/C"],
    "ac-performance-check": ["A/C performance check", "Verificación de rendimiento de A/C"],
    "cabin-air-filter-replacement": ["Cabin air filter replacement", "Reemplazo del filtro de cabina"],
    "ac-compressor-replacement": ["A/C compressor replacement", "Reemplazo del compresor de A/C"],
    "ac-leak-detection-repair": ["A/C leak detection & repair", "Detección y reparación de fugas de A/C"],
    "ac-climate-control-diagnostics": ["Climate control diagnostics", "Diagnóstico del control de clima"],
    "air-oil-filters": ["Air & oil filters", "Filtros de aire y aceite"],
    "oil-change": ["Oil change", "Cambio de aceite"],
    "oil-antifreeze-brake-fluids": ["Automotive fluid service", "Servicio de fluidos automotrices"],
    "custom-exhaust-system": ["Custom exhaust system", "Sistema de escape personalizado"],
    "catalytic-converters": ["Catalytic converters", "Convertidores catalíticos"],
    "performance-exhaust": ["Performance exhaust", "Escape de alto rendimiento"],
    "emissions-repair": ["Emissions repair", "Reparación de emisiones"],
    "exhaust-muffler-repair": ["Exhaust & muffler repair", "Reparación de escape y silenciador"],
    "abs-brakes": ["ABS brakes", "Frenos ABS"],
    "brakes": ["Brake service", "Servicio de frenos"],
    "4-wheel-drive-services": ["4-wheel-drive service", "Servicio de tracción en las cuatro ruedas"],
    "axle-repair": ["Axle repair", "Reparación de ejes"],
    "clutch-repair": ["Clutch repair", "Reparación de embrague"],
    "cv-joints-driveshafts": ["CV joints & driveshafts", "Juntas CV y ejes de transmisión"],
    "universal-joint": ["Universal joint service", "Servicio de junta universal"],
    "suspension-lowering": ["Suspension lowering", "Bajada de suspensión"],
    "coil-spring-suspension": ["Coil spring suspension", "Suspensión de resortes helicoidales"],
    "rack-pinion-steering-system": ["Rack & pinion steering", "Dirección de cremallera y piñón"],
    "struts-shock-absorbers": ["Struts & shock absorbers", "Amortiguadores y puntales"],
    "power-steering-chassis": ["Power steering & chassis", "Dirección asistida y chasis"],
    "steering-suspension": ["Steering & suspension", "Dirección y suspensión"],
    "auto-tune-up-service": ["Auto tune-up", "Afinación automotriz"],
    "car-diagnostic-test": ["Diagnostic test", "Prueba de diagnóstico"],
    "timing-belts-chains": ["Timing belts & chains", "Correas y cadenas de distribución"],
    "car-maintenance-schedule": ["Maintenance schedule", "Programa de mantenimiento"],
    "serpentine-belt-replacement": ["Serpentine belt replacement", "Reemplazo de correa serpentina"],
    "car-engine-repair": ["Engine repair", "Reparación de motor"],
    "transmission-repair-service": ["Transmission repair", "Reparación de transmisión"],
    "car-electrical-system": ["Car electrical system", "Sistema eléctrico del auto"],
    "fuel-pump-replacement": ["Fuel pump replacement", "Reemplazo de bomba de combustible"],
    "cooling-system-service": ["Cooling system service", "Servicio del sistema de enfriamiento"],
    "windshield-wipers": ["Windshield wipers", "Limpiaparabrisas"],
    "power-window-repair": ["Power window repair", "Reparación de ventanas eléctricas"],
    "headlight-replacement": ["Headlight replacement", "Reemplazo de faros"],
    "fuel-injector-cleaning": ["Fuel injector cleaning", "Limpieza de inyectores"],
    "chrome-accessories-installation": ["Chrome accessory installation", "Instalación de accesorios cromados"],
    "fuel-injectors-service": ["Fuel injector service", "Servicio de inyectores"],
    "cold-air-intake-systems": ["Cold air intake systems", "Sistemas de admisión de aire frío"],
    "water-pump-repair-service": ["Water pump repair", "Reparación de bomba de agua"],
    "front-end-replacement": ["Front-end repair", "Reparación del tren delantero"],
    "radiator-repair-service": ["Radiator repair", "Reparación de radiador"],
    "ev-services": ["EV & hybrid service", "Servicio para vehículos eléctricos e híbridos"],
    "high-voltage-battery-inspection": ["High-voltage battery inspection", "Inspección de batería de alto voltaje"],
    "ev-charging-port-diagnostics": ["EV charging port diagnostics", "Diagnóstico del puerto de carga"],
    "ev-brake-service": ["EV brake service", "Servicio de frenos para VE"],
    "software-updates": ["EV software updates", "Actualizaciones de software para VE"],
    "coolant-system-flush-ev": ["EV coolant system flush", "Lavado del sistema de refrigerante para VE"],
    "inverter-inspection": ["Inverter inspection", "Inspección del inversor"],
    "ev-suspension-inspection": ["EV suspension inspection", "Inspección de suspensión para VE"],
    "ev-tire-rotation": ["EV tire rotation", "Rotación de neumáticos para VE"],
};

const categoryContent: Record<string, CategoryContent> = {
    "tires-wheels": {
        eyebrowEn: "Tires & wheels",
        eyebrowEs: "Neumáticos y ruedas",
        introLeadEn: "Dependable road contact starts with the condition of your tires, wheels, and supporting hardware.",
        introLeadEs: "El contacto seguro con la carretera comienza con el estado de los neumáticos, las ruedas y sus componentes.",
        image: "/redesign/generated/service-tires-cutout.png",
        includesEn: ["Tread depth, pressure, and wear pattern", "Tire damage, punctures, and sidewall condition", "Wheel, bearing, and mounting hardware", "Alignment or balance concerns affecting tire life"],
        includesEs: ["Profundidad, presión y patrón de desgaste", "Daños, pinchazos y estado de los costados", "Ruedas, rodamientos y herrajes de montaje", "Problemas de alineación o balanceo que afectan la vida útil"],
        signsEn: ["Uneven or rapidly wearing tread", "Steering-wheel vibration or vehicle pulling", "Repeated pressure loss or a visible puncture", "Humming, grinding, or looseness near a wheel"],
        signsEs: ["Desgaste irregular o acelerado", "Vibración en el volante o el vehículo se desvía", "Pérdida repetida de presión o pinchazo visible", "Zumbido, roce o juego cerca de una rueda"],
    },
    batteries: {
        eyebrowEn: "Starting & charging",
        eyebrowEs: "Arranque y carga",
        introLeadEn: "Starting problems can come from the battery, cables, alternator, starter, or more than one component.",
        introLeadEs: "Los problemas de arranque pueden venir de la batería, los cables, el alternador, el arrancador o varios componentes.",
        image: "/redesign/generated/service-battery-cutout.png",
        includesEn: ["Battery voltage, reserve, and load-test results", "Alternator output and starter draw", "Terminal, cable, and ground condition", "Correct battery size, fitment, and safe disposal"],
        includesEs: ["Voltaje, reserva y prueba de carga de la batería", "Salida del alternador y consumo del arrancador", "Estado de terminales, cables y tierras", "Tamaño, instalación y desecho seguro de la batería"],
        signsEn: ["Slow cranking or a clicking sound", "Battery or charging warning light", "Dim lights or intermittent electrical power", "Corrosion, swelling, or an aging battery"],
        signsEs: ["Arranque lento o sonido de clic", "Luz de batería o del sistema de carga", "Luces débiles o energía eléctrica intermitente", "Corrosión, hinchazón o batería envejecida"],
    },
    "air-conditioning": {
        eyebrowEn: "Air conditioning",
        eyebrowEs: "Aire acondicionado",
        introLeadEn: "Las Vegas heat puts every part of the climate-control system to work, from the compressor to the cabin filter.",
        introLeadEs: "El calor de Las Vegas exige mucho a todo el sistema de clima, desde el compresor hasta el filtro de cabina.",
        image: "/redesign/generated/service-ac-cutout.png",
        includesEn: ["Vent temperature and airflow", "Refrigerant pressure and visible leak points", "Compressor, condenser, and evaporator operation", "Controls, blower, belts, and cabin filter"],
        includesEs: ["Temperatura y flujo de aire en las ventilas", "Presión del refrigerante y posibles fugas", "Funcionamiento del compresor, condensador y evaporador", "Controles, ventilador, correas y filtro de cabina"],
        signsEn: ["Air stays warm or cools slowly", "Cooling fades while idling", "Unusual odor, noise, or weak airflow", "The system needs frequent recharging"],
        signsEs: ["El aire sale caliente o tarda en enfriar", "El enfriamiento disminuye al estar detenido", "Olor, ruido o flujo de aire inusual", "El sistema necesita recargas frecuentes"],
    },
    "oil-change-service": {
        eyebrowEn: "Fluids & filters",
        eyebrowEs: "Fluidos y filtros",
        introLeadEn: "Clean fluids and filters protect hard-working parts from heat, friction, and contamination.",
        introLeadEs: "Los fluidos y filtros limpios protegen los componentes del calor, la fricción y la contaminación.",
        image: "/redesign/generated/service-oil-cutout.png",
        includesEn: ["Fluid level, color, and condition", "Correct fluid or filter specification", "Visible leaks, damaged seals, and worn hoses", "Maintenance interval guidance for your vehicle"],
        includesEs: ["Nivel, color y estado de los fluidos", "Especificación correcta del fluido o filtro", "Fugas visibles, sellos dañados y mangueras gastadas", "Orientación sobre el intervalo de mantenimiento"],
        signsEn: ["A maintenance reminder or warning light is on", "A fluid looks dark, low, or contaminated", "You notice a leak or unusual odor", "The recommended service interval is due"],
        signsEs: ["Se encendió un recordatorio o luz de advertencia", "Un fluido está oscuro, bajo o contaminado", "Notas una fuga o un olor inusual", "Llegó el intervalo recomendado de servicio"],
    },
    "exhaust-catalytic-converters": {
        eyebrowEn: "Exhaust & emissions",
        eyebrowEs: "Escape y emisiones",
        introLeadEn: "A sealed, supported exhaust system keeps noise, heat, and emissions under control.",
        introLeadEs: "Un sistema de escape sellado y bien sujeto mantiene bajo control el ruido, el calor y las emisiones.",
        image: "/redesign/generated/service-exhaust-cutout.png",
        includesEn: ["Leaks, rust, impact damage, and loose connections", "Muffler, resonator, hangers, and heat shields", "Catalytic converter and oxygen-sensor data", "Emissions-related codes and exhaust flow"],
        includesEs: ["Fugas, óxido, golpes y conexiones flojas", "Silenciador, resonador, soportes y protectores térmicos", "Datos del convertidor catalítico y sensores de oxígeno", "Códigos de emisiones y flujo del escape"],
        signsEn: ["The exhaust is louder than normal", "You smell exhaust inside or near the vehicle", "A rattle comes from underneath", "The check-engine light or emissions test indicates a problem"],
        signsEs: ["El escape suena más fuerte de lo normal", "Hueles gases dentro o cerca del vehículo", "Escuchas un traqueteo debajo del auto", "La luz del motor o una prueba de emisiones indica un problema"],
    },
    brakes: {
        eyebrowEn: "Brake system",
        eyebrowEs: "Sistema de frenos",
        introLeadEn: "Consistent stopping depends on friction parts, hydraulic pressure, electronics, and fluid working together.",
        introLeadEs: "El frenado constante depende de las piezas de fricción, la presión hidráulica, la electrónica y el fluido.",
        image: "/redesign/generated/service-brakes-cutout.png",
        includesEn: ["Pad, rotor, drum, and shoe condition", "Brake-fluid level, condition, and visible leaks", "Calipers, hoses, hardware, and parking brake", "ABS warning data and wheel-speed sensors"],
        includesEs: ["Estado de pastillas, discos, tambores y zapatas", "Nivel y estado del líquido de frenos y posibles fugas", "Calipers, mangueras, herrajes y freno de estacionamiento", "Datos del ABS y sensores de velocidad de rueda"],
        signsEn: ["Squealing, grinding, or scraping while braking", "A soft, low, or pulsating brake pedal", "The vehicle pulls while stopping", "The brake or ABS warning light is on"],
        signsEs: ["Chillido, rechinido o roce al frenar", "Pedal suave, bajo o con pulsación", "El vehículo se desvía al detenerse", "Está encendida la luz de frenos o ABS"],
    },
    "cv-joints-driveshafts": {
        eyebrowEn: "Drivetrain",
        eyebrowEs: "Tren motriz",
        introLeadEn: "Axles, joints, clutches, and driveshafts must transfer power smoothly while the vehicle moves and turns.",
        introLeadEs: "Los ejes, juntas, embragues y árboles de transmisión deben transferir potencia suavemente al avanzar y girar.",
        image: "/redesign/generated/service-drivetrain-cutout.png",
        includesEn: ["CV boots, joints, axles, and seals", "Driveshaft balance, universal joints, and supports", "Clutch engagement or 4WD operation", "Leaks, looseness, and road-test symptoms"],
        includesEs: ["Guardapolvos, juntas CV, ejes y sellos", "Balance del árbol, juntas universales y soportes", "Acoplamiento del embrague o funcionamiento 4x4", "Fugas, holguras y síntomas durante la prueba de manejo"],
        signsEn: ["Clicking or popping while turning", "Clunking during acceleration or shifting", "Vibration that changes with vehicle speed", "Grease near a wheel or difficulty engaging drive"],
        signsEs: ["Clics o golpes al girar", "Golpes al acelerar o cambiar", "Vibración que cambia con la velocidad", "Grasa cerca de una rueda o dificultad para engranar"],
    },
    springs: {
        eyebrowEn: "Steering & suspension",
        eyebrowEs: "Dirección y suspensión",
        introLeadEn: "Steering and suspension parts control tire contact, ride comfort, and the way your vehicle responds.",
        introLeadEs: "Las piezas de dirección y suspensión controlan el contacto de los neumáticos, la comodidad y la respuesta del vehículo.",
        image: "/redesign/generated/service-suspension-cutout.png",
        includesEn: ["Shocks, struts, springs, mounts, and bushings", "Steering rack, linkage, and power-assist system", "Ball joints, control arms, and chassis points", "Ride height, tire wear, and alignment indicators"],
        includesEs: ["Amortiguadores, puntales, resortes, bases y bujes", "Cremallera, varillaje y asistencia de dirección", "Rótulas, brazos de control y puntos del chasis", "Altura, desgaste de neumáticos e indicadores de alineación"],
        signsEn: ["Bouncing, nose-diving, or a rough ride", "Loose, heavy, or noisy steering", "Clunks over bumps or while turning", "Uneven tire wear or an off-center steering wheel"],
        signsEs: ["Rebote, inclinación al frenar o marcha áspera", "Dirección floja, pesada o ruidosa", "Golpes en baches o al girar", "Desgaste irregular o volante fuera de centro"],
    },
    "auto-repair-services": {
        eyebrowEn: "Repair & maintenance",
        eyebrowEs: "Reparación y mantenimiento",
        introLeadEn: "Good repairs begin with confirming the symptom, testing the system, and identifying the actual cause.",
        introLeadEs: "Una buena reparación comienza confirmando el síntoma, probando el sistema e identificando la causa real.",
        image: "/redesign/generated/service-engine-cutout.png",
        includesEn: ["Your concern, warning lights, and service history", "A focused visual inspection and system tests", "Related parts that can cause the same symptom", "A clear repair recommendation before work begins"],
        includesEs: ["Tu preocupación, luces de advertencia e historial", "Inspección visual y pruebas enfocadas", "Piezas relacionadas que pueden causar el mismo síntoma", "Recomendación clara antes de comenzar el trabajo"],
        signsEn: ["A warning light stays on or returns", "Performance, shifting, or fuel economy changes", "You notice a new leak, noise, smell, or vibration", "Scheduled maintenance is due or service history is uncertain"],
        signsEs: ["Una luz de advertencia permanece o regresa", "Cambia el rendimiento, los cambios o el consumo", "Notas una fuga, ruido, olor o vibración nueva", "Toca mantenimiento o no conoces el historial del vehículo"],
    },
    "miscellaneous-services": {
        eyebrowEn: "Vehicle systems",
        eyebrowEs: "Sistemas del vehículo",
        introLeadEn: "Small components can make a large difference in visibility, comfort, cooling, and everyday reliability.",
        introLeadEs: "Los componentes pequeños pueden marcar una gran diferencia en visibilidad, comodidad, enfriamiento y confiabilidad.",
        image: "/redesign/generated/service-diagnostics-cutout.png",
        includesEn: ["The reported symptom and affected component", "Power, fitment, mounting, and nearby connections", "Related parts that could create the same problem", "Operation after service and any follow-up needs"],
        includesEs: ["El síntoma reportado y el componente afectado", "Alimentación, ajuste, montaje y conexiones cercanas", "Piezas relacionadas que podrían causar el mismo problema", "Funcionamiento después del servicio y seguimiento necesario"],
        signsEn: ["The component works slowly, intermittently, or not at all", "You notice a leak, warning light, or reduced visibility", "A new rattle, odor, or temperature change appears", "A worn part is affecting comfort or safe operation"],
        signsEs: ["El componente funciona lento, a veces o no funciona", "Notas una fuga, luz de advertencia o menor visibilidad", "Aparece un ruido, olor o cambio de temperatura", "Una pieza gastada afecta la comodidad o la seguridad"],
    },
    "ev-maintenance": {
        eyebrowEn: "EV & hybrid care",
        eyebrowEs: "Servicio para VE e híbridos",
        introLeadEn: "EV and hybrid service requires attention to high-voltage safety, thermal management, software, tires, and regenerative braking.",
        introLeadEs: "El servicio de vehículos eléctricos e híbridos requiere atención al alto voltaje, enfriamiento, software, neumáticos y frenado regenerativo.",
        image: "/redesign/generated/service-ev-cutout.png",
        includesEn: ["Vehicle alerts, scan data, and charging behavior", "High-voltage safety checks and battery condition", "Cooling, inverter, charging, and 12-volt systems", "EV-specific brake, tire, and suspension wear"],
        includesEs: ["Alertas, datos de diagnóstico y comportamiento de carga", "Seguridad de alto voltaje y estado de la batería", "Enfriamiento, inversor, carga y sistema de 12 voltios", "Desgaste de frenos, neumáticos y suspensión específico de VE"],
        signsEn: ["Range or charging speed changes unexpectedly", "A charging, battery, or power-system alert appears", "Regenerative braking feels different", "The vehicle develops uneven tire wear, noise, or cooling issues"],
        signsEs: ["La autonomía o velocidad de carga cambia sin explicación", "Aparece una alerta de carga, batería o potencia", "El frenado regenerativo se siente diferente", "Aparece desgaste irregular, ruido o problemas de enfriamiento"],
    },
};

const specialImages: Record<string, string> = {
    "transmission-repair-service": "/redesign/generated/service-transmission-cutout.png",
    "clutch-repair": "/redesign/generated/service-transmission-cutout.png",
    "cooling-system-service": "/redesign/generated/service-cooling-cutout.png",
    "water-pump-repair-service": "/redesign/generated/service-cooling-cutout.png",
    "radiator-repair-service": "/redesign/generated/service-cooling-cutout.png",
    "headlight-replacement": "/redesign/generated/service-lighting-cutout.png",
    "windshield-wipers": "/redesign/generated/service-lighting-cutout.png",
    "car-diagnostic-test": "/redesign/generated/service-diagnostics-cutout.png",
    "car-electrical-system": "/redesign/generated/service-battery-cutout.png",
};

function humanize(slug: string) {
    return slug
        .split("-")
        .map((word) => word === "ac" ? "A/C" : word === "ev" ? "EV" : word)
        .join(" ")
        .replace(/^./, (character) => character.toUpperCase());
}

export function hasServicePageContent(categorySlug: string, serviceSlug: string) {
    return Boolean(categoryContent[categorySlug] && serviceTitles[serviceSlug]);
}

export function getServicePageContent(categorySlug: string, serviceSlug: string): ServicePageContent {
    const category = categoryContent[categorySlug] ?? categoryContent["auto-repair-services"];
    const [titleEn, titleEs] = serviceTitles[serviceSlug] ?? [humanize(serviceSlug), humanize(serviceSlug)];
    const image = specialImages[serviceSlug] ?? category.image;

    return {
        ...category,
        titleEn,
        titleEs,
        image,
        introEn: `${category.introLeadEn} Our ${titleEn.toLowerCase()} service is matched to your vehicle and the condition we find, with clear options before work begins.`,
        introEs: `${category.introLeadEs} Nuestro servicio de ${titleEs.toLowerCase()} se adapta a tu vehículo y a lo que encontremos, con opciones claras antes de comenzar.`,
        altEn: `${titleEn} automotive service components`,
        altEs: `Componentes para el servicio de ${titleEs.toLowerCase()}`,
    };
}
