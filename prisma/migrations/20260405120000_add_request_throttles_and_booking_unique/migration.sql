CREATE TABLE "RequestThrottle" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "blockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestThrottle_pkey" PRIMARY KEY ("key")
);

UPDATE "Booking"
SET "date" = NULL
WHERE "date" = '';

UPDATE "Booking"
SET "time" = NULL
WHERE "time" = '';

CREATE UNIQUE INDEX "Booking_date_time_key" ON "Booking"("date", "time");
