import type { Insight, ActionItem } from "@/lib/types";

export const insights: Insight[] = [
  {
    id: "i1",
    category: "Team",
    title: "Your team is growing — set clear ownership now",
    body: "As you add team members, ambiguity around ownership becomes your biggest risk. Every project should have a single owner who makes final calls. Write it down before the next hire.",
  },
  {
    id: "i2",
    category: "Funding",
    title: "Investor timing: start 6 months early",
    body: "The best investor relationships are built before you need the money. Start sending monthly updates to potential investors today — even a 3-line note keeps you top of mind when you raise.",
  },
  {
    id: "i3",
    category: "Learning",
    title: "Complete your first 3 learning resources",
    body: "You've bookmarked resources but haven't completed any yet. Commit to one resource per week. The founders who compound their knowledge consistently outperform the ones who binge and forget.",
  },
];

export const actionItems: ActionItem[] = [
  {
    id: "a1",
    title: "Define roles for each team member",
    description:
      "Write a 3-sentence job description for each current team member. Misaligned expectations are the #1 source of early-team friction.",
    priority: "High",
  },
  {
    id: "a2",
    title: "Research 10 target investors",
    description:
      "Use the Investors tab to find 10 investors who have backed companies at your stage and in your sector. Save the ones that fit.",
    priority: "High",
  },
  {
    id: "a3",
    title: "Complete one learning resource this week",
    description:
      "Pick one resource from the Learning Hub that directly addresses your current biggest challenge, and finish it.",
    priority: "Medium",
  },
  {
    id: "a4",
    title: "Talk to 3 potential customers",
    description:
      "Schedule 20-minute calls with 3 people who fit your ideal customer profile. Ask about their problems, not your solution.",
    priority: "High",
  },
];

/** Canned copilot reply — no real LLM, just a helpful deterministic echo. */
export function getCopilotReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("investor")) {
    return "Start with the Investors tab — filter by your stage and sector, then save the 10 best fits. Warm intros convert far better than cold outreach, so map each target to someone in your network first. Send a tight 3-line update monthly to stay top of mind.";
  }
  if (p.includes("focus") || p.includes("week")) {
    return "This week, pick the single metric that proves your business works and pour your energy there. For most early founders that's customer conversations — aim for 3 this week. Everything else (deck polish, tooling) can wait.";
  }
  if (p.includes("team") || p.includes("hire") || p.includes("founding")) {
    return "Great founding teams pair complementary skills with shared values. Define clear ownership for every area before friction shows up. Hire slowly for your first 10 — each early hire sets the cultural ceiling for everyone who follows.";
  }
  if (p.includes("customer")) {
    return "Talk to customers about their problems, not your solution (read The Mom Test). Schedule 20-minute calls with people who fit your ideal profile, ask what they've tried, and listen for the pain that keeps coming up.";
  }
  return "Good question. Break it into the smallest next action you can take today, and tie it back to your one key metric. If you tell me more about your stage and goal, I can give you a concrete step-by-step plan.";
}
