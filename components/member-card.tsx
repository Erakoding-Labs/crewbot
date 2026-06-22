import { CheckSquare } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/lib/types";

interface MemberCardProps {
  member: TeamMember;
  done: number;
  pending: number;
}

/** Team member tile: avatar initial, name/role, and task counts. */
export function MemberCard({ member, done, pending }: MemberCardProps) {
  return (
    <Card className="p-5 transition-colors hover:bg-surface-hover">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-base font-semibold text-primary">
          {member.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-foreground">{member.name}</p>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckSquare className="h-4 w-4 text-emerald-400" />
          {done} done
        </span>
        <span>{pending} pending</span>
      </div>
    </Card>
  );
}
