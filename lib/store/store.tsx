"use client";

import * as React from "react";

import type {
  User,
  Startup,
  OpenRole,
  JoinRequest,
  Conversation,
  Message,
  Notification,
  UserSettings,
  UserRole,
  ProjectTask,
  TaskStatus,
  Priority,
} from "@/lib/types";
import {
  seedUsers,
  seedStartups,
  seedConversations,
  seedMessages,
  seedJoinRequests,
  seedNotifications,
  seedTasks,
} from "@/lib/store/seed";

/* -------------------------------------------------------------------------- */
/* Persistence shape                                                          */
/* -------------------------------------------------------------------------- */

interface DB {
  users: User[];
  startups: Startup[];
  joinRequests: JoinRequest[];
  tasks: ProjectTask[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  settings: Record<string, UserSettings>;
  currentUserId: string | null;
}

const STORAGE_KEY = "crewboot.db.v4";

const defaultSettings: UserSettings = {
  emailNotifications: true,
  messageNotifications: true,
  discoverable: true,
};

function freshDB(): DB {
  return {
    users: seedUsers,
    startups: seedStartups,
    joinRequests: seedJoinRequests,
    tasks: seedTasks,
    conversations: seedConversations,
    messages: seedMessages,
    notifications: seedNotifications,
    settings: {},
    currentUserId: null, // start logged-out so the auth flow is exercised
  };
}

function loadDB(): DB {
  if (typeof window === "undefined") return freshDB();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshDB();
    return { ...freshDB(), ...(JSON.parse(raw) as DB) };
  } catch {
    return freshDB();
  }
}

const uid = (p: string) =>
  `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/* -------------------------------------------------------------------------- */
/* Context API                                                                */
/* -------------------------------------------------------------------------- */

interface StoreApi {
  ready: boolean;
  db: DB;
  currentUser: User | null;

  // Auth
  signup: (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  // Users / profile
  getUser: (id: string) => User | undefined;
  updateProfile: (patch: Partial<User>) => void;

  // Startups
  getStartup: (id?: string) => Startup | undefined;
  createStartup: (input: Omit<Startup, "id" | "ownerId" | "createdAt" | "openRoles"> & {
    openRoles?: OpenRole[];
  }) => Startup;
  updateStartup: (id: string, patch: Partial<Startup>) => void;

  // Join requests
  requestToJoin: (startupId: string, message: string, roleId?: string) => void;
  respondToRequest: (requestId: string, accept: boolean) => void;

  // Team / project management
  getStartupMembers: (startupId: string) => User[];
  setMemberRole: (startupId: string, userId: string, role: string) => void;
  getTasks: (startupId: string) => ProjectTask[];
  createTask: (input: {
    startupId: string;
    title: string;
    description?: string;
    assigneeId?: string;
    priority: Priority;
    dueDate?: number;
  }) => void;
  updateTask: (
    id: string,
    patch: Partial<
      Pick<
        ProjectTask,
        "title" | "description" | "assigneeId" | "priority" | "dueDate" | "status"
      >
    >
  ) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  // Messaging
  getOrCreateConversation: (otherUserId: string) => Conversation;
  sendMessage: (conversationId: string, content: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationCount: () => number;

  // Settings
  getSettings: (userId: string) => UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => void;
}

const StoreContext = React.createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = React.useState<DB>(freshDB);
  const [ready, setReady] = React.useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  React.useEffect(() => {
    setDb(loadDB());
    setReady(true);
  }, []);

  // Persist on every change once hydrated.
  React.useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      /* ignore quota errors in this mock */
    }
  }, [db, ready]);

  const currentUser =
    db.users.find((u) => u.id === db.currentUserId) ?? null;

  /* ----- helpers ----- */
  const addNotification = (
    prev: DB,
    n: Omit<Notification, "id" | "timestamp" | "read">
  ): Notification => ({
    ...n,
    id: uid("n"),
    read: false,
    timestamp: Date.now(),
  });

  /* ----- auth ----- */
  const signup: StoreApi["signup"] = ({ name, email, password, role }) => {
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const user: User = {
      id: uid("u"),
      email,
      password,
      role,
      createdAt: Date.now(),
      name,
      avatarColor: "bg-primary/20 text-primary",
      location: "",
      bio: "",
      skills: [],
      experience: "",
      linkedin: "",
      portfolio: "",
      interests: [],
      onboarded: false,
    };
    setDb((prev) => ({
      ...prev,
      users: [...prev.users, user],
      currentUserId: user.id,
    }));
    return { ok: true };
  };

  const login: StoreApi["login"] = (email, password) => {
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) return { ok: false, error: "No account found for that email." };
    if (user.password !== password)
      return { ok: false, error: "Incorrect password." };
    setDb((prev) => ({ ...prev, currentUserId: user.id }));
    return { ok: true };
  };

  const logout = () =>
    setDb((prev) => ({ ...prev, currentUserId: null }));

  /* ----- users / profile ----- */
  const getUser = (id: string) => db.users.find((u) => u.id === id);

  const updateProfile: StoreApi["updateProfile"] = (patch) => {
    if (!currentUser) return;
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === prev.currentUserId ? { ...u, ...patch } : u
      ),
    }));
  };

  /* ----- startups ----- */
  const getStartup = (id?: string) =>
    id ? db.startups.find((s) => s.id === id) : undefined;

  const createStartup: StoreApi["createStartup"] = (input) => {
    const startup: Startup = {
      id: uid("s"),
      ownerId: currentUser?.id ?? "",
      createdAt: Date.now(),
      openRoles: input.openRoles ?? [],
      ...input,
    };
    setDb((prev) => ({
      ...prev,
      startups: [...prev.startups, startup],
      users: prev.users.map((u) =>
        u.id === prev.currentUserId
          ? { ...u, startupId: startup.id, role: "founder" }
          : u
      ),
    }));
    return startup;
  };

  const updateStartup: StoreApi["updateStartup"] = (id, patch) => {
    setDb((prev) => ({
      ...prev,
      startups: prev.startups.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  /* ----- join requests ----- */
  const requestToJoin: StoreApi["requestToJoin"] = (startupId, message, roleId) => {
    if (!currentUser) return;
    const startup = db.startups.find((s) => s.id === startupId);
    if (!startup) return;
    const role = roleId
      ? startup.openRoles.find((r) => r.id === roleId)
      : undefined;
    const req: JoinRequest = {
      id: uid("jr"),
      startupId,
      requesterId: currentUser.id,
      roleId: role?.id,
      roleTitle: role?.title,
      message,
      status: "pending",
      createdAt: Date.now(),
    };
    setDb((prev) => ({
      ...prev,
      joinRequests: [...prev.joinRequests, req],
      notifications: [
        addNotification(prev, {
          userId: startup.ownerId,
          type: "join_request",
          title: role
            ? `${currentUser.name} applied for ${role.title} at ${startup.name}`
            : `${currentUser.name} wants to join ${startup.name}`,
          body: message || "No message provided.",
          href: "/recruitment",
        }),
        ...prev.notifications,
      ],
    }));
  };

  const respondToRequest: StoreApi["respondToRequest"] = (requestId, accept) => {
    setDb((prev) => {
      const req = prev.joinRequests.find((r) => r.id === requestId);
      if (!req) return prev;
      const startup = prev.startups.find((s) => s.id === req.startupId);
      return {
        ...prev,
        joinRequests: prev.joinRequests.map((r) =>
          r.id === requestId
            ? { ...r, status: accept ? "accepted" : "declined" }
            : r
        ),
        users: accept
          ? prev.users.map((u) =>
              u.id === req.requesterId
                ? { ...u, startupId: req.startupId }
                : u
            )
          : prev.users,
        notifications: [
          addNotification(prev, {
            userId: req.requesterId,
            type: accept ? "request_accepted" : "request_declined",
            title: accept
              ? `You're in! ${startup?.name ?? "The startup"} accepted you`
              : `${startup?.name ?? "The startup"} declined your request`,
            body: accept
              ? "Welcome to the team. Head to the dashboard to get started."
              : "Keep exploring other startups on Discover.",
            href: accept ? "/dashboard" : "/discover",
          }),
          ...prev.notifications,
        ],
      };
    });
  };

  /* ----- team / project management ----- */
  const getStartupMembers: StoreApi["getStartupMembers"] = (startupId) =>
    db.users.filter((u) => u.startupId === startupId);

  const setMemberRole: StoreApi["setMemberRole"] = (startupId, userId, role) => {
    setDb((prev) => ({
      ...prev,
      startups: prev.startups.map((s) =>
        s.id === startupId
          ? {
              ...s,
              memberRoles: { ...(s.memberRoles ?? {}), [userId]: role.trim() },
            }
          : s
      ),
    }));
  };

  const getTasks: StoreApi["getTasks"] = (startupId) =>
    db.tasks.filter((t) => t.startupId === startupId);

  // Notify a member that a task was assigned to them (skip self-assignment).
  const taskAssignedNotif = (
    prev: DB,
    assigneeId: string,
    taskTitle: string,
    startupId: string
  ): Notification[] => {
    if (!currentUser || assigneeId === currentUser.id) return prev.notifications;
    const startup = prev.startups.find((s) => s.id === startupId);
    return [
      addNotification(prev, {
        userId: assigneeId,
        type: "task_assigned",
        title: `${currentUser.name} assigned you a task`,
        body: `“${taskTitle}”${startup ? ` · ${startup.name}` : ""}`,
        href: "/team",
      }),
      ...prev.notifications,
    ];
  };

  const createTask: StoreApi["createTask"] = (input) => {
    if (!currentUser) return;
    const task: ProjectTask = {
      id: uid("pt"),
      startupId: input.startupId,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      assigneeId: input.assigneeId || undefined,
      status: "todo",
      priority: input.priority,
      dueDate: input.dueDate,
      createdBy: currentUser.id,
      createdAt: Date.now(),
    };
    if (!task.title) return;
    setDb((prev) => ({
      ...prev,
      tasks: [task, ...prev.tasks],
      notifications: task.assigneeId
        ? taskAssignedNotif(prev, task.assigneeId, task.title, task.startupId)
        : prev.notifications,
    }));
  };

  const updateTask: StoreApi["updateTask"] = (id, patch) => {
    setDb((prev) => {
      const existing = prev.tasks.find((t) => t.id === id);
      if (!existing) return prev;
      const next: ProjectTask = {
        ...existing,
        ...patch,
        title: patch.title !== undefined ? patch.title.trim() : existing.title,
        description:
          patch.description !== undefined
            ? patch.description.trim() || undefined
            : existing.description,
        assigneeId:
          patch.assigneeId !== undefined
            ? patch.assigneeId || undefined
            : existing.assigneeId,
      };
      // Notify only when the assignee actually changes to a new person.
      const reassigned =
        patch.assigneeId !== undefined &&
        next.assigneeId &&
        next.assigneeId !== existing.assigneeId;
      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? next : t)),
        notifications: reassigned
          ? taskAssignedNotif(prev, next.assigneeId!, next.title, next.startupId)
          : prev.notifications,
      };
    });
  };

  const setTaskStatus: StoreApi["setTaskStatus"] = (id, status) =>
    setDb((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));

  const deleteTask: StoreApi["deleteTask"] = (id) =>
    setDb((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));

  /* ----- messaging ----- */
  const getOrCreateConversation: StoreApi["getOrCreateConversation"] = (
    otherUserId
  ) => {
    const existing = db.conversations.find(
      (c) =>
        currentUser &&
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(otherUserId)
    );
    if (existing) return existing;
    const conv: Conversation = {
      id: uid("c"),
      participantIds: currentUser ? [currentUser.id, otherUserId] : [otherUserId],
      createdAt: Date.now(),
    };
    setDb((prev) => ({ ...prev, conversations: [...prev.conversations, conv] }));
    return conv;
  };

  const sendMessage: StoreApi["sendMessage"] = (conversationId, content) => {
    if (!currentUser || !content.trim()) return;
    setDb((prev) => {
      const conv = prev.conversations.find((c) => c.id === conversationId);
      const recipient = conv?.participantIds.find((p) => p !== currentUser.id);
      const msg: Message = {
        id: uid("m"),
        conversationId,
        senderId: currentUser.id,
        content: content.trim(),
        timestamp: Date.now(),
      };
      return {
        ...prev,
        messages: [...prev.messages, msg],
        notifications: recipient
          ? [
              addNotification(prev, {
                userId: recipient,
                type: "message",
                title: `New message from ${currentUser.name}`,
                body: content.trim(),
                href: `/messages?c=${conversationId}`,
              }),
              ...prev.notifications,
            ]
          : prev.notifications,
      };
    });
  };

  /* ----- notifications ----- */
  const markNotificationRead: StoreApi["markNotificationRead"] = (id) =>
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));

  const markAllNotificationsRead = () =>
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.userId === prev.currentUserId ? { ...n, read: true } : n
      ),
    }));

  const unreadNotificationCount = () =>
    db.notifications.filter((n) => n.userId === db.currentUserId && !n.read)
      .length;

  /* ----- settings ----- */
  const getSettings: StoreApi["getSettings"] = (userId) =>
    db.settings[userId] ?? defaultSettings;

  const updateSettings: StoreApi["updateSettings"] = (patch) => {
    if (!currentUser) return;
    setDb((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [currentUser.id]: {
          ...(prev.settings[currentUser.id] ?? defaultSettings),
          ...patch,
        },
      },
    }));
  };

  const value: StoreApi = {
    ready,
    db,
    currentUser,
    signup,
    login,
    logout,
    getUser,
    updateProfile,
    getStartup,
    createStartup,
    updateStartup,
    requestToJoin,
    respondToRequest,
    getStartupMembers,
    setMemberRole,
    getTasks,
    createTask,
    updateTask,
    setTaskStatus,
    deleteTask,
    getOrCreateConversation,
    sendMessage,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount,
    getSettings,
    updateSettings,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
