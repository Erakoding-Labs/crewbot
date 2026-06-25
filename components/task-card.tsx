"use client";

import { CalendarClock, Pencil, Trash2 } from "lucide-react";

import { cn, formatDate, isOverdue } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/badges";
import { UserAvatar } from "@/components/user-avatar";
import {
  ProjectTask,
  TaskStatus,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  User,
} from "@/lib/types";

interface TaskCardProps {
  task: ProjectTask;
  assignee?: User;
  /** Founder-only controls (edit/delete). */
  canManage: boolean;
  onStatusChange: (status: TaskStatus) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** A draggable-feeling board card: priority, assignee, due date, and status control. */
export function TaskCard({
  task,
  assignee,
  canManage,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const overdue = task.dueDate && task.status !== "done" && isOverdue(task.dueDate);

  return (
    <Card className="bg-surface p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-foreground">{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <UserAvatar user={assignee} className="h-6 w-6 text-[11px]" />
        <span className="truncate">{assignee?.name ?? "Unassigned"}</span>
        {task.dueDate && (
          <span
            className={cn(
              "ml-auto inline-flex shrink-0 items-center gap-1",
              overdue && "text-red-400"
            )}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <label className="sr-only" htmlFor={`status-${task.id}`}>
          Task status
        </label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          className="h-8 flex-1 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TASK_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {TASK_STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {canManage && (
          <>
            <button
              type="button"
              aria-label="Edit task"
              onClick={onEdit}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Delete task"
              onClick={onDelete}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
