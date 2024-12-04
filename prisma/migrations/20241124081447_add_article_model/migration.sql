/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Article` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `MediaItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArticleToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MediaItem" DROP CONSTRAINT "MediaItem_articleId_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToTag" DROP CONSTRAINT "_ArticleToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToTag" DROP CONSTRAINT "_ArticleToTag_B_fkey";

-- DropIndex
DROP INDEX "Article_slug_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "coverImage",
DROP COLUMN "excerpt",
DROP COLUMN "published",
DROP COLUMN "slug",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "MediaItem";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_ArticleToTag";

-- DropEnum
DROP TYPE "MediaType";

-- DropEnum
DROP TYPE "Role";
