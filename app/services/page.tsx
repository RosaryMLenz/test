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
    category: "Tires & Wheels",
    links: [
      { href: "/services/tires-wheels/car-tires", label: "Car Tires", icon: CircleDot, description: "New & replacement tires" },
      { href: "/services/tires-wheels/suv-truck-tires", label: "SUV & Truck Tires", icon: Gauge, description: "Heavy-duty tire options" },
      { href: "/services/tires-wheels/tire-repair", label: "Tire Repair", icon: Wrench, description: "Patch & fix damage" },
      { href: "/services/tires-wheels/tire-rotation-replacement", label: "Tire Rotation & Replacement", icon: Landmark, description: "Even wear & replacement" },
      { href: "/services/tires-wheels/wheel-alignment", label: "Wheel Alignment", icon: Workflow, description: "Straighten tracking" },
      { href: "/services/tires-wheels/wheel-bearings", label: "Wheel Bearings", icon: Fan, description: "Smooth rotation service" },
      { href: "/services/tires-wheels/wheel-balancing", label: "Wheel Balancing", icon: GaugeCircle, description: "Reduce vibrations" },
      { href: "/services/tires-wheels/performance-tires", label: "Performance Tires", icon: PlugZap, description: "Grip, style, and handling" },
    ],
  },
  {
    category: "Batteries",
    links: [
      {
        href: "/services/batteries/alternator-starter-repair",
        label: "Alternator & Starter Repair",
        icon: RadioTower,
        description: "Reliable power systems",
      },
      {
        href: "/services/batteries/car-batteries",
        label: "Car Batteries",
        icon: BatteryCharging,
        description: "Battery testing & replacement",
      },
      {
        href: "/services/batteries/battery-diagnostics",
        label: "Battery Diagnostics",
        icon: AlertTriangle,
        description: "Voltage & performance checks",
      },
      {
        href: "/services/batteries/battery-terminal-cleaning",
        label: "Battery Terminal Cleaning",
        icon: Sparkle,
        description: "Corrosion removal & protection",
      },
      {
        href: "/services/batteries/battery-cable-replacement",
        label: "Battery Cable Replacement",
        icon: PlugZap,
        description: "Replace frayed or damaged cables",
      },
      {
        href: "/services/batteries/charging-system-inspection",
        label: "Charging System Inspection",
        icon: Gauge,
        description: "Check alternator, voltage regulator, belts",
      },
      {
        href: "/services/batteries/battery-installation",
        label: "Battery Installation",
        icon: Wrench,
        description: "Professional install & fitment",
      },
      {
        href: "/services/batteries/battery-recycling",
        label: "Battery Recycling",
        icon: Loader,
        description: "Eco-friendly disposal of old batteries",
      },
    ],
  },
  {
    category: "Air Conditioning",
    links: [
      {
        href: "/services/air-conditioning/ac-condensers-evaporators",
        label: "AC Condensers & Evaporators",
        icon: Snowflake,
        description: "AC hardware service",
      },
      {
        href: "/services/air-conditioning/air-conditioning-service",
        label: "Air Conditioning Service",
        icon: Fan,
        description: "Recharge and inspect system",
      },
      {
        href: "/services/air-conditioning/ac-recharge",
        label: "AC Recharge",
        icon: Droplet,
        description: "Refill refrigerant for max cooling",
      },
      {
        href: "/services/air-conditioning/ac-performance-check",
        label: "AC Performance Check",
        icon: Gauge,
        description: "Test output, temperature & pressure",
      },
      {
        href: "/services/air-conditioning/cabin-air-filter-replacement",
        label: "Cabin Air Filter Replacement",
        icon: Wind,
        description: "Clean filter for fresh interior air",
      },
      {
        href: "/services/air-conditioning/ac-compressor-replacement",
        label: "AC Compressor Replacement",
        icon: Settings,
        description: "Fix weak or failed compressors",
      },
      {
        href: "/services/air-conditioning/ac-leak-detection-repair",
        label: "AC Leak Detection & Repair",
        icon: AlertTriangle,
        description: "Find and seal refrigerant leaks",
      },
      {
        href: "/services/air-conditioning/ac-climate-control-diagnostics",
        label: "Climate Control Diagnostics",
        icon: Thermometer,
        description: "Troubleshoot system electronics",
      },
    ],
  },
  {
    category: "Oil Change Service",
    links: [
      { href: "/services/oil-change-service/air-oil-filters", label: "Air & Oil Filters", icon: Wind, description: "Clean air and oil filtration" },
      { href: "/services/oil-change-service/oil-change", label: "Oil Change", icon: Droplet, description: "Regular oil replacement" },
      { href: "/services/oil-change-service/oil-antifreeze-brake-fluids", label: "Fluid Top-Offs", icon: Thermometer, description: "Top off vital fluids" },
    ],
  },
  {
    category: "Exhaust & Catalytic Converters",
    links: [
      { href: "/services/exhaust-catalytic-converters/custom-exhaust-system", label: "Custom Exhaust System", icon: Settings, description: "Tailored exhaust solutions" },
      { href: "/services/exhaust-catalytic-converters/catalytic-converters", label: "Catalytic Converters", icon: Zap, description: "Emission control systems" },
      { href: "/services/exhaust-catalytic-converters/performance-exhaust", label: "Performance Exhaust", icon: MoveRight, description: "Improved sound & output" },
      { href: "/services/exhaust-catalytic-converters/emissions-repair", label: "Emissions Repair", icon: AlertTriangle, description: "Fix emission issues" },
      { href: "/services/exhaust-catalytic-converters/exhaust-muffler-repair", label: "Exhaust & Muffler Repair", icon: Loader, description: "Quiet & safe operation" },
    ],
  },
  {
    category: "Brakes",
    links: [
      { href: "/services/brakes/abs-brakes", label: "ABS Brakes", icon: ShieldCheck, description: "Advanced braking safety" },
      { href: "/services/brakes/brakes", label: "Brake Services", icon: Car, description: "Pads, rotors, inspection" },
      { href: "/services/brakes/oil-antifreeze-brake-fluids", label: "Brake Fluids", icon: Droplet, description: "Hydraulic brake performance" },
    ],
  },
  {
    category: "CV Joints & Driveshafts",
    links: [
      { href: "/services/cv-joints-driveshafts/axle-repair", label: "Axle Repair", icon: Car, description: "Stability & drivetrain work" },
      { href: "/services/cv-joints-driveshafts/clutch-repair", label: "Clutch Repair", icon: Loader, description: "Smooth gear shifting" },
      { href: "/services/cv-joints-driveshafts/4-wheel-drive-services", label: "4 Wheel Drive Services", icon: PanelTop, description: "All-terrain readiness" },
      { href: "/services/cv-joints-driveshafts/cv-joints-driveshafts", label: "CV Joints & Driveshafts", icon: Settings, description: "Full power transfer repairs" },
      { href: "/services/cv-joints-driveshafts/universal-joint", label: "Universal Joint", icon: Wand2, description: "Balance and motion" },
    ],
  },
  {
    category: "Springs & Suspension",
    links: [
      { href: "/services/springs/suspension-lowering", label: "Suspension Lowering", icon: MoveRight, description: "Improve look & handling" },
      { href: "/services/springs/coil-spring-suspension", label: "Coil Spring Suspension", icon: Thermometer, description: "Comfort and support" },
      { href: "/services/springs/rack-pinion-steering-system", label: "Rack & Pinion", icon: Settings, description: "Precision steering" },
      { href: "/services/springs/struts-shock-absorbers", label: "Struts & Shocks", icon: AlertOctagon, description: "Ride smoothness" },
      { href: "/services/springs/power-steering-chassis", label: "Power Steering & Chassis", icon: Gauge, description: "Maneuverability & control" },
      { href: "/services/springs/steering-suspension", label: "Steering & Suspension", icon: Sparkle, description: "Full suspension tune-up" },
    ],
  },
  {
    category: "Auto Repair Services",
    links: [
      { href: "/services/auto-repair-services/auto-tune-up-service", label: "Auto Tune Up", icon: Wrench, description: "Improve performance" },
      { href: "/services/auto-repair-services/car-diagnostic-test", label: "Diagnostic Test", icon: Zap, description: "Scan & identify issues" },
      { href: "/services/auto-repair-services/timing-belts-chains", label: "Timing Belts & Chains", icon: Loader, description: "Engine synchronization" },
      { href: "/services/auto-repair-services/car-maintenance-schedule", label: "Maintenance Schedule", icon: Calendar, description: "Stay on track" },
      { href: "/services/auto-repair-services/serpentine-belt-replacement", label: "Serpentine Belt", icon: MoveRight, description: "Drive multiple systems" },
      { href: "/services/auto-repair-services/car-engine-repair", label: "Engine Repair", icon: Thermometer, description: "Fix performance issues" },
      { href: "/services/auto-repair-services/transmission-repair-service", label: "Transmission Repair", icon: Settings, description: "Smooth gear operation" },
      { href: "/services/auto-repair-services/car-electrical-system", label: "Electrical System", icon: Zap, description: "Wiring, fuses, and lights" },
      { href: "/services/auto-repair-services/fuel-pump-replacement", label: "Fuel Pump Replacement", icon: Droplet, description: "Keep fuel flowing" },
      { href: "/services/auto-repair-services/cooling-system-service", label: "Cooling System", icon: Thermometer, description: "Prevent overheating" },
    ],
  },
  {
    category: "Miscellaneous Services",
    links: [
      { href: "/services/miscellaneous-services/windshield-wipers", label: "Windshield Wipers", icon: Wind, description: "Visibility & safety" },
      { href: "/services/miscellaneous-services/power-window-repair", label: "Power Window Repair", icon: Car, description: "Electrical window systems" },
      { href: "/services/miscellaneous-services/headlight-replacement", label: "Headlight Replacement", icon: Lightbulb, description: "See & be seen" },
      { href: "/services/miscellaneous-services/fuel-injector-cleaning", label: "Fuel Injector Cleaning", icon: Droplet, description: "Restore engine efficiency" },
      { href: "/services/miscellaneous-services/chrome-accessories-installation", label: "Chrome Accessories", icon: Sparkle, description: "Add visual flair" },
      { href: "/services/miscellaneous-services/fuel-injectors-service", label: "Fuel Injectors Service", icon: PlugZap, description: "Fuel atomization" },
      { href: "/services/miscellaneous-services/cold-air-intake-systems", label: "Cold Air Intake", icon: Wind, description: "Improve power & airflow" },
      { href: "/services/miscellaneous-services/water-pump-repair-service", label: "Water Pump Repair", icon: Thermometer, description: "Prevent engine overheating" },
      { href: "/services/miscellaneous-services/front-end-replacement", label: "Front End Replacement", icon: Car, description: "Structural work" },
      { href: "/services/miscellaneous-services/radiator-repair-service", label: "Radiator Repair", icon: Thermometer, description: "Cool engine system" },
    ],
  },
  {
    category: "EV Maintenance",
    links: [
      {
        href: "/services/ev-maintenance/ev-services",
        label: "EV Services",
        icon: BatteryCharging,
        description: "Electric & hybrid repair",
      },
      {
        href: "/services/ev-maintenance/high-voltage-battery-inspection",
        label: "High Voltage Battery Inspection",
        icon: Gauge,
        description: "Check charge capacity & health",
      },
      {
        href: "/services/ev-maintenance/ev-charging-port-diagnostics",
        label: "Charging Port Diagnostics",
        icon: PlugZap,
        description: "Fix slow or non-working chargers",
      },
      {
        href: "/services/ev-maintenance/ev-brake-service",
        label: "EV Brake Service",
        icon: ShieldCheck,
        description: "Service regenerative & hydraulic brakes",
      },
      {
        href: "/services/ev-maintenance/software-updates",
        label: "EV Software Updates",
        icon: Settings,
        description: "Ensure latest system features & fixes",
      },
      {
        href: "/services/ev-maintenance/coolant-system-flush-ev",
        label: "Coolant System Flush",
        icon: Thermometer,
        description: "Maintain battery & motor temperature",
      },
      {
        href: "/services/ev-maintenance/inverter-inspection",
        label: "Inverter Inspection",
        icon: Zap,
        description: "Ensure smooth power delivery",
      },
      {
        href: "/services/ev-maintenance/ev-suspension-inspection",
        label: "EV Suspension Inspection",
        icon: Fan,
        description: "Check ride stability & cornering",
      },
      {
        href: "/services/ev-maintenance/ev-tire-rotation",
        label: "EV Tire Rotation",
        icon: CircleDot,
        description: "Even out EV-specific tire wear",
      },
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
              key={category}
              className="flex flex-col justify-items-start border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl text-green-600 dark:text-green-400">
                  {category}
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
                            {label}
                          </span>
                          <span className="block text-sm text-neutral-600 dark:text-neutral-400">
                            {description}
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
