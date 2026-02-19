DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE "user_role" AS ENUM ('admin', 'doctor', 'nurse');
  END IF;
END
$$;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "user_role";
UPDATE "users" SET "role" = 'doctor' WHERE "role" IS NULL;
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "org_id" varchar(255);
UPDATE "users" SET "org_id" = 'unknown' WHERE "org_id" IS NULL;
ALTER TABLE "users" ALTER COLUMN "org_id" SET NOT NULL;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;

ALTER TABLE "users" DROP COLUMN IF EXISTS "name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "surname";
