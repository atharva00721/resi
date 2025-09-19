-- CreateEnum
CREATE TYPE "public"."BrandKitStatus" AS ENUM ('DRAFT', 'PROCESSING', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."BrandKit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "logoUrl" TEXT,
    "logoPreviewUrl" TEXT,
    "extractedFeatures" TEXT[],
    "brandColors" TEXT[],
    "audience" TEXT,
    "productVibes" TEXT,
    "brandPersonality" TEXT,
    "status" "public"."BrandKitStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandKit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" TEXT NOT NULL,
    "brandKitId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "previewUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrandKit_userId_idx" ON "public"."BrandKit"("userId");

-- CreateIndex
CREATE INDEX "BrandKit_status_idx" ON "public"."BrandKit"("status");

-- CreateIndex
CREATE INDEX "BrandKit_createdAt_idx" ON "public"."BrandKit"("createdAt");

-- CreateIndex
CREATE INDEX "ProductImage_brandKitId_idx" ON "public"."ProductImage"("brandKitId");

-- CreateIndex
CREATE INDEX "ProductImage_order_idx" ON "public"."ProductImage"("order");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expires_idx" ON "public"."Session"("expires");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_emailVerified_idx" ON "public"."User"("emailVerified");

-- CreateIndex
CREATE INDEX "VerificationToken_expires_idx" ON "public"."VerificationToken"("expires");

-- AddForeignKey
ALTER TABLE "public"."BrandKit" ADD CONSTRAINT "BrandKit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_brandKitId_fkey" FOREIGN KEY ("brandKitId") REFERENCES "public"."BrandKit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
