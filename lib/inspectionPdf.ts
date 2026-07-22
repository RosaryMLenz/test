import { jsPDF } from "jspdf";
import type { InspectionItemStatus, VehicleInspection } from "@/types/VehicleInspection";

const GREEN = [23, 100, 63] as const;
const INK = [17, 25, 21] as const;
const MUTED = [96, 108, 101] as const;
const LINE = [218, 225, 220] as const;

const STATUS_STYLE: Record<InspectionItemStatus, { label: string; color: readonly [number, number, number] }> = {
    pass: { label: "PASS", color: [32, 132, 83] },
    attention: { label: "ATTENTION", color: [202, 134, 20] },
    urgent: { label: "URGENT", color: [190, 51, 45] },
    na: { label: "N/A", color: [112, 120, 115] },
    uninspected: { label: "NOT CHECKED", color: [112, 120, 115] },
};

function formatInspectionDate(value: string) {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function inspectionPdfFilename(inspection: VehicleInspection) {
    const vin = inspection.vin.slice(-6) || "vehicle";
    return `${inspection.inspectionNumber}-${vin}.pdf`.replace(/[^a-zA-Z0-9_.-]/g, "-");
}

export function buildInspectionPdf(inspection: VehicleInspection) {
    const doc = new jsPDF({ unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 0;

    const addPageHeader = (continued = false) => {
        doc.setFillColor(...GREEN);
        doc.rect(0, 0, pageWidth, 22, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("RAINFOREST21 AUTOMOTIVE", margin, 9.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text("3280 Wynn Rd, Unit 4  |  Las Vegas, NV 89102  |  (702) 762-7573", margin, 15.4);
        doc.setFont("helvetica", "bold");
        doc.text(continued ? "VEHICLE INSPECTION - CONTINUED" : "VEHICLE INSPECTION REPORT", pageWidth - margin, 12, { align: "right" });
        y = 30;
    };

    const ensureSpace = (height: number) => {
        if (y + height <= pageHeight - 16) return;
        doc.addPage();
        addPageHeader(true);
    };

    const drawLabelValue = (label: string, value: string, x: number, top: number, width: number) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...MUTED);
        doc.text(label.toUpperCase(), x, top);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...INK);
        const lines = doc.splitTextToSize(value || "-", width);
        doc.text(lines, x, top + 5);
    };

    const drawSectionTitle = (title: string) => {
        ensureSpace(12);
        doc.setFillColor(236, 242, 238);
        doc.roundedRect(margin, y, contentWidth, 9, 1.4, 1.4, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...GREEN);
        doc.text(title.toUpperCase(), margin + 4, y + 5.9);
        y += 13;
    };

    const drawTextBlock = (label: string, value: string) => {
        if (!value.trim()) return;
        const lines = doc.splitTextToSize(value, contentWidth - 8);
        const height = 11 + lines.length * 4;
        ensureSpace(height);
        doc.setDrawColor(...LINE);
        doc.roundedRect(margin, y, contentWidth, height, 1.5, 1.5, "S");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...MUTED);
        doc.text(label.toUpperCase(), margin + 4, y + 5.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.3);
        doc.setTextColor(...INK);
        doc.text(lines, margin + 4, y + 11);
        y += height + 4;
    };

    addPageHeader();

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.setFontSize(19);
    doc.text(`${inspection.year} ${inspection.make} ${inspection.model}`, margin, y + 2);
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`${inspection.inspectionNumber}  |  ${formatInspectionDate(inspection.inspectionDate)}`, margin, y + 8);

    const reportLabel = inspection.status === "completed" ? "COMPLETED" : "DRAFT";
    doc.setFillColor(inspection.status === "completed" ? 23 : 112, inspection.status === "completed" ? 100 : 120, inspection.status === "completed" ? 63 : 115);
    doc.roundedRect(pageWidth - margin - 29, y - 3, 29, 9, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(reportLabel, pageWidth - margin - 14.5, y + 2.8, { align: "center" });
    y += 15;

    doc.setDrawColor(...LINE);
    doc.roundedRect(margin, y, contentWidth, 35, 1.8, 1.8, "S");
    const half = contentWidth / 2;
    drawLabelValue("Customer", inspection.customerName, margin + 4, y + 7, half - 8);
    drawLabelValue("Phone / Email", [inspection.customerPhone, inspection.customerEmail].filter(Boolean).join("  |  "), margin + 4, y + 20, half - 8);
    drawLabelValue("Vehicle", `${inspection.year} ${inspection.make} ${inspection.model}${inspection.trim ? ` ${inspection.trim}` : ""}`, margin + half + 4, y + 7, half - 8);
    drawLabelValue("VIN", inspection.vin, margin + half + 4, y + 20, half - 8);
    y += 40;

    const details = [
        ["Mileage", inspection.mileage || "-"],
        ["License plate", inspection.licensePlate || "-"],
        ["Fuel level", inspection.fuelLevel || "-"],
        ["Repair order", inspection.repairOrderNumber || "-"],
    ];
    doc.setFillColor(247, 249, 247);
    doc.roundedRect(margin, y, contentWidth, 18, 1.8, 1.8, "F");
    details.forEach(([label, value], index) => drawLabelValue(label, value, margin + 4 + index * (contentWidth / 4), y + 5, contentWidth / 4 - 7));
    y += 23;

    const counts = inspection.items.reduce(
        (result, item) => ({ ...result, [item.status]: result[item.status] + 1 }),
        { pass: 0, attention: 0, urgent: 0, na: 0, uninspected: 0 },
    );
    drawSectionTitle("Inspection summary");
    const summary = [
        ["Passed", counts.pass, [32, 132, 83] as const],
        ["Needs attention", counts.attention, [202, 134, 20] as const],
        ["Urgent", counts.urgent, [190, 51, 45] as const],
        ["N/A", counts.na, [112, 120, 115] as const],
    ];
    summary.forEach(([label, count, color], index) => {
        const boxWidth = (contentWidth - 9) / 4;
        const x = margin + index * (boxWidth + 3);
        doc.setDrawColor(...LINE);
        doc.roundedRect(x, y, boxWidth, 17, 1.4, 1.4, "S");
        doc.setTextColor(...(color as readonly [number, number, number]));
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text(String(count), x + 4, y + 8);
        doc.setFontSize(7.2);
        doc.text(String(label).toUpperCase(), x + 4, y + 13.2);
    });
    y += 23;

    if (inspection.customerConcern) {
        drawSectionTitle("Customer concern");
        drawTextBlock("Concern / requested check", inspection.customerConcern);
    }

    drawSectionTitle("Inspection checkpoints");
    const categories = Array.from(new Set(inspection.items.map((item) => item.category)));

    categories.forEach((category) => {
        ensureSpace(16);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...INK);
        doc.text(category, margin, y + 4);
        y += 8;

        inspection.items.filter((item) => item.category === category).forEach((item) => {
            const noteLines = item.notes ? doc.splitTextToSize(item.notes, 73) : [];
            const rowHeight = Math.max(10, 6 + noteLines.length * 3.8);
            ensureSpace(rowHeight + 2);
            const style = STATUS_STYLE[item.status];

            doc.setDrawColor(...LINE);
            doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);
            doc.setFillColor(...style.color);
            doc.circle(margin + 2.2, y + 4.2, 1.4, "F");
            doc.setTextColor(...style.color);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.2);
            doc.text(style.label, margin + 6, y + 5.2);
            doc.setTextColor(...INK);
            doc.setFontSize(8.5);
            doc.text(item.label, margin + 35, y + 5.2);
            if (noteLines.length) {
                doc.setTextColor(...MUTED);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7.8);
                doc.text(noteLines, margin + 99, y + 5.2);
            }
            y += rowHeight;
        });
        y += 4;
    });

    drawSectionTitle("Technician notes & recommendations");
    drawTextBlock("Inspection summary", inspection.mechanicSummary || "No additional summary provided.");
    drawTextBlock("Recommended service", inspection.recommendations || "No service recommendations recorded.");
    drawTextBlock("Road test notes", inspection.roadTestNotes);

    ensureSpace(30);
    doc.setFillColor(241, 246, 242);
    doc.roundedRect(margin, y, contentWidth, 25, 1.8, 1.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...GREEN);
    doc.text("TECHNICIAN CERTIFICATION", margin + 4, y + 6);
    doc.setTextColor(...INK);
    doc.setFontSize(10);
    doc.text(inspection.technicianName, margin + 4, y + 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(...MUTED);
    doc.text(
        inspection.certified
            ? "I certify that the items in this report reflect the vehicle condition observed at inspection."
            : "Draft report - technician certification has not been completed.",
        margin + 4,
        y + 19,
    );

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(...MUTED);
        doc.text("This inspection reflects visible conditions at the time of service and is not a warranty of future performance.", margin, pageHeight - 7);
        doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: "right" });
    }

    return doc;
}

export function downloadInspectionPdf(inspection: VehicleInspection) {
    buildInspectionPdf(inspection).save(inspectionPdfFilename(inspection));
}

export function printInspectionPdf(inspection: VehicleInspection) {
    const blobUrl = URL.createObjectURL(buildInspectionPdf(inspection).output("blob"));
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.width = "1px";
    frame.style.height = "1px";
    frame.style.opacity = "0";
    frame.src = blobUrl;
    document.body.appendChild(frame);
    frame.onload = () => frame.contentWindow?.print();
    window.setTimeout(() => {
        frame.remove();
        URL.revokeObjectURL(blobUrl);
    }, 60_000);
}

export async function shareInspectionPdf(inspection: VehicleInspection) {
    const file = new File(
        [buildInspectionPdf(inspection).output("blob")],
        inspectionPdfFilename(inspection),
        { type: "application/pdf" },
    );

    if (!navigator.share || !navigator.canShare?.({ files: [file] })) return false;

    await navigator.share({
        title: `${inspection.inspectionNumber} vehicle inspection`,
        text: `Vehicle inspection report for ${inspection.year} ${inspection.make} ${inspection.model}.`,
        files: [file],
    });
    return true;
}
