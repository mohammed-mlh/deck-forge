DROP TABLE "card_link_markers" CASCADE;--> statement-breakpoint
DROP TABLE "card_typelines" CASCADE;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "typeline" text[];--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "link_markers" text[];