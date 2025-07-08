-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "reason" TEXT,
    "vehicle" TEXT,
    "year" TEXT,
    "problemDescription" TEXT,
    "date" TEXT,
    "time" TEXT,
    "additionalDetails" TEXT,
    "acceptTerms" BOOLEAN NOT NULL,
    "enableNotifications" BOOLEAN NOT NULL,
    "dropOffOrWait" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAtVegas" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_date_time_idx" ON "Booking"("date", "time");
