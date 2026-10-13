"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, LoaderCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SESSION_KEY = "gallery-player-auth";

type Credentials = { username: string; password: string };

export function LoginGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [credentials, setCredentials] = useState<Credentials>({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthenticated(window.localStorage.getItem(SESSION_KEY) === "authenticated");
    setChecking(false);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) setError("Invalid username or password.");
        else setError("Login is unavailable right now. Please try again.");
        return;
      }

      window.localStorage.setItem(SESSION_KEY, "authenticated");
      setAuthenticated(true);
    } catch {
      setError("Login is unavailable right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><LoaderCircle className="size-6 animate-spin text-primary" /></div>;
  }

  if (authenticated) return <>{children}</>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl shadow-black/30 sm:p-8" aria-labelledby="login-title">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <KeyRound className="size-7" aria-hidden="true" />
          </div>
          <h1 id="login-title" className="text-2xl font-semibold tracking-tight">Gallery Player</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your picture collection.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" autoComplete="username" value={credentials.username} onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} required />
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}
