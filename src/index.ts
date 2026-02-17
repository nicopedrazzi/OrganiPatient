import express from "express";
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./db";

const app = express();
const port = Number(process.env.PORT ?? 8080);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/health/db", async (_req, res) => {
  const result = await db.execute(sql`select 1 as ok`);
  res.json({ ok: result[0]?.ok === 1 });
});

app.listen(port, () => console.log(`API on http://localhost:${port}`));
