"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Github, Apple } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store/store";

/** Small inline brand glyphs for the social login buttons. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.4-1.7 4.1-5.4 4.1-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1-.2-1.5H12z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.6l8.2-9.3L1 2h6.9l4.8 6.4L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Use SSO login", icon: <KeyRound className="h-4 w-4" /> },
  { label: "Continue with Google", icon: <GoogleIcon /> },
  { label: "Continue with GitHub", icon: <Github className="h-4 w-4" /> },
  { label: "Continue with X", icon: <XIcon /> },
  { label: "Continue with Apple", icon: <Apple className="h-4 w-4" /> },
  { label: "Continue with Facebook", icon: <FacebookIcon /> },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("akshaycrln@gmail.com");
  const [password, setPassword] = React.useState("password");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) router.push("/dashboard");
    else setError(res.error ?? "Login failed.");
  };

  // Social buttons sign in as the demo account for convenience (mock).
  const demoLogin = () => {
    login("akshaycrln@gmail.com", "password");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: form */}
      <div className="flex w-full flex-col justify-center bg-[#F5F4F2] px-6 py-12 text-neutral-900 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
              F
            </div>
            <span className="text-lg font-semibold">FounderOS</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Log in to access a private website
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Email or username
              </label>
              <Input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-neutral-300 bg-white pr-10 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-[#F0A08C] text-neutral-900 hover:bg-[#eb9279]"
            >
              Log In
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Forgot password?
            </Link>
          </div>

          <div className="my-6 border-t border-neutral-300" />

          <div className="space-y-3">
            {SOCIALS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={demoLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200"
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-neutral-600">
            New to FounderOS?{" "}
            <Link href="/signup" className="font-medium text-[#d97757] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right: hero image */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a4d] via-[#5b3f6e] to-[#caa089]" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex h-full items-center justify-center px-12">
          <p className="flex flex-wrap items-center justify-center gap-3 text-4xl font-medium text-white">
            Creativity runs on
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-base font-bold">
                F
              </span>
              FounderOS
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
