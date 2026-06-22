"use client";

import * as React from "react";
import { Bot, Send, Lightbulb, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { InsightCard } from "@/components/insight-card";
import { ActionItemRow } from "@/components/action-item-row";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { insights, actionItems, getCopilotReply } from "@/lib/mock/copilot";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const SUGGESTIONS = [
  "How do I find investors for my startup?",
  "What should I focus on this week?",
  "How do I build a great founding team?",
  "Tips for getting my first customers",
];

const INTRO =
  "Hey! I'm your founder copilot. Ask me anything about building your startup — team, fundraising, customers, or what to learn next. I'm here to help you move faster.";

export default function CopilotPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: "intro", role: "assistant", text: INTRO },
  ]);
  const [input, setInput] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    const reply: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: getCopilotReply(trimmed),
    };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      {/* Chat column */}
      <div className="flex min-h-[calc(100vh-8rem)] flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            AI Copilot
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your founder advisor — always on, never judging
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3",
                m.role === "user" && "flex-row-reverse"
              )}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-xl border border-border px-4 py-3 text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "bg-surface text-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-3 flex items-center gap-2 border-t border-border pt-4"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your copilot anything..."
          />
          <Button type="submit" size="icon" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Right insights/actions panel */}
      <aside className="space-y-6">
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-amber-400" /> Insights
          </h2>
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Zap className="h-4 w-4 text-amber-400" /> Action Items
          </h2>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <ActionItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
