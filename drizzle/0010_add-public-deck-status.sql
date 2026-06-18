CREATE TYPE "public"."public_deck_status" AS ENUM('published', 'draft');--> statement-breakpoint
ALTER TABLE "public_decks" ADD COLUMN "status" "public_deck_status" DEFAULT 'draft' NOT NULL;