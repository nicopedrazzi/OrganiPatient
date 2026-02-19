CREATE TABLE "reports_data" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone,
	"parsed_text" text NOT NULL,
	"pages_num" integer NOT NULL,
	"is_anonymized" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reports_data" ADD CONSTRAINT "reports_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;