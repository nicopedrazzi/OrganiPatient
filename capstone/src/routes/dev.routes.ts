import { Router } from "express";

const devRouter = Router();

devRouter.get("/login", (_req, res) => {
  res.type("html").send(`
    <h1>Dev Login</h1>
    <form method="POST" action="/auth/login">
      <input name="email" placeholder="email" />
      <input name="password" type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
    <p><a href="/reports/test">Test protected route</a></p>
  `);
});

export default devRouter