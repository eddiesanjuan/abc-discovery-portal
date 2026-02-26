"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import type { Session } from "@/lib/types";

interface SessionListProps {
  sessions: Session[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function SessionList({
  sessions,
  selectedId,
  onSelect,
  onDelete,
}: SessionListProps) {
  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Delete this session? This cannot be undone.")) return;
    const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete?.(id);
    }
  }

  if (sessions.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-warm-gray text-sm">No sessions yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onSelect(session.id)}
          className={`group relative w-full text-left cursor-pointer rounded-xl border p-4 transition-colors ${
            selectedId === session.id
              ? "border-gold bg-gold-light/30"
              : "border-stone/30 bg-cream hover:border-gold/50"
          }`}
        >
          {onDelete && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => handleDelete(e, session.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDelete(
                    e as unknown as React.MouseEvent,
                    session.id
                  );
                }
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-warm-gray hover:text-charcoal text-xs leading-none p-1 rounded"
              title="Delete session"
            >
              &#x2715;
            </span>
          )}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-charcoal text-sm truncate">
                {session.participant_name || "Anonymous"}
              </p>
              <p className="text-warm-gray text-xs mt-0.5">
                {session.participant_role || session.participant_company}
              </p>
            </div>
            <Badge status={session.status} />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-warm-gray">
            <span>
              {format(new Date(session.started_at), "MMM d, yyyy h:mm a")}
            </span>
            <span>&middot;</span>
            <span>
              {formatDuration(session.started_at, session.completed_at)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
