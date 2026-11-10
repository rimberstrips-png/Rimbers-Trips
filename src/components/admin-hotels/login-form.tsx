import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Add VITE_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);

    if (error) {
      setError("Invalid email or password.");
      return;
    }

    onSignedIn();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-gradient-to-br from-[#1AB65C] to-[#39E180]" />
          <h1 className="text-lg font-semibold text-neutral-900">Rimbers Trip Admin</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage hotels</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 focus-visible:ring-[#1AB65C]"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 focus-visible:ring-[#1AB65C]"
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-[#1AB65C] to-[#39E180] text-white hover:opacity-90"
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
