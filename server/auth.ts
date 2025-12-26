import session from "express-session";
import type { Request, Response, NextFunction } from "express";
import MemoryStoreFactory from "memorystore";
import bcrypt from "bcrypt";
import { storage, toPublicUser, type PublicUser } from "./storage";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export function sessionMiddleware() {
  const MemoryStore = MemoryStoreFactory(session);
  const secret = process.env.SESSION_SECRET || "";
  if (!secret || secret.length < 16) {
    // Still allow dev to run, but warn loudly.
    console.warn(
      "[security] WARNING: SESSION_SECRET is not set or too short. Set a long random SESSION_SECRET in .env",
    );
  }
  return session({
    secret: secret || "dev-insecure-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 12, // 12h
    },
    store: new MemoryStore({ checkPeriod: 1000 * 60 * 10 }),
  });
}

export async function hashPassword(plain: string) {
  const saltRounds = 12;
  return bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function getSessionUser(req: Request): Promise<PublicUser | null> {
  const id = req.session.userId;
  if (!id) return null;
  const u = await storage.getUserById(id);
  return u ? toPublicUser(u) : null;
}

export function requireAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    (req as any).user = user;
    next();
  };
}

export function requireRole(role: "admin") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    if ((user as any).role !== role) return res.status(403).json({ message: "Forbidden" });
    (req as any).user = user;
    next();
  };
}
