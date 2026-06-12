CREATE TYPE "public"."deck_visibility" AS ENUM('private', 'unlisted', 'public');--> statement-breakpoint
CREATE TABLE "deck_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" uuid NOT NULL,
	"analysis" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"main" jsonb NOT NULL,
	"extra" jsonb NOT NULL,
	"side" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"visibility" "deck_visibility" DEFAULT 'private' NOT NULL,
	"main" jsonb NOT NULL,
	"extra" jsonb NOT NULL,
	"side" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deck_analyses" ADD CONSTRAINT "deck_analyses_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_versions" ADD CONSTRAINT "deck_versions_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "deck_versions_deck_version_idx" ON "deck_versions" USING btree ("deck_id","version_number");--> statement-breakpoint
CREATE UNIQUE INDEX "decks_user_slug_idx" ON "decks" USING btree ("user_id","slug");