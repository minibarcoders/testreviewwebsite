/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('REVIEW', 'NEWS', 'GUIDE', 'BLOG');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prices" JSONB,
ADD COLUMN     "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" JSONB,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
