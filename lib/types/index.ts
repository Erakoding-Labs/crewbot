/** Shared domain types for Crewboot. All data is mock; these model the entities. */

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

/* -------------------------------------------------------------------------- */
/* Crewboot platform entities (PRD MVP)                                       */
/* -------------------------------------------------------------------------- */

/** Platform user types. */
export type UserRole =
  | "founder"
  | "team_member"
  | "investor"
  | "mentor"
  | "service_provider";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  founder: "Founder",
  team_member: "Team Member",
  investor: "Investor",
  mentor: "Mentor",
  service_provider: "Service Provider",
};

/** Account + profile combined (1:1 in this mock store). */
export interface User {
  id: string;
  // Account
  email: string;
  password: string; // plaintext in mock store only — never do this with a real backend
  role: UserRole;
  createdAt: number;
  // Profile
  name: string;
  avatarColor: string; // seeded tailwind-ish color for the initial tile
  location: string;
  bio: string;
  skills: string[];
  experience: string;
  linkedin: string;
  portfolio: string;
  // Membership: the single startup this user belongs to (PRD: one active startup)
  startupId?: string;
  /** Whether the owning startup permits this member to join others (PRD authority rule). */
  canJoinOthers?: boolean;
}

export interface OpenRole {
  id: string;
  title: string;
  description: string;
}

export interface Startup {
  id: string;
  ownerId: string;
  name: string;
  industry: string;
  description: string;
  stage: Stage;
  website: string;
  teamSize: number;
  openRoles: OpenRole[];
  createdAt: number;
}

export type RequestStatus = "pending" | "accepted" | "declined";

/** A request from a user to join a startup. */
export interface JoinRequest {
  id: string;
  startupId: string;
  requesterId: string;
  /** The open role being applied for (optional — a general request has none). */
  roleId?: string;
  roleTitle?: string;
  message: string;
  status: RequestStatus;
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  createdAt: number;
}

export type NotificationType =
  | "join_request"
  | "request_accepted"
  | "request_declined"
  | "message"
  | "system";

export interface Notification {
  id: string;
  userId: string; // recipient
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  /** Optional link target (e.g. /messages?c=<id>). */
  href?: string;
  timestamp: number;
}

/** Per-user preferences (Settings screen). */
export interface UserSettings {
  emailNotifications: boolean;
  messageNotifications: boolean;
  discoverable: boolean;
}
