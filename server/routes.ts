import type { Express } from "express";
import type { Server } from "http";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import { storage, toPublicUser } from "./storage";
import { hashPassword, requireAuth, requireRole, sessionMiddleware, verifyPassword } from "./auth";

async function ensureInitialAdmin() {
  const adminUser = process.env.INITIAL_ADMIN_USERNAME;
  const adminPass = process.env.INITIAL_ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    console.warn(
      "[security] WARNING: INITIAL_ADMIN_USERNAME / INITIAL_ADMIN_PASSWORD are not set. Admin creation is disabled until you configure them.",
    );
    return;
  }

  const existing = await storage.getUserByUsername(adminUser);
  if (existing) return;
  const hashed = await hashPassword(adminPass);
  await storage.createUser({ username: adminUser, password: hashed, role: "admin", status: "active" } as any);
  console.log("[security] Initial admin account created.");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.set("trust proxy", 1);
  app.use(helmet({
    contentSecurityPolicy: false, // keep dev experience smooth
  }));
  app.use(sessionMiddleware());

  await ensureInitialAdmin();

  const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // ---- Auth ----
  const registerSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(200),
    role: z.enum(["student", "teacher"]).default("student"),
  });

  const loginSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(1).max(200),
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const data = registerSchema.parse(req.body);
      const hashed = await hashPassword(data.password);
      const user = await storage.createUser({
        username: data.username,
        password: hashed,
        role: data.role,
        status: "pending",
      } as any);
      res.json({ user: toPublicUser(user), status: "pending" });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/auth/login", loginLimiter, async (req, res, next) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(data.username);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const ok = await verifyPassword(data.password, user.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });
      if ((user as any).status === "pending") {
        return res.status(403).json({ message: "Pending approval", status: "pending" });
      }
      req.session.userId = user.id;
      res.json({ user: toPublicUser(user) });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", requireAuth(), async (req, res) => {
    res.json({ user: (req as any).user });
  });

  // ---- Admin approvals ----
  app.get("/api/admin/registrations", requireRole("admin"), async (_req, res) => {
    const users = await storage.listUsers();
    const pending = users.filter((u) => (u as any).status === "pending" && (u as any).role !== "admin");
    res.json({ pending: pending.map(toPublicUser) });
  });

  app.post("/api/admin/registrations/:id/approve", requireRole("admin"), async (req, res, next) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "Not found" });
      const updated = await storage.updateUser({ ...(user as any), status: "active" });
      res.json({ user: toPublicUser(updated) });
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/admin/registrations/:id/reject", requireRole("admin"), async (req, res, next) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "Not found" });
      const updated = await storage.updateUser({ ...(user as any), status: "rejected" });
      res.json({ user: toPublicUser(updated) });
    } catch (e) {
      next(e);
    }
  });

  return httpServer;
}
