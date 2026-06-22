"use client";

import * as React from "react";
import { Plus, UserPlus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { MemberCard } from "@/components/member-card";
import { TaskColumn } from "@/components/task-column";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { teamMembers as seedMembers, tasks as seedTasks } from "@/lib/mock/team";
import type { TeamMember, Task, TaskStatus } from "@/lib/types";

export default function TeamPage() {
  const [members, setMembers] = React.useState<TeamMember[]>(seedMembers);
  const [tasks, setTasks] = React.useState<Task[]>(seedTasks);
  const [memberOpen, setMemberOpen] = React.useState(false);
  const [taskOpen, setTaskOpen] = React.useState(false);

  // Per-member done / pending counts.
  const counts = (id: string) => {
    const mine = tasks.filter((t) => t.assigneeId === id);
    return {
      done: mine.filter((t) => t.status === "done").length,
      pending: mine.filter((t) => t.status !== "done").length,
    };
  };

  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  const addMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const role = String(form.get("role") || "").trim();
    if (!name) return;
    setMembers((prev) => [
      ...prev,
      { id: `${name}-${prev.length}`, name, role: role || "Team Member" },
    ]);
    setMemberOpen(false);
  };

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "").trim();
    const assigneeId = String(form.get("assignee") || "") || undefined;
    if (!title) return;
    setTasks((prev) => [
      ...prev,
      { id: `task-${prev.length}-${title}`, title, assigneeId, status: "todo" },
    ]);
    setTaskOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Manage your team and track progress"
        actions={
          <>
            <Button variant="outline" onClick={() => setTaskOpen(true)}>
              <Plus className="h-4 w-4" /> Add Task
            </Button>
            <Button onClick={() => setMemberOpen(true)}>
              <UserPlus className="h-4 w-4" /> Add Member
            </Button>
          </>
        }
      />

      {/* Members */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Members
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => {
          const c = counts(m.id);
          return <MemberCard key={m.id} member={m} done={c.done} pending={c.pending} />;
        })}
      </div>

      {/* Task board */}
      <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Task Board
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TaskColumn title="Todo" tasks={byStatus("todo")} members={members} />
        <TaskColumn title="In Progress" tasks={byStatus("in-progress")} members={members} />
        <TaskColumn title="Done" tasks={byStatus("done")} members={members} />
      </div>

      {/* Add Member dialog */}
      <Dialog open={memberOpen} onOpenChange={setMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add team member</DialogTitle>
          </DialogHeader>
          <form onSubmit={addMember} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Name</label>
              <Input name="name" placeholder="Jane Doe" autoFocus />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Role</label>
              <Input name="role" placeholder="Head of Product" />
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Task dialog */}
      <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add task</DialogTitle>
          </DialogHeader>
          <form onSubmit={addTask} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Title</label>
              <Input name="title" placeholder="Ship onboarding flow" autoFocus />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Assignee</label>
              <select
                name="assignee"
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
