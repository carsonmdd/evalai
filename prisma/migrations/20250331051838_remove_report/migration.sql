/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `QuestionResponse` table. All the data in the column will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `overallScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interviewId` to the `QuestionResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_reportId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionResponse" DROP CONSTRAINT "QuestionResponse_reportId_fkey";

-- DropIndex
DROP INDEX "Interview_reportId_key";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "createdAt",
DROP COLUMN "reportId",
DROP COLUMN "score",
ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "QuestionResponse" DROP COLUMN "reportId",
ADD COLUMN     "interviewId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Report";

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
