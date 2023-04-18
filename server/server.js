import 'dotenv/config';
import express from 'express';
// import ClientError from './lib/client-error.js';
import errorMiddleware from './lib/error-middleware.js';
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

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

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

// app.get('/api/inventory/:inventoryId', async (req, res, next) => {
//   try {
//     const inventoryId = Number(req.params.inventoryId);
//     if (!inventoryId) {
//       throw new ClientError(400, 'productId must be a positive integer');
//     }
//     const sql = `
//       select *
//         from "inventory"
//         where "inventoryId" = $1
//     `;
//     const params = [inventoryId];
//     const result = await db.query(sql, params);
//     if (!result.rows[0]) {
//       throw new ClientError(404, `cannot find inventory item with inventoryId ${inventoryId}`);
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     next(err);
//   }
// });

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
