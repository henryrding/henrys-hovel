import 'dotenv/config';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import ClientError from './lib/client-error.js';
import errorMiddleware from './lib/error-middleware.js';
import authorizationMiddleware from './lib/authorization-middleware.js';
import pg from 'pg';

// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/inventory', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "inventory"
        order by "inventoryId"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/inventory/:cardId', async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const myRegex = /^[a-z0-9-]+$/;
    if (!myRegex.test(cardId.toString())) {
      throw new ClientError(400, 'cardId must be a valid Id');
    }
    const sql = `
      select *
        from "inventory"
        where "cardId" = $1
    `;
    const params = [cardId];
    const result = await db.query(sql, params);
    if (!result.rows[0]) {
      throw new ClientError(404, `cannot find inventory item with cardId ${cardId}`);
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password, firstName, lastName, email, isAdmin = false } = req.body;
    if (!username || !password || !firstName || !lastName || !email) {
      throw new ClientError(400, 'username, password, firstName, lastName, and email are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword", "firstName", "lastName", "email", "isAdmin")
        values ($1, $2, $3, $4, $5, $6)
        returning "userId", "username", "firstName", "lastName", "email", "createdAt"
    `;
    const params = [username, hashedPassword, firstName, lastName, email, isAdmin];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    const sql2 = `
      insert into "carts" ("userId")
        values ($1)
        returning *
    `;
    const params2 = [user.userId];
    const result2 = await db.query(sql2, params2);
    const [cart] = result2.rows;
    res.status(201).json({ user, cart });
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'username and password are required fields');
    }
    const sql = `
      select "userId",
            "hashedPassword",
            "firstName",
            "lastName",
            "email",
            "isAdmin"
        from "users"
        where "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword, firstName, lastName, email, isAdmin } = user;
    const isMatching = await argon2.verify(hashedPassword, password);
    if (!isMatching) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username, firstName, lastName, email, isAdmin };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.post('/create-checkout-session/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sql = `
    select "inventory"."price",
       "inventory"."name",
       "cartInventory"."quantity"
    from "inventory"
    join "cartInventory" using ("inventoryId")
    join "carts" using ("cartId")
    join "users" using ("userId")
    where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const cartItems = result.rows;
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'usd' },
            display_name: 'Next day air',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 1 },
            },
          },
        },
      ],
      line_items: cartItems.map(item => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name
            },
            unit_amount: item.price
          },
          quantity: item.quantity
        };
      }),
      client_reference_id: userId,
      mode: 'payment',
      success_url: 'http://localhost:3000/orders',
      cancel_url: 'http://localhost:3000',
    });

    res.redirect(303, session.url);
  } catch (err) {
    next(err);
  }
});

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res, next) => {
  const payload = req.body;
  if (payload.type === 'checkout.session.completed') {
    const totalPrice = payload.data.object.amount_total;
    const shippingAddress = `${payload.data.object.shipping_details.address.line1} ${payload.data.object.shipping_details.address.line2 !== null ? payload.data.object.shipping_details.address.line2 + ' ' : ''}${payload.data.object.shipping_details.address.city}, ${payload.data.object.shipping_details.address.state} ${payload.data.object.shipping_details.address.postal_code} ${payload.data.object.shipping_details.address.country}`;
    const shippingName = payload.data.object.shipping_details.name;
    const shippingCost = payload.data.object.shipping_cost.amount_subtotal;
    const userId = Number(payload.data.object.client_reference_id);
    const orderNumber = payload.data.object.id;
    try {
      const sql = `
        insert into "orders" ("orderNumber", "userId", "totalPrice", "shippingName", "shippingAddress", "shippingCost", "shipped")
        values ($1, $2, $3, $4, $5, $6, $7)
        returning *
      `;
      const params = [orderNumber, userId, totalPrice, shippingName, shippingAddress, shippingCost, false];
      const result = await db.query(sql, params);
      const [order] = result.rows;
      const orderId = order.orderId;
      const sql2 = `
      insert into "orderItems" ("inventoryId", "orderId", "name", "collectorNumber", "setName", "setCode", "rarity", "foil", "price", "quantity", "cardId", "image", "manaCost", "typeLine", "oracleText", "power", "toughness", "flavorText", "artist", "visible" )
      select "ci"."inventoryId",
        "orders"."orderId",
        "i"."name",
        "i"."collectorNumber",
        "i"."setName",
        "i"."setCode",
        "i"."rarity",
        "i"."foil",
        "i"."price",
        "ci"."quantity",
        "i"."cardId",
        "i"."image",
        "i"."manaCost",
        "i"."typeLine",
        "i"."oracleText",
        "i"."power",
        "i"."toughness",
        "i"."flavorText",
        "i"."artist",
        "i"."visible"
        from "inventory" as "i"
        join "cartInventory" as "ci" using ("inventoryId")
        join "carts" using ("cartId")
        join "users" using ("userId")
        join "orders" using ("userId")
        where "userId" = $1 and "orderId" = $2
      `;
      const params2 = [userId, orderId];
      const result2 = await db.query(sql2, params2);
      const orderItems = result2.rows;
      const sql3 = `
      update "inventory"
        set "quantity" = "inventory"."quantity" - "cartInventory"."quantity",
            "visible" = CASE WHEN "inventory"."quantity" - "cartInventory"."quantity" <= 0 THEN false ELSE "inventory"."visible" END
        from "cartInventory"
        where "cartInventory"."inventoryId" = "inventory"."inventoryId"
          and "cartInventory"."cartId" IN (
            select "cartId"
            from "carts"
            where "userId" = $1
          );
      `;
      const params3 = [userId];
      const result3 = await db.query(sql3, params3);
      const updatedInventory = result3.rows;
      const sql4 = `
      delete from "cartInventory"
      where "cartId" in (
        select "cartId"
        from "carts"
        where "userId" = $1
      )
      returning *
    `;
      const params4 = [userId];
      const result4 = await db.query(sql4, params4);
      const deletedItems = result4.rows;
      res.status(200).json({ order, orderItems, updatedInventory, deletedItems });
    } catch (err) {
      next(err);
    }
  }
});

app.use(authorizationMiddleware);

app.get('/api/cartInventory', async (req, res, next) => {
  try {
    const { userId } = req.user;
    const sql = `
      select "cartInventory".*
        from "cartInventory"
        join "carts" using ("cartId")
        where "userId" = $1;
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const cartInventory = result.rows;
    res.json(cartInventory);
  } catch (err) {
    next(err);
  }
});

app.post('/api/cartInventory', async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { inventoryId, quantity } = req.body;
    if (!inventoryId || !quantity) {
      throw new ClientError(400, 'inventoryId and quantity are required fields');
    }
    const sql = `
      insert into "cartInventory" ("inventoryId", "cartId", "quantity")
      values ($1, (
        select "cartId"
        from "carts"
        where "userId" = $2
      ), $3)
      returning *
    `;
    const params = [inventoryId, userId, quantity];
    const result = await db.query(sql, params);
    const [addedToCart] = result.rows;
    res.status(201).json(addedToCart);
  } catch (err) {
    next(err);
  }
});

app.patch('/api/cartInventory/:inventoryId', async (req, res, next) => {
  try {
    const { userId } = req.user;
    const inventoryId = Number(req.params.inventoryId);
    if (!Number.isInteger(inventoryId) || inventoryId < 1) {
      throw new ClientError(400, 'inventoryId must be a positive integer');
    }
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      throw new ClientError(400, 'quantity (number) is required');
    }
    const sql = `
      update "cartInventory"
        set "quantity" = $1
        where "cartId" in (
          select "cartId"
            from "carts"
            where "userId" = $2
        ) and "inventoryId" = $3
        returning *
    `;
    const params = [quantity, userId, inventoryId];
    const result = await db.query(sql, params);
    const [updatedCartInventory] = result.rows;
    if (!updatedCartInventory) {
      throw new ClientError(404, `cannot find card with inventoryId ${inventoryId} in cart`);
    }
    res.json(updatedCartInventory);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/cartInventory/:inventoryId', async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { inventoryId } = req.params;

    const sql = `
      delete from "cartInventory"
      where "cartId" in (
        select "cartId"
          from "carts"
          where "userId" = $1
      ) and "inventoryId" = $2
      returning *
    `;
    const params = [userId, inventoryId];
    const result = await db.query(sql, params);
    const [deletedItem] = result.rows;
    if (!deletedItem) {
      throw new ClientError(404, `Item with inventoryId ${inventoryId} not found in user's cart`);
    }
    res.json(deletedItem);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/cartInventory', async (req, res, next) => {
  try {
    const { userId } = req.user;

    const sql = `
      delete from "cartInventory"
      where "cartId" in (
        select "cartId"
        from "carts"
        where "userId" = $1
      )
      returning *
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const deletedItems = result.rows;

    res.json(deletedItems);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
