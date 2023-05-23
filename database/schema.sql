set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."inventory" (
	"inventoryId" serial NOT NULL,
	"name" TEXT NOT NULL,
  "collectorNumber" TEXT NOT NULL,
	"setName" TEXT NOT NULL,
  "setCode" TEXT NOT NULL,
	"rarity" TEXT NOT NULL,
	"finish" TEXT NOT NULL,
	"price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"cardId" TEXT NOT NULL,
	"image" TEXT NOT NULL,
	"manaCost" TEXT NOT NULL,
	"typeLine" TEXT NOT NULL,
	"oracleText" TEXT NOT NULL,
	"power" TEXT DEFAULT '',
	"toughness" TEXT DEFAULT '',
	"flavorText" TEXT NOT NULL,
	"artist" TEXT NOT NULL,
	"visible" BOOLEAN NOT NULL DEFAULT TRUE,
	"createdAt" timestamptz(6) NOT NULL DEFAULT now(),
	CONSTRAINT "inventory_pk" PRIMARY KEY ("inventoryId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"isAdmin" BOOLEAN NOT NULL,
	"createdAt" timestamptz(6) NOT NULL DEFAULT now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."carts" (
	"cartId" serial NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamptz(6) NOT NULL DEFAULT now(),
	CONSTRAINT "carts_pk" PRIMARY KEY ("cartId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."cartInventory" (
  "cartInventoryId" serial NOT NULL,
	"inventoryId" integer NOT NULL,
	"cartId" integer NOT NULL,
  "quantity" integer NOT NULL,
  "createdAt" timestamptz(6) NOT NULL DEFAULT now(),
	CONSTRAINT "cartInventory_pk" PRIMARY KEY ("cartInventoryId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."orders" (
	"orderId" serial NOT NULL,
	"orderNumber" TEXT NOT NULL UNIQUE,
	"userId" integer NOT NULL,
	"totalPrice" integer NOT NULL,
  "shippingName" TEXT NOT NULL,
	"shippingAddress1" TEXT NOT NULL,
  "shippingAddress2" TEXT NOT NULL,
  "shippingCity" TEXT NOT NULL,
  "shippingState" TEXT NOT NULL,
  "shippingCountry" TEXT NOT NULL,
  "shippingPostalCode" TEXT NOT NULL,
  "shippingCost" integer NOT NULL,
	"shipped" BOOLEAN NOT NULL,
	"createdAt" timestamptz(6) NOT NULL DEFAULT now(),
	CONSTRAINT "orders_pk" PRIMARY KEY ("orderId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."orderItems" (
	"orderId" integer NOT NULL,
  "inventoryId" serial NOT NULL,
	"name" TEXT NOT NULL,
  "collectorNumber" TEXT NOT NULL,
	"setName" TEXT NOT NULL,
  "setCode" TEXT NOT NULL,
	"rarity" TEXT NOT NULL,
	"finish" TEXT NOT NULL,
	"price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"cardId" TEXT NOT NULL,
	"image" TEXT NOT NULL,
  "manaCost" TEXT NOT NULL,
	"typeLine" TEXT NOT NULL,
	"oracleText" TEXT NOT NULL,
	"power" TEXT DEFAULT '',
	"toughness" TEXT DEFAULT '',
	"flavorText" TEXT DEFAULT '',
	"artist" TEXT NOT NULL,
	"visible" BOOLEAN NOT NULL DEFAULT TRUE,
	"createdAt" timestamptz(6) NOT NULL DEFAULT now(),
	CONSTRAINT "orderItems_pk" PRIMARY KEY ("orderId", "inventoryId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "inventory" ADD CONSTRAINT "inventory_card_finish_unique" UNIQUE ("cardId", "finish");

ALTER TABLE "carts" ADD CONSTRAINT "carts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "cartInventory" ADD CONSTRAINT "cartInventory_fk0" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("inventoryId");
ALTER TABLE "cartInventory" ADD CONSTRAINT "cartInventory_fk1" FOREIGN KEY ("cartId") REFERENCES "carts"("cartId");

ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_fk0" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId");
