/*
  Warnings:

  - You are about to drop the column `createdAtVegas` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "createdAtVegas",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
