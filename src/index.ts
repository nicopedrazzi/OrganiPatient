import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => console.log(`API on http://localhost:${port}`));