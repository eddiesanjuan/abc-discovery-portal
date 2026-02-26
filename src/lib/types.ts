export interface Session {
  id: string;
  participant_name: string | null;
  participant_role: string | null;
  participant_company: string;
  status: "in_progress" | "completed" | "abandoned";
  started_at: string;
  completed_at: string | null;
  summary: string | null;
  key_pain_points: string | null;
  ai_interests: string | null;
  questions_for_eddie: string | null;
  vision_notes: string | null;
  metadata: string | null;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  phase: number | null;
  created_at: string;
}

export interface InsightExtraction {
  summary: string;
  participant_name: string | null;
  participant_role: string | null;
  key_pain_points: string[];
  ai_interests: string[];
  questions_for_eddie: string[];
  vision_notes: string | null;
}

export interface AdminExportResponse {
  exported_at: string;
  total_sessions: number;
  sessions: (Session & {
    messages: Message[];
    duration_minutes: number | null;
  })[];
}
