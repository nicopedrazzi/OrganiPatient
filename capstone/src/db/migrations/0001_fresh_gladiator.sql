ALTER TABLE "users" ADD COLUMN "surname" varchar(120) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;