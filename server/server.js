import 'dotenv/config';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
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

app.use(authorizationMiddleware);

app.get('/api/cartInventory', async (req, res, next) => {
  try {
    const { userId } = req.user;
    const sql = `
      select "cartId"
        from "carts"
        where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const [cart] = result.rows;
    const sql2 = `
      select *
        from "cartInventory"
        where "cartId" = $1
    `;
    const params2 = [cart.cartId];
    const result2 = await db.query(sql2, params2);
    const cartInventory = result2.rows;
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
      select "cartId"
        from "carts"
        where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const [cart] = result.rows;
    const sql2 = `
      insert into "cartInventory" ("inventoryId", "cartId", "quantity")
        values ($1, $2, $3)
        returning *
    `;
    const params2 = [inventoryId, cart.cartId, quantity];
    const result2 = await db.query(sql2, params2);
    const [addedToCart] = result2.rows;
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
      select "cartId"
        from "carts"
        where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const [cart] = result.rows;
    const sql2 = `
      update "cartInventory"
        set "quantity" = $1
        where "inventoryId" = $2 and "cartId" = $3
        returning *
    `;
    const params2 = [quantity, inventoryId, cart.cartId];
    const result2 = await db.query(sql2, params2);
    const [updatedCartInventory] = result2.rows;
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
      select "cartId"
        from "carts"
        where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const [cart] = result.rows;

    const sql2 = `
      delete from "cartInventory"
      where "cartId" = $1 and "inventoryId" = $2
      returning *
    `;
    const params2 = [cart.cartId, inventoryId];
    const result2 = await db.query(sql2, params2);
    const [deletedItem] = result2.rows;

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
      select "cartId"
        from "carts"
        where "userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const [cart] = result.rows;

    const sql2 = `
      delete from "cartInventory"
      where "cartId" = $1
      returning *
    `;
    const params2 = [cart.cartId];
    const result2 = await db.query(sql2, params2);
    const deletedItems = result2.rows;

    res.json(deletedItems);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
