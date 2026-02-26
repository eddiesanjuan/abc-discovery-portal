import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import type { Session, Message } from "./types";

const DATA_DIR = join(process.cwd(), "data");
const DB_PATH = join(DATA_DIR, "interviews.db");

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    participant_name TEXT,
    participant_role TEXT,
    participant_company TEXT DEFAULT 'ABC',
    status TEXT DEFAULT 'in_progress',
    started_at TEXT NOT NULL,
    completed_at TEXT,
    summary TEXT,
    key_pain_points TEXT,
    ai_interests TEXT,
    questions_for_eddie TEXT,
    vision_notes TEXT,
    metadata TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    phase INTEGER,
    created_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );

  CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);
`);

export function createSession(id: string): Session {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO sessions (id, participant_company, status, started_at)
    VALUES (?, 'ABC', 'in_progress', ?)
  `);
  stmt.run(id, now);
  return getSession(id)!;
}

export function getSession(id: string): Session | null {
  const stmt = db.prepare("SELECT * FROM sessions WHERE id = ?");
  return (stmt.get(id) as Session) || null;
}

export function listSessions(): Session[] {
  const stmt = db.prepare(
    "SELECT * FROM sessions ORDER BY started_at DESC"
  );
  return stmt.all() as Session[];
}

export function updateSession(
  id: string,
  fields: Partial<Session>
): void {
  const allowed = [
    "participant_name",
    "participant_role",
    "participant_company",
    "status",
    "completed_at",
    "summary",
    "key_pain_points",
    "ai_interests",
    "questions_for_eddie",
    "vision_notes",
    "metadata",
  ];
  const entries = Object.entries(fields).filter(([k]) =>
    allowed.includes(k)
  );
  if (entries.length === 0) return;

  const sets = entries.map(([k]) => `${k} = ?`).join(", ");
  const values = entries.map(([, v]) => v);
  const stmt = db.prepare(`UPDATE sessions SET ${sets} WHERE id = ?`);
  stmt.run(...values, id);
}

export function addMessage(
  sessionId: string,
  role: string,
  content: string,
  phase?: number
): void {
  const id = uuidv4();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO messages (id, session_id, role, content, phase, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, sessionId, role, content, phase ?? null, now);
}

export function getMessages(sessionId: string): Message[] {
  const stmt = db.prepare(
    "SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC"
  );
  return stmt.all(sessionId) as Message[];
}

export default db;
