"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Droplet,
  Settings,
  Thermometer,
  BatteryCharging,
  Wind,
  Zap,
  AlertTriangle,
  Loader,
  MoveRight,
  ShieldCheck,
  Car,
  CircleDot,
  Gauge,
  Wrench,
  Snowflake,
  PlugZap,
  RadioTower,
  Landmark,
  Workflow,
  Fan,
  PanelTop,
  Lightbulb,
  Wand2,
  Sparkle,
  GaugeCircle,
  AlertOctagon, Calendar,
} from "lucide-react";

const services = [
  {
    category: { en: "Tires & Wheels", es: "Neumáticos y Ruedas" },
    links: [
      { href: "/services/tires-wheels/car-tires", label: { en: "Car Tires", es: "Neumáticos para Autos" }, icon: CircleDot, description: { en: "New & replacement tires", es: "Neumáticos nuevos y de reemplazo" } },
      { href: "/services/tires-wheels/suv-truck-tires", label: { en: "SUV & Truck Tires", es: "Neumáticos para SUV y Camionetas" }, icon: Gauge, description: { en: "Heavy-duty tire options", es: "Opciones de neumáticos de servicio pesado" } },
      { href: "/services/tires-wheels/tire-repair", label: { en: "Tire Repair", es: "Reparación de Neumáticos" }, icon: Wrench, description: { en: "Patch & fix damage", es: "Parchear y reparar daños" } },
      { href: "/services/tires-wheels/tire-rotation-replacement", label: { en: "Tire Rotation & Replacement", es: "Rotación y Reemplazo de Neumáticos" }, icon: Landmark, description: { en: "Even wear & replacement", es: "Desgaste uniforme y reemplazo" } },
      { href: "/services/tires-wheels/wheel-alignment", label: { en: "Wheel Alignment", es: "Alineación de Ruedas" }, icon: Workflow, description: { en: "Straighten tracking", es: "Enderezar el seguimiento" } },
      { href: "/services/tires-wheels/wheel-bearings", label: { en: "Wheel Bearings", es: "Rodamientos de Ruedas" }, icon: Fan, description: { en: "Smooth rotation service", es: "Servicio de rotación suave" } },
      { href: "/services/tires-wheels/wheel-balancing", label: { en: "Wheel Balancing", es: "Balanceo de Ruedas" }, icon: GaugeCircle, description: { en: "Reduce vibrations", es: "Reducir vibraciones" } },
      { href: "/services/tires-wheels/performance-tires", label: { en: "Performance Tires", es: "Neumáticos de Alto Rendimiento" }, icon: PlugZap, description: { en: "Grip, style, and handling", es: "Agarre, estilo y manejo" } },
    ],
  },
  {
    category: { en: "Batteries", es: "Baterías" },
    links: [
      { href: "/services/batteries/alternator-starter-repair", label: { en: "Alternator & Starter Repair", es: "Reparación de Alternador y Arrancador" }, icon: RadioTower, description: { en: "Reliable power systems", es: "Sistemas de energía confiables" } },
      { href: "/services/batteries/car-batteries", label: { en: "Car Batteries", es: "Baterías para Autos" }, icon: BatteryCharging, description: { en: "Battery testing & replacement", es: "Pruebas y reemplazo de baterías" } },
      { href: "/services/batteries/battery-diagnostics", label: { en: "Battery Diagnostics", es: "Diagnóstico de Baterías" }, icon: AlertTriangle, description: { en: "Voltage & performance checks", es: "Verificaciones de voltaje y rendimiento" } },
      { href: "/services/batteries/battery-terminal-cleaning", label: { en: "Battery Terminal Cleaning", es: "Limpieza de Terminales de Batería" }, icon: Sparkle, description: { en: "Corrosion removal & protection", es: "Eliminación de corrosión y protección" } },
      { href: "/services/batteries/battery-cable-replacement", label: { en: "Battery Cable Replacement", es: "Reemplazo de Cables de Batería" }, icon: PlugZap, description: { en: "Replace frayed or damaged cables", es: "Reemplazar cables desgastados o dañados" } },
      { href: "/services/batteries/charging-system-inspection", label: { en: "Charging System Inspection", es: "Inspección del Sistema de Carga" }, icon: Gauge, description: { en: "Check alternator, voltage regulator, belts", es: "Verificar alternador, regulador de voltaje, correas" } },
      { href: "/services/batteries/battery-installation", label: { en: "Battery Installation", es: "Instalación de Batería" }, icon: Wrench, description: { en: "Professional install & fitment", es: "Instalación profesional y ajuste" } },
      { href: "/services/batteries/battery-recycling", label: { en: "Battery Recycling", es: "Reciclaje de Baterías" }, icon: Loader, description: { en: "Eco-friendly disposal of old batteries", es: "Disposición ecológica de baterías viejas" } },
    ],
  },
  {
    category: { en: "Air Conditioning", es: "Aire Acondicionado" },
    links: [
      { href: "/services/air-conditioning/ac-condensers-evaporators", label: { en: "AC Condensers & Evaporators", es: "Condensadores y Evaporadores de AC" }, icon: Snowflake, description: { en: "AC hardware service", es: "Servicio de hardware de AC" } },
      { href: "/services/air-conditioning/air-conditioning-service", label: { en: "Air Conditioning Service", es: "Servicio de Aire Acondicionado" }, icon: Fan, description: { en: "Recharge and inspect system", es: "Recarga e inspección del sistema" } },
      { href: "/services/air-conditioning/ac-recharge", label: { en: "AC Recharge", es: "Recarga de AC" }, icon: Droplet, description: { en: "Refill refrigerant for max cooling", es: "Recargar refrigerante para máximo enfriamiento" } },
      { href: "/services/air-conditioning/ac-performance-check", label: { en: "AC Performance Check", es: "Verificación de Rendimiento de AC" }, icon: Gauge, description: { en: "Test output, temperature & pressure", es: "Probar salida, temperatura y presión" } },
      { href: "/services/air-conditioning/cabin-air-filter-replacement", label: { en: "Cabin Air Filter Replacement", es: "Reemplazo de Filtro de Aire de Cabina" }, icon: Wind, description: { en: "Clean filter for fresh interior air", es: "Filtro limpio para aire interior fresco" } },
      { href: "/services/air-conditioning/ac-compressor-replacement", label: { en: "AC Compressor Replacement", es: "Reemplazo de Compresor de AC" }, icon: Settings, description: { en: "Fix weak or failed compressors", es: "Reparar compresores débiles o fallidos" } },
      { href: "/services/air-conditioning/ac-leak-detection-repair", label: { en: "AC Leak Detection & Repair", es: "Detección y Reparación de Fugas de AC" }, icon: AlertTriangle, description: { en: "Find and seal refrigerant leaks", es: "Encontrar y sellar fugas de refrigerante" } },
      { href: "/services/air-conditioning/ac-climate-control-diagnostics", label: { en: "Climate Control Diagnostics", es: "Diagnóstico de Control de Clima" }, icon: Thermometer, description: { en: "Troubleshoot system electronics", es: "Solucionar problemas electrónicos del sistema" } },
    ],
  },
  {
    category: { en: "Oil Change Service", es: "Servicio de Cambio de Aceite" },
    links: [
      { href: "/services/oil-change-service/air-oil-filters", label: { en: "Air & Oil Filters", es: "Filtros de Aire y Aceite" }, icon: Wind, description: { en: "Clean air and oil filtration", es: "Filtración limpia de aire y aceite" } },
      { href: "/services/oil-change-service/oil-change", label: { en: "Oil Change", es: "Cambio de Aceite" }, icon: Droplet, description: { en: "Regular oil replacement", es: "Reemplazo regular de aceite" } },
      { href: "/services/oil-change-service/oil-antifreeze-brake-fluids", label: { en: "Fluid Top-Offs", es: "Rellenado de Fluidos" }, icon: Thermometer, description: { en: "Top off vital fluids", es: "Rellenar fluidos vitales" } },
    ],
  },
  {
    category: { en: "Exhaust & Catalytic Converters", es: "Escape y Convertidores Catalíticos" },
    links: [
      { href: "/services/exhaust-catalytic-converters/custom-exhaust-system", label: { en: "Custom Exhaust System", es: "Sistema de Escape Personalizado" }, icon: Settings, description: { en: "Tailored exhaust solutions", es: "Soluciones de escape a medida" } },
      { href: "/services/exhaust-catalytic-converters/catalytic-converters", label: { en: "Catalytic Converters", es: "Convertidores Catalíticos" }, icon: Zap, description: { en: "Emission control systems", es: "Sistemas de control de emisiones" } },
      { href: "/services/exhaust-catalytic-converters/performance-exhaust", label: { en: "Performance Exhaust", es: "Escape de Alto Rendimiento" }, icon: MoveRight, description: { en: "Improved sound & output", es: "Sonido y salida mejorados" } },
      { href: "/services/exhaust-catalytic-converters/emissions-repair", label: { en: "Emissions Repair", es: "Reparación de Emisiones" }, icon: AlertTriangle, description: { en: "Fix emission issues", es: "Reparar problemas de emisiones" } },
      { href: "/services/exhaust-catalytic-converters/exhaust-muffler-repair", label: { en: "Exhaust & Muffler Repair", es: "Reparación de Escape y Silenciador" }, icon: Loader, description: { en: "Quiet & safe operation", es: "Operación silenciosa y segura" } },
    ],
  },
  {
    category: { en: "Brakes", es: "Frenos" },
    links: [
      { href: "/services/brakes/abs-brakes", label: { en: "ABS Brakes", es: "Frenos ABS" }, icon: ShieldCheck, description: { en: "Advanced braking safety", es: "Seguridad de frenado avanzada" } },
      { href: "/services/brakes/brakes", label: { en: "Brake Services", es: "Servicios de Frenos" }, icon: Car, description: { en: "Pads, rotors, inspection", es: "Pastillas, rotores, inspección" } },
      { href: "/services/brakes/oil-antifreeze-brake-fluids", label: { en: "Brake Fluids", es: "Fluidos de Frenos" }, icon: Droplet, description: { en: "Hydraulic brake performance", es: "Rendimiento hidráulico de frenos" } },
    ],
  },
  {
    category: { en: "CV Joints & Driveshafts", es: "Juntas CV y Ejes de Transmisión" },
    links: [
      { href: "/services/cv-joints-driveshafts/axle-repair", label: { en: "Axle Repair", es: "Reparación de Eje" }, icon: Car, description: { en: "Stability & drivetrain work", es: "Estabilidad y trabajo de tren motriz" } },
      { href: "/services/cv-joints-driveshafts/clutch-repair", label: { en: "Clutch Repair", es: "Reparación de Embrague" }, icon: Loader, description: { en: "Smooth gear shifting", es: "Cambio de marchas suave" } },
      { href: "/services/cv-joints-driveshafts/4-wheel-drive-services", label: { en: "4 Wheel Drive Services", es: "Servicios de Tracción en 4 Ruedas" }, icon: PanelTop, description: { en: "All-terrain readiness", es: "Preparación para todo terreno" } },
      { href: "/services/cv-joints-driveshafts/cv-joints-driveshafts", label: { en: "CV Joints & Driveshafts", es: "Juntas CV y Ejes de Transmisión" }, icon: Settings, description: { en: "Full power transfer repairs", es: "Reparaciones completas de transferencia de potencia" } },
      { href: "/services/cv-joints-driveshafts/universal-joint", label: { en: "Universal Joint", es: "Junta Universal" }, icon: Wand2, description: { en: "Balance and motion", es: "Equilibrio y movimiento" } },
    ],
  },
  {
    category: { en: "Springs & Suspension", es: "Muelles y Suspensión" },
    links: [
      { href: "/services/springs/suspension-lowering", label: { en: "Suspension Lowering", es: "Bajada de Suspensión" }, icon: MoveRight, description: { en: "Improve look & handling", es: "Mejorar apariencia y manejo" } },
      { href: "/services/springs/coil-spring-suspension", label: { en: "Coil Spring Suspension", es: "Suspensión de Muelles Helicoidales" }, icon: Thermometer, description: { en: "Comfort and support", es: "Comodidad y soporte" } },
      { href: "/services/springs/rack-pinion-steering-system", label: { en: "Rack & Pinion", es: "Cremallera y Piñón" }, icon: Settings, description: { en: "Precision steering", es: "Dirección de precisión" } },
      { href: "/services/springs/struts-shock-absorbers", label: { en: "Struts & Shocks", es: "Amortiguadores y Struts" }, icon: AlertOctagon, description: { en: "Ride smoothness", es: "Suavidad de conducción" } },
      { href: "/services/springs/power-steering-chassis", label: { en: "Power Steering & Chassis", es: "Dirección Asistida y Chasis" }, icon: Gauge, description: { en: "Maneuverability & control", es: "Maniobrabilidad y control" } },
      { href: "/services/springs/steering-suspension", label: { en: "Steering & Suspension", es: "Dirección y Suspensión" }, icon: Sparkle, description: { en: "Full suspension tune-up", es: "Ajuste completo de suspensión" } },
    ],
  },
  {
    category: { en: "Auto Repair Services", es: "Servicios de Reparación de Automóviles" },
    links: [
      { href: "/services/auto-repair-services/auto-tune-up-service", label: { en: "Auto Tune Up", es: "Ajuste de Auto" }, icon: Wrench, description: { en: "Improve performance", es: "Mejorar rendimiento" } },
      { href: "/services/auto-repair-services/car-diagnostic-test", label: { en: "Diagnostic Test", es: "Prueba de Diagnóstico" }, icon: Zap, description: { en: "Scan & identify issues", es: "Escanear e identificar problemas" } },
      { href: "/services/auto-repair-services/timing-belts-chains", label: { en: "Timing Belts & Chains", es: "Correas y Cadenas de Distribución" }, icon: Loader, description: { en: "Engine synchronization", es: "Sincronización del motor" } },
      { href: "/services/auto-repair-services/car-maintenance-schedule", label: { en: "Maintenance Schedule", es: "Programa de Mantenimiento" }, icon: Calendar, description: { en: "Stay on track", es: "Mantenerse al día" } },
      { href: "/services/auto-repair-services/serpentine-belt-replacement", label: { en: "Serpentine Belt", es: "Correa Serpentina" }, icon: MoveRight, description: { en: "Drive multiple systems", es: "Impulsar múltiples sistemas" } },
      { href: "/services/auto-repair-services/car-engine-repair", label: { en: "Engine Repair", es: "Reparación de Motor" }, icon: Thermometer, description: { en: "Fix performance issues", es: "Reparar problemas de rendimiento" } },
      { href: "/services/auto-repair-services/transmission-repair-service", label: { en: "Transmission Repair", es: "Reparación de Transmisión" }, icon: Settings, description: { en: "Smooth gear operation", es: "Operación suave de engranajes" } },
      { href: "/services/auto-repair-services/car-electrical-system", label: { en: "Electrical System", es: "Sistema Eléctrico" }, icon: Zap, description: { en: "Wiring, fuses, and lights", es: "Cableado, fusibles y luces" } },
      { href: "/services/auto-repair-services/fuel-pump-replacement", label: { en: "Fuel Pump Replacement", es: "Reemplazo de Bomba de Combustible" }, icon: Droplet, description: { en: "Keep fuel flowing", es: "Mantener el flujo de combustible" } },
      { href: "/services/auto-repair-services/cooling-system-service", label: { en: "Cooling System", es: "Sistema de Enfriamiento" }, icon: Thermometer, description: { en: "Prevent overheating", es: "Prevenir sobrecalentamiento" } },
    ],
  },
  {
    category: { en: "Miscellaneous Services", es: "Servicios Misceláneos" },
    links: [
      { href: "/services/miscellaneous-services/windshield-wipers", label: { en: "Windshield Wipers", es: "Limpiaparabrisas" }, icon: Wind, description: { en: "Visibility & safety", es: "Visibilidad y seguridad" } },
      { href: "/services/miscellaneous-services/power-window-repair", label: { en: "Power Window Repair", es: "Reparación de Ventanas Eléctricas" }, icon: Car, description: { en: "Electrical window systems", es: "Sistemas de ventanas eléctricas" } },
      { href: "/services/miscellaneous-services/headlight-replacement", label: { en: "Headlight Replacement", es: "Reemplazo de Faros" }, icon: Lightbulb, description: { en: "See & be seen", es: "Ver y ser visto" } },
      { href: "/services/miscellaneous-services/fuel-injector-cleaning", label: { en: "Fuel Injector Cleaning", es: "Limpieza de Inyectores de Combustible" }, icon: Droplet, description: { en: "Restore engine efficiency", es: "Restaurar eficiencia del motor" } },
      { href: "/services/miscellaneous-services/chrome-accessories-installation", label: { en: "Chrome Accessories", es: "Accesorios Cromados" }, icon: Sparkle, description: { en: "Add visual flair", es: "Añadir estilo visual" } },
      { href: "/services/miscellaneous-services/fuel-injectors-service", label: { en: "Fuel Injectors Service", es: "Servicio de Inyectores de Combustible" }, icon: PlugZap, description: { en: "Fuel atomization", es: "Atomización de combustible" } },
      { href: "/services/miscellaneous-services/cold-air-intake-systems", label: { en: "Cold Air Intake", es: "Admisión de Aire Frío" }, icon: Wind, description: { en: "Improve power & airflow", es: "Mejorar potencia y flujo de aire" } },
      { href: "/services/miscellaneous-services/water-pump-repair-service", label: { en: "Water Pump Repair", es: "Reparación de Bomba de Agua" }, icon: Thermometer, description: { en: "Prevent engine overheating", es: "Prevenir sobrecalentamiento del motor" } },
      { href: "/services/miscellaneous-services/front-end-replacement", label: { en: "Front End Replacement", es: "Reemplazo de la Parte Delantera" }, icon: Car, description: { en: "Structural work", es: "Trabajo estructural" } },
      { href: "/services/miscellaneous-services/radiator-repair-service", label: { en: "Radiator Repair", es: "Reparación de Radiador" }, icon: Thermometer, description: { en: "Cool engine system", es: "Sistema de enfriamiento del motor" } },
    ],
  },
  {
    category: { en: "EV Maintenance", es: "Mantenimiento de VE" },
    links: [
      { href: "/services/ev-maintenance/ev-services", label: { en: "EV Services", es: "Servicios de VE" }, icon: BatteryCharging, description: { en: "Electric & hybrid repair", es: "Reparación de eléctricos e híbridos" } },
      { href: "/services/ev-maintenance/high-voltage-battery-inspection", label: { en: "High Voltage Battery Inspection", es: "Inspección de Batería de Alto Voltaje" }, icon: Gauge, description: { en: "Check charge capacity & health", es: "Verificar capacidad de carga y salud" } },
      { href: "/services/ev-maintenance/ev-charging-port-diagnostics", label: { en: "Charging Port Diagnostics", es: "Diagnóstico de Puerto de Carga" }, icon: PlugZap, description: { en: "Fix slow or non-working chargers", es: "Reparar cargadores lentos o no funcionales" } },
      { href: "/services/ev-maintenance/ev-brake-service", label: { en: "EV Brake Service", es: "Servicio de Frenos de VE" }, icon: ShieldCheck, description: { en: "Service regenerative & hydraulic brakes", es: "Servicio de frenos regenerativos e hidráulicos" } },
      { href: "/services/ev-maintenance/software-updates", label: { en: "EV Software Updates", es: "Actualizaciones de Software de VE" }, icon: Settings, description: { en: "Ensure latest system features & fixes", es: "Asegurar las últimas características y correcciones del sistema" } },
      { href: "/services/ev-maintenance/coolant-system-flush-ev", label: { en: "Coolant System Flush", es: "Lavado del Sistema de Refrigerante" }, icon: Thermometer, description: { en: "Maintain battery & motor temperature", es: "Mantener temperatura de batería y motor" } },
      { href: "/services/ev-maintenance/inverter-inspection", label: { en: "Inverter Inspection", es: "Inspección de Inversor" }, icon: Zap, description: { en: "Ensure smooth power delivery", es: "Asegurar entrega suave de potencia" } },
      { href: "/services/ev-maintenance/ev-suspension-inspection", label: { en: "EV Suspension Inspection", es: "Inspección de Suspensión de VE" }, icon: Fan, description: { en: "Check ride stability & cornering", es: "Verificar estabilidad de conducción y curvas" } },
      { href: "/services/ev-maintenance/ev-tire-rotation", label: { en: "EV Tire Rotation", es: "Rotación de Neumáticos de VE" }, icon: CircleDot, description: { en: "Even out EV-specific tire wear", es: "Igualar el desgaste específico de neumáticos de VE" } },
    ],
  },
];

export default function ServicesPage() {
  const { language } = useLanguage();

  return (
      <div className="min-h-[90vh] bg-white dark:bg-black text-black dark:text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold text-center mb-12 text-green-600 dark:text-green-400">
            {language === "en" ? "Our Services" : "Nuestros Servicios"}
          </h1>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ category, links }) => (
                <Card
                    key={language === "en" ? category.en : category.es}
                    className="flex flex-col justify-items-start border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-green-600 dark:text-green-400">
                      {language === "en" ? category.en : category.es}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {links.map(({ href, label, icon: Icon, description }) => (
                          <li key={href}>
                            <Link
                                href={href}
                                className="flex items-start gap-3 group"
                            >
                              <Icon className="w-5 h-5 mt-1 text-green-500 dark:text-green-400 flex-shrink-0" />
                              <div>
                          <span className="block font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline">
                            {language === "en" ? label.en : label.es}
                          </span>
                                <span className="block text-sm text-neutral-600 dark:text-neutral-400">
                            {language === "en" ? description.en : description.es}
                          </span>
                              </div>
                            </Link>
                          </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </div>
  );
}