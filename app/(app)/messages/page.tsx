"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";

import { cn, timeAgo } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store/store";
import type { Conversation } from "@/lib/types";

function MessagesInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { db, currentUser, getUser, sendMessage } = useStore();
  const [text, setText] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  const myConvos = db.conversations
    .filter((c) => currentUser && c.participantIds.includes(currentUser.id))
    .sort((a, b) => lastTs(b) - lastTs(a));

  function lastTs(c: Conversation) {
    const msgs = db.messages.filter((m) => m.conversationId === c.id);
    return msgs.length ? msgs[msgs.length - 1].timestamp : c.createdAt;
  }

  const selectedId = params.get("c") ?? myConvos[0]?.id ?? null;
  const selected = myConvos.find((c) => c.id === selectedId) ?? null;

  const other = (c: Conversation) =>
    getUser(c.participantIds.find((p) => p !== currentUser?.id) ?? "");

  const thread = selected
    ? db.messages
        .filter((m) => m.conversationId === selected.id)
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  React.useEffect(() => {
    endRef.current?.scrollIntoView();
  }, [thread.length, selectedId]);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected && text.trim()) {
      sendMessage(selected.id, text);
      setText("");
    }
  };

  return (
    <>
      <PageHeader title="Messages" subtitle="Talk directly with your network" />

      <div className="grid h-[calc(100vh-13rem)] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <Card className={cn("overflow-y-auto p-2 scrollbar-thin", selected && "hidden lg:block")}>
          {myConvos.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No conversations yet. Find people on Discover.
            </p>
          ) : (
            myConvos.map((c) => {
              const u = other(c);
              const last = db.messages.filter((m) => m.conversationId === c.id).slice(-1)[0];
              return (
                <button
                  key={c.id}
                  onClick={() => router.push(`/messages?c=${c.id}`)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                    c.id === selectedId ? "bg-surface-hover" : "hover:bg-surface-hover"
                  )}
                >
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold", u?.avatarColor)}>
                    {u?.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{u?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {last?.content ?? "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </Card>

        {/* Thread */}
        <Card className={cn("flex flex-col", !selected && "hidden lg:flex")}>
          {!selected ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-border p-4">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold", other(selected)?.avatarColor)}>
                  {other(selected)?.name.charAt(0)}
                </div>
                <p className="font-semibold text-foreground">{other(selected)?.name}</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
                {thread.map((m) => {
                  const mine = m.senderId === currentUser?.id;
                  return (
                    <div key={m.id} className={cn("flex", mine && "justify-end")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-xl px-4 py-2 text-sm",
                          mine
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-surface text-foreground"
                        )}
                      >
                        <p>{m.content}</p>
                        <p className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {timeAgo(m.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              <form onSubmit={onSend} className="flex items-center gap-2 border-t border-border p-3">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit" size="icon" aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

export default function MessagesPage() {
  return (
    <React.Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <MessagesInner />
    </React.Suspense>
  );
}
