/** Shared domain types for FounderOS. All data is mock; these model the entities. */

export type Stage = "Pre-Seed" | "Seed" | "Series A" | "Series B";

export interface Investor {
  id: string;
  name: string;
  role: string;
  firm: string;
  bio: string;
  stages: Stage[];
  sectors: string[];
  location: string;
  checkSize: string;
  portfolio: string[];
}

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  assigneeId?: string;
  status: TaskStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export type ResourceCategory =
  | "Product"
  | "Growth"
  | "Fundraising"
  | "Strategy"
  | "Team"
  | "Fundamentals"
  | "AI";

export interface Resource {
  id: string;
  title: string;
  description: string;
  author: string;
  duration: string;
  category: ResourceCategory;
  featured: boolean;
  url: string;
}

export type InsightCategory = "Team" | "Funding" | "Learning";

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  body: string;
}

export type Priority = "High" | "Medium" | "Low";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
}
