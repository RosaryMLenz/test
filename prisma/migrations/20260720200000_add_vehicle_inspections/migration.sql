CREATE TABLE "VehicleInspection" (
    "id" TEXT NOT NULL,
    "inspectionNumber" TEXT NOT NULL,
    "bookingId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "inspectionDate" TEXT NOT NULL,
    "technicianName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "year" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "vin" TEXT NOT NULL,
    "licensePlate" TEXT,
    "mileage" TEXT,
    "fuelLevel" TEXT,
    "repairOrderNumber" TEXT,
    "customerConcern" TEXT,
    "roadTestNotes" TEXT,
    "mechanicSummary" TEXT,
    "recommendations" TEXT,
    "overallRating" TEXT NOT NULL DEFAULT 'good',
    "items" JSONB NOT NULL,
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleInspection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VehicleInspection_inspectionNumber_key" ON "VehicleInspection"("inspectionNumber");
CREATE INDEX "VehicleInspection_inspectionDate_status_idx" ON "VehicleInspection"("inspectionDate", "status");
CREATE INDEX "VehicleInspection_customerName_idx" ON "VehicleInspection"("customerName");
CREATE INDEX "VehicleInspection_vin_idx" ON "VehicleInspection"("vin");
CREATE INDEX "VehicleInspection_bookingId_idx" ON "VehicleInspection"("bookingId");

ALTER TABLE "VehicleInspection" ADD CONSTRAINT "VehicleInspection_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
