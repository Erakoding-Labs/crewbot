"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store/store";
import { USER_ROLE_LABELS } from "@/lib/types";

/** Simple controlled toggle switch. */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-secondary"
      )}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, getSettings, updateSettings, updateProfile } = useStore();
  const [pw, setPw] = React.useState("");
  const [pwSaved, setPwSaved] = React.useState(false);

  if (!currentUser) return null;
  const settings = getSettings(currentUser.id);

  const changePassword = () => {
    if (pw.trim().length < 4) return;
    updateProfile({ password: pw });
    setPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="max-w-2xl space-y-6">
        {/* Account */}
        <Card className="p-6">
          <h2 className="mb-2 font-semibold text-foreground">Account</h2>
          <Row title="Name" desc={currentUser.name}><span /></Row>
          <div className="border-t border-border" />
          <Row title="Email" desc={currentUser.email}><span /></Row>
          <div className="border-t border-border" />
          <Row title="Role" desc={USER_ROLE_LABELS[currentUser.role]}><span /></Row>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="mb-2 font-semibold text-foreground">Notifications & Privacy</h2>
          <Row title="Email notifications" desc="Receive updates by email">
            <Toggle checked={settings.emailNotifications} onChange={(v) => updateSettings({ emailNotifications: v })} />
          </Row>
          <div className="border-t border-border" />
          <Row title="Message notifications" desc="Alert me about new messages">
            <Toggle checked={settings.messageNotifications} onChange={(v) => updateSettings({ messageNotifications: v })} />
          </Row>
          <div className="border-t border-border" />
          <Row title="Discoverable" desc="Show my profile on Discover">
            <Toggle checked={settings.discoverable} onChange={(v) => updateSettings({ discoverable: v })} />
          </Row>
        </Card>

        {/* Password */}
        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-foreground">Change password</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="New password"
            />
            <Button onClick={changePassword} disabled={pw.trim().length < 4}>
              Update
            </Button>
          </div>
          {pwSaved && <p className="mt-2 text-sm text-emerald-400">Password updated.</p>}
        </Card>
      </div>
    </>
  );
}
