"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store/store";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useStore();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Role + the rest of the profile are collected in onboarding; seed a default.
    const res = signup({
      name: name.trim(),
      email: email.trim(),
      password,
      role: "founder",
    });
    if (!res.ok) {
      setError(res.error ?? "Could not create account.");
      return;
    }
    router.push("/onboarding");
  };

  const inputCls =
    "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-blue-500";

  return (
    <AuthShell
      title="Create your Crewboot account"
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full bg-[#F0A08C] text-neutral-900 hover:bg-[#eb9279]">
          Create account
        </Button>
        <p className="text-center text-xs text-neutral-500">
          Next: a quick 4-step setup so we can match you with the right people.
        </p>
      </form>
    </AuthShell>
  );
}
