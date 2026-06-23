"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store/store";
import { USER_ROLE_LABELS, type UserRole } from "@/lib/types";

const ROLES = Object.entries(USER_ROLE_LABELS) as [UserRole, string][];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useStore();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("founder");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const res = signup({ name: name.trim(), email: email.trim(), password, role });
    if (!res.ok) {
      setError(res.error ?? "Could not create account.");
      return;
    }
    // PRD: profile required before joining/creating a startup → land on profile setup.
    router.push("/profile");
  };

  const inputCls =
    "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-blue-500";

  return (
    <AuthShell
      title="Create your FounderOS account"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#d97757] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Full name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">I am a…</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {ROLES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full bg-[#F0A08C] text-neutral-900 hover:bg-[#eb9279]">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
