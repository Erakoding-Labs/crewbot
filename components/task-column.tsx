import { Card } from "@/components/ui/card";
import type { Task, TeamMember } from "@/lib/types";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  members: TeamMember[];
}

/** A single column of the task board (Todo / In Progress / Done). */
export function TaskColumn({ title, tasks, members }: TaskColumnProps) {
  const nameFor = (id?: string) =>
    members.find((m) => m.id === id)?.name ?? "Unassigned";

  return (
    <div className="rounded-xl border border-border bg-surface/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-secondary px-1.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground/60">
            No tasks
          </p>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="bg-surface p-3">
              <p className="text-sm font-medium text-foreground">{task.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {nameFor(task.assigneeId)}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
