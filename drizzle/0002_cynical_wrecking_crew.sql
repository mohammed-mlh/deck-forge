CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"event" text NOT NULL,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "decks" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "decks" ALTER COLUMN "visibility" SET DEFAULT 'private'::text;--> statement-breakpoint
DROP TYPE "public"."deck_visibility";--> statement-breakpoint
CREATE TYPE "public"."deck_visibility" AS ENUM('private', 'public');--> statement-breakpoint
ALTER TABLE "decks" ALTER COLUMN "visibility" SET DEFAULT 'private'::"public"."deck_visibility";--> statement-breakpoint
ALTER TABLE "decks" ALTER COLUMN "visibility" SET DATA TYPE "public"."deck_visibility" USING "visibility"::"public"."deck_visibility";