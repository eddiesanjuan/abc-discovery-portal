import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { v4 as uuidv4 } from "uuid";
import type { Session, Message } from "./types";

const isProduction =
  !!process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === "production";

const DB_PATH = isProduction
  ? "/data/interviews.db"
  : join(process.cwd(), "data", "interviews.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");

    _db.exec(`
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
  }
  return _db;
}

export function createSession(id: string): Session {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO sessions (id, participant_company, status, started_at)
    VALUES (?, 'ABC', 'in_progress', ?)
  `);
  stmt.run(id, now);
  return getSession(id)!;
}

export function getSession(id: string): Session | null {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM sessions WHERE id = ?");
  return (stmt.get(id) as Session) || null;
}

export function listSessions(): Session[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM sessions ORDER BY started_at DESC"
  );
  return stmt.all() as Session[];
}

export function updateSession(
  id: string,
  fields: Partial<Session>
): void {
  const db = getDb();
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
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO messages (id, session_id, role, content, phase, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, sessionId, role, content, phase ?? null, now);
}

export function getMessages(sessionId: string): Message[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC"
  );
  return stmt.all(sessionId) as Message[];
}

export function deleteSession(id: string): void {
  const db = getDb();
  const deleteMessages = db.prepare(
    "DELETE FROM messages WHERE session_id = ?"
  );
  const deleteSessionRow = db.prepare("DELETE FROM sessions WHERE id = ?");

  const tx = db.transaction(() => {
    deleteMessages.run(id);
    deleteSessionRow.run(id);
  });
  tx();
}

export { getDb };
