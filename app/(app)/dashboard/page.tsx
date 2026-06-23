"use client";

import { Users, CheckSquare, TrendingUp, BookOpen, Bot, Zap } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { InsightCard } from "@/components/insight-card";
import { ActionItemRow } from "@/components/action-item-row";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/components/app-state";
import { useStore } from "@/lib/store/store";

import { teamMembers, tasks } from "@/lib/mock/team";
import { insights, actionItems } from "@/lib/mock/copilot";

export default function DashboardPage() {
  const { savedInvestors, completedResources } = useAppState();
  const { currentUser, getStartup } = useStore();
  const startup = getStartup(currentUser?.startupId);

  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const completion = Math.round((done / tasks.length) * 100);

  return (
    <>
      <PageHeader
        title={`Good to see you, ${currentUser?.name ?? "Founder"}`}
        subtitle={startup?.name ?? "Set up your startup to get started"}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Team Members"
          value={teamMembers.length}
          icon={Users}
          iconClassName="h-5 w-5 text-blue-400"
        />
        <StatCard
          label="Tasks Done"
          value={done}
          icon={CheckSquare}
          iconClassName="h-5 w-5 text-emerald-400"
        />
        <StatCard
          label="Saved Investors"
          value={savedInvestors.size}
          icon={TrendingUp}
          iconClassName="h-5 w-5 text-primary"
        />
        <StatCard
          label="Resources Completed"
          value={completedResources.size}
          icon={BookOpen}
          iconClassName="h-5 w-5 text-amber-400"
        />
      </div>

      {/* Weekly completion */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Weekly task completion</h2>
          <span className="font-semibold text-primary">{completion}%</span>
        </div>
        <Progress value={completion} className="mt-4" />
        <p className="mt-3 text-sm text-muted-foreground">
          {done} done &nbsp;&nbsp; {inProgress} in progress &nbsp;&nbsp; {todo} todo
        </p>
      </Card>

      {/* Insights + action items */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Bot className="h-[18px] w-[18px] text-primary" /> Copilot Insights
          </h2>
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Zap className="h-[18px] w-[18px] text-amber-400" /> Action Items
          </h2>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <ActionItemRow key={item.id} item={item} />
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
