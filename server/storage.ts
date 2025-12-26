import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { InsertUser, User } from "@shared/schema";

export type PublicUser = Omit<User, "password">;

type StoredUser = User;

const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const USERS_PATH = path.resolve(DATA_DIR, "users.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(USERS_PATH)) return [];
    const raw = fs.readFileSync(USERS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), "utf8");
}

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(user: User): Promise<User>;
}

export class FileStorage implements IStorage {
  private users: User[];

  constructor() {
    this.users = readUsers();
  }

  private persist() {
    writeUsers(this.users);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async listUsers(): Promise<User[]> {
    return [...this.users];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (await this.getUserByUsername(insertUser.username)) {
      throw Object.assign(new Error("Username already exists"), { status: 409 });
    }
    const user: User = {
      id: randomUUID(),
      username: insertUser.username,
      password: insertUser.password,
      role: (insertUser as any).role ?? "student",
      status: (insertUser as any).status ?? "pending",
    } as any;
    this.users.push(user);
    this.persist();
    return user;
  }

  async updateUser(user: User): Promise<User> {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx === -1) throw Object.assign(new Error("User not found"), { status: 404 });
    this.users[idx] = user;
    this.persist();
    return user;
  }
}

export const storage = new FileStorage();

export function toPublicUser(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user as any;
  return rest;
}
