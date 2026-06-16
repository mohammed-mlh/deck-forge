ALTER TABLE "archetypes" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "archetypes_slug_idx" ON "archetypes" USING btree ("slug");