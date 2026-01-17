-- Add category field to reports
ALTER TABLE "reports" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Sonstiges';

-- Create system_settings table
CREATE TABLE IF NOT EXISTS "system_settings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- Insert default settings
INSERT OR IGNORE INTO "system_settings" ("key", "value") VALUES ('COMPANY_NAME', 'Interne Meldestelle');
INSERT OR IGNORE INTO "system_settings" ("key", "value") VALUES ('WELCOME_TEXT', 'Melden Sie Missstände sicher und vertraulich. Ihre Identität wird geschützt.');
