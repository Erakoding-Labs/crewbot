"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Users,
  CheckSquare,
  Clock,
  Percent,
  Compass,
  Building2,
  ListChecks,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { TaskCard } from "@/components/task-card";
import { TaskDialog, type TaskFormValues } from "@/components/task-dialog";
import { TeamMemberCard } from "@/components/team-member-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store/store";
import {
  ProjectTask,
  TaskStatus,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from "@/lib/types";

export default function TeamPage() {
  const router = useRouter();
  const {
    currentUser,
    getStartup,
    getStartupMembers,
    getTasks,
    createTask,
    updateTask,
    setTaskStatus,
    deleteTask,
    setMemberRole,
    getOrCreateConversation,
  } = useStore();

  const startup = getStartup(currentUser?.startupId);
  const isFounder = !!startup && startup.ownerId === currentUser?.id;

  const [taskOpen, setTaskOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProjectTask | null>(null);
  const [roleEdit, setRoleEdit] = React.useState<{ userId: string; name: string } | null>(
    null
  );

  if (!currentUser) return null;

  // Not on a team yet — guide the user to join or start one.
  if (!startup) {
    return (
      <>
        <PageHeader title="Team" subtitle="Roles, tasks, and progress" />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <ListChecks className="mb-3 h-9 w-9 text-muted-foreground" />
          <p className="font-medium text-foreground">You&apos;re not on a team yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Join a startup from Discover, or create your own to start assigning tasks and
            tracking progress.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline">
              <Link href="/discover">
                <Compass className="h-4 w-4" /> Browse startups
              </Link>
            </Button>
            <Button asChild>
              <Link href="/startup">
                <Building2 className="h-4 w-4" /> Create a startup
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const members = getStartupMembers(startup.id);
  const tasks = getTasks(startup.id);
  const roleFor = (userId: string) => startup.memberRoles?.[userId] ?? "";

  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const counts = (userId: string) => {
    const mine = tasks.filter((t) => t.assigneeId === userId);
    return {
      done: mine.filter((t) => t.status === "done").length,
      pending: mine.filter((t) => t.status !== "done").length,
    };
  };

  const submitTask = (values: TaskFormValues) => {
    if (editing) {
      updateTask(editing.id, {
        title: values.title,
        description: values.description,
        assigneeId: values.assigneeId,
        priority: values.priority,
        dueDate: values.dueDate,
      });
    } else {
      createTask({
        startupId: startup.id,
        title: values.title,
        description: values.description,
        assigneeId: values.assigneeId || undefined,
        priority: values.priority,
        dueDate: values.dueDate,
      });
    }
    setEditing(null);
  };

  const openNewTask = () => {
    setEditing(null);
    setTaskOpen(true);
  };
  const openEditTask = (task: ProjectTask) => {
    setEditing(task);
    setTaskOpen(true);
  };

  const message = (userId: string) => {
    const conv = getOrCreateConversation(userId);
    router.push(`/messages?c=${conv.id}`);
  };

  return (
    <>
      <PageHeader
        title="Team"
        subtitle={`Roles, tasks, and progress at ${startup.name}`}
        actions={
          isFounder ? (
            <Button onClick={openNewTask}>
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          ) : undefined
        }
      />

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Users} label="Members" value={members.length} />
        <StatTile icon={Percent} label="Completion" value={`${completion}%`} />
        <StatTile icon={CheckSquare} label="Done" value={done} />
        <StatTile icon={Clock} label="In progress" value={inProgress} />
      </div>

      {/* Overall progress */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Overall progress</h2>
          <span className="font-semibold text-primary">{completion}%</span>
        </div>
        <Progress value={completion} className="mt-4" />
        <p className="mt-3 text-sm text-muted-foreground">
          {done} done &nbsp;&nbsp; {inProgress} in progress &nbsp;&nbsp;{" "}
          {tasks.length - done - inProgress} todo &nbsp;·&nbsp; {tasks.length} total
        </p>
      </Card>

      <Tabs defaultValue="board" className="mt-8">
        <TabsList>
          <TabsTrigger value="board">
            <ListChecks className="mr-1.5 h-4 w-4" /> Task Board
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-1.5 h-4 w-4" /> Members &amp; Roles
          </TabsTrigger>
        </TabsList>

        {/* Board */}
        <TabsContent value="board">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TASK_STATUS_ORDER.map((status) => {
              const colTasks = tasks.filter((t) => t.status === status);
              return (
                <div
                  key={status}
                  className="rounded-xl border border-border bg-surface/50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {TASK_STATUS_LABELS[status]}
                    </h3>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-secondary px-1.5 text-xs text-muted-foreground">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {colTasks.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground/60">
                        No tasks
                      </p>
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          assignee={members.find((m) => m.id === task.assigneeId)}
                          canManage={isFounder}
                          onStatusChange={(s: TaskStatus) => setTaskStatus(task.id, s)}
                          onEdit={() => openEditTask(task)}
                          onDelete={() => deleteTask(task.id)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Members */}
        <TabsContent value="members">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => {
              const c = counts(m.id);
              return (
                <TeamMemberCard
                  key={m.id}
                  member={m}
                  role={roleFor(m.id)}
                  isOwner={m.id === startup.ownerId}
                  isSelf={m.id === currentUser.id}
                  done={c.done}
                  pending={c.pending}
                  canManage={isFounder}
                  onMessage={() => message(m.id)}
                  onEditRole={() => setRoleEdit({ userId: m.id, name: m.name })}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create / edit task */}
      <TaskDialog
        open={taskOpen}
        onOpenChange={(o) => {
          setTaskOpen(o);
          if (!o) setEditing(null);
        }}
        members={members}
        initial={editing ?? undefined}
        onSubmit={submitTask}
      />

      {/* Edit member role */}
      <RoleDialog
        target={roleEdit}
        initialRole={roleEdit ? roleFor(roleEdit.userId) : ""}
        onClose={() => setRoleEdit(null)}
        onSave={(role) => {
          if (roleEdit) setMemberRole(startup.id, roleEdit.userId, role);
          setRoleEdit(null);
        }}
      />
    </>
  );
}

/* ---------- Stat tile ---------- */
function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

/* ---------- Role edit dialog ---------- */
function RoleDialog({
  target,
  initialRole,
  onClose,
  onSave,
}: {
  target: { userId: string; name: string } | null;
  initialRole: string;
  onClose: () => void;
  onSave: (role: string) => void;
}) {
  const [role, setRole] = React.useState("");

  React.useEffect(() => {
    if (target) setRole(initialRole);
  }, [target, initialRole]);

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set role for {target?.name}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(role.trim());
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="block text-sm text-muted-foreground">Role / title</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. CTO, Head of Design"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
