import { cn } from "@/lib/utils";

interface BadgeProps {
  status: "in_progress" | "completed" | "abandoned";
}

const statusStyles = {
  in_progress: "bg-gold-light text-gold-hover",
  completed: "bg-sage/15 text-sage",
  abandoned: "bg-stone/30 text-warm-gray",
};

const statusLabels = {
  in_progress: "In Progress",
  completed: "Completed",
  abandoned: "Abandoned",
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
