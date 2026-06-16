CREATE TYPE "public"."banlist_format" AS ENUM('tcg', 'ocg', 'goat', 'master_duel', 'speed_duel', 'duel_links');--> statement-breakpoint
CREATE TABLE "banlist_entries" (
	"card_id" integer NOT NULL,
	"format" "banlist_format" NOT NULL,
	"status" text NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "banlist_entries_card_id_format_pk" PRIMARY KEY("card_id","format")
);
--> statement-breakpoint
CREATE TABLE "card_images" (
	"card_id" integer NOT NULL,
	"image_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"image_url_small" text NOT NULL,
	"image_url_cropped" text NOT NULL,
	CONSTRAINT "card_images_card_id_image_id_pk" PRIMARY KEY("card_id","image_id")
);
--> statement-breakpoint
CREATE TABLE "card_link_markers" (
	"card_id" integer NOT NULL,
	"marker" text NOT NULL,
	CONSTRAINT "card_link_markers_card_id_marker_pk" PRIMARY KEY("card_id","marker")
);
--> statement-breakpoint
CREATE TABLE "card_prices" (
	"card_id" integer PRIMARY KEY NOT NULL,
	"cardmarket_price" numeric(12, 2),
	"tcgplayer_price" numeric(12, 2),
	"ebay_price" numeric(12, 2),
	"amazon_price" numeric(12, 2),
	"coolstuffinc_price" numeric(12, 2)
);
--> statement-breakpoint
CREATE TABLE "card_sets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "card_sets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"card_id" integer NOT NULL,
	"set_name" text NOT NULL,
	"set_code" text NOT NULL,
	"set_rarity" text NOT NULL,
	"set_rarity_code" text,
	"set_price" numeric(12, 2)
);
--> statement-breakpoint
CREATE TABLE "card_typelines" (
	"card_id" integer NOT NULL,
	"position" integer NOT NULL,
	"line" text NOT NULL,
	CONSTRAINT "card_typelines_card_id_position_pk" PRIMARY KEY("card_id","position")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"human_readable_card_type" text,
	"frame_type" text NOT NULL,
	"desc" text NOT NULL,
	"race" text,
	"attribute" text,
	"atk" integer,
	"def" integer,
	"level" integer,
	"rank" integer,
	"linkval" integer,
	"scale" integer,
	"archetype" text,
	"ygoprodeck_url" text,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "banlist_entries" ADD CONSTRAINT "banlist_entries_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_images" ADD CONSTRAINT "card_images_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_link_markers" ADD CONSTRAINT "card_link_markers_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_prices" ADD CONSTRAINT "card_prices_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_sets" ADD CONSTRAINT "card_sets_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_typelines" ADD CONSTRAINT "card_typelines_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "banlist_entries_format_idx" ON "banlist_entries" USING btree ("format");--> statement-breakpoint
CREATE INDEX "card_images_card_id_idx" ON "card_images" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "card_link_markers_card_id_idx" ON "card_link_markers" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "card_sets_card_id_idx" ON "card_sets" USING btree ("card_id");--> statement-breakpoint
CREATE UNIQUE INDEX "card_sets_card_set_code_rarity_idx" ON "card_sets" USING btree ("card_id","set_code","set_rarity");--> statement-breakpoint
CREATE INDEX "card_typelines_card_id_idx" ON "card_typelines" USING btree ("card_id");