-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN "email" TEXT;
ALTER TABLE "admin_users" ADD COLUMN "is_super" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex  
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- Update existing admin to be super admin
UPDATE "admin_users" SET "is_super" = true WHERE "username" = 'admin';
