/*
  Warnings:

  - You are about to drop the `_BlogCategoryToBlogPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogPostToBlogTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `traffic_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('DIYET', 'SAGLIK', 'SUPPLEMENTLER', 'BESLENME', 'PARIS_TRANSFER', 'PARIS_TURLARI', 'PARIS_REHBERI');

-- DropForeignKey
ALTER TABLE "_BlogCategoryToBlogPost" DROP CONSTRAINT "_BlogCategoryToBlogPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogCategoryToBlogPost" DROP CONSTRAINT "_BlogCategoryToBlogPost_B_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToBlogTag" DROP CONSTRAINT "_BlogPostToBlogTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToBlogTag" DROP CONSTRAINT "_BlogPostToBlogTag_B_fkey";

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_authorId_fkey";

-- DropTable
DROP TABLE "_BlogCategoryToBlogPost";

-- DropTable
DROP TABLE "_BlogPostToBlogTag";

-- DropTable
DROP TABLE "blog_categories";

-- DropTable
DROP TABLE "blog_posts";

-- DropTable
DROP TABLE "blog_tags";

-- DropTable
DROP TABLE "traffic_logs";

-- DropEnum
DROP TYPE "BlogStatus";

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "category" "BlogCategory" NOT NULL,
    "imageId" TEXT,
    "author" TEXT,
    "authorId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "bucket" TEXT NOT NULL DEFAULT 'blog',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ip_logs" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "referer" TEXT,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "gclid" TEXT,
    "fbclid" TEXT,
    "trafficSource" TEXT,
    "trafficMedium" TEXT,
    "detectionMethod" TEXT,
    "isSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "botScore" INTEGER,
    "clickRate" INTEGER,
    "country" TEXT,
    "countryCode" TEXT,
    "city" TEXT,
    "region" TEXT,
    "timezone" TEXT,
    "isp" TEXT,
    "deviceType" TEXT,
    "deviceBrand" TEXT,
    "deviceModel" TEXT,
    "browserName" TEXT,
    "browserVersion" TEXT,
    "osName" TEXT,
    "osVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ip_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_slug_idx" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_category_idx" ON "blogs"("category");

-- CreateIndex
CREATE INDEX "blogs_isPublished_idx" ON "blogs"("isPublished");

-- CreateIndex
CREATE INDEX "blogs_isActive_idx" ON "blogs"("isActive");

-- CreateIndex
CREATE INDEX "blogs_publishedAt_idx" ON "blogs"("publishedAt");

-- CreateIndex
CREATE INDEX "ip_logs_ipAddress_idx" ON "ip_logs"("ipAddress");

-- CreateIndex
CREATE INDEX "ip_logs_createdAt_idx" ON "ip_logs"("createdAt");

-- CreateIndex
CREATE INDEX "ip_logs_path_idx" ON "ip_logs"("path");

-- CreateIndex
CREATE INDEX "ip_logs_userId_idx" ON "ip_logs"("userId");

-- CreateIndex
CREATE INDEX "ip_logs_country_idx" ON "ip_logs"("country");

-- CreateIndex
CREATE INDEX "ip_logs_city_idx" ON "ip_logs"("city");

-- CreateIndex
CREATE INDEX "ip_logs_deviceType_idx" ON "ip_logs"("deviceType");

-- CreateIndex
CREATE INDEX "ip_logs_trafficSource_idx" ON "ip_logs"("trafficSource");

-- CreateIndex
CREATE INDEX "ip_logs_isSuspicious_idx" ON "ip_logs"("isSuspicious");

-- CreateIndex
CREATE INDEX "ip_logs_utmSource_idx" ON "ip_logs"("utmSource");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
