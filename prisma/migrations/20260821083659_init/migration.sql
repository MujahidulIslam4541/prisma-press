/*
  Warnings:

  - A unique constraint covering the columns `[stripCustomerId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Made the column `stripCustomerId` on table `subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "subscription" ALTER COLUMN "stripCustomerId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripCustomerId_key" ON "subscription"("stripCustomerId");
