import type { TeamMember, Task } from "@/lib/types";

export const teamMembers: TeamMember[] = [
  { id: "jordan-kim", name: "Jordan Kim", role: "CTO" },
  { id: "mia-torres", name: "Mia Torres", role: "Head of Design" },
  { id: "liam-chen", name: "Liam Chen", role: "Growth Lead" },
];

export const tasks: Task[] = [
  { id: "t1", title: "Set up CI/CD pipeline", assigneeId: "jordan-kim", status: "done" },
  { id: "t2", title: "Migrate auth to OAuth", assigneeId: "jordan-kim", status: "in-progress" },
  { id: "t3", title: "Design system v2", status: "todo" },
  { id: "t4", title: "Launch referral program", assigneeId: "liam-chen", status: "done" },
  { id: "t5", title: "SEO content sprint", assigneeId: "liam-chen", status: "in-progress" },
  { id: "t6", title: "Customer interview round", status: "todo" },
];
