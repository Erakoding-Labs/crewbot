"use client";

import * as React from "react";
import Link from "next/link";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true); // mock: pretend a reset link was emailed
  };

  return (
    <AuthShell
      title="Reset your password"
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-[#d97757] hover:underline">
            Back to log in
          </Link>
        </>
      }
    >
      {sent ? (
        <p className="mt-8 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
          If an account exists for <strong>{email}</strong>, a password reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <p className="text-sm text-neutral-600">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full bg-[#F0A08C] text-neutral-900 hover:bg-[#eb9279]">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
