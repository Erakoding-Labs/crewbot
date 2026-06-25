"use client";

import Link from "next/link";
import { Users, CheckSquare, TrendingUp, BookOpen, Bot, Zap, Compass, Briefcase, ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { InsightCard } from "@/components/insight-card";
import { ActionItemRow } from "@/components/action-item-row";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/components/app-state";
import { useStore } from "@/lib/store/store";

import { insights, actionItems } from "@/lib/mock/copilot";

export default function DashboardPage() {
  const { savedInvestors, completedResources } = useAppState();
  const { currentUser, getStartup, getStartupMembers, getTasks } = useStore();
  const startup = getStartup(currentUser?.startupId);
  const isFounder = !!startup && startup.ownerId === currentUser?.id;

  const members = startup ? getStartupMembers(startup.id) : [];
  const tasks = startup ? getTasks(startup.id) : [];
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title={`Good to see you, ${currentUser?.name ?? "Founder"}`}
        subtitle={startup?.name ?? "Set up your startup to get started"}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/discover">
                <Compass className="h-4 w-4" /> Discover
              </Link>
            </Button>
            {isFounder && (
              <Button asChild>
                <Link href="/recruitment">
                  <Briefcase className="h-4 w-4" /> Recruitment
                </Link>
              </Button>
            )}
          </>
        }
      />

      {/* Stats — each tile links to the page it summarizes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Team Members"
          value={members.length}
          icon={Users}
          iconClassName="h-5 w-5 text-blue-400"
          href="/team"
        />
        <StatCard
          label="Tasks Done"
          value={done}
          icon={CheckSquare}
          iconClassName="h-5 w-5 text-emerald-400"
          href="/team"
        />
        <StatCard
          label="Saved Investors"
          value={savedInvestors.size}
          icon={TrendingUp}
          iconClassName="h-5 w-5 text-primary"
          href="/investors"
        />
        <StatCard
          label="Resources Completed"
          value={completedResources.size}
          icon={BookOpen}
          iconClassName="h-5 w-5 text-amber-400"
          href="/learning"
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
        <Link
          href="/team"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Open team board <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      {/* Insights + action items */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Bot className="h-[18px] w-[18px] text-primary" /> Copilot Insights
          </h2>
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
          <Link
            href="/copilot"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ask the Copilot <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="flex flex-col p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Zap className="h-[18px] w-[18px] text-amber-400" /> Action Items
          </h2>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <ActionItemRow key={item.id} item={item} />
            ))}
          </div>
          <Link
            href="/copilot"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See more in Copilot <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    </>
  );
}
