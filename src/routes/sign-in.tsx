import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/use-session";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Rimbers Trip" },
      {
        name: "description",
        content: "Sign in to Rimbers Trip to book stays or list your travel business.",
      },
    ],
  }),
  ssr: false,
  component: SignInPage,
});

function getRedirectTarget() {
  if (typeof window === "undefined") return "/";
  const param = new URLSearchParams(window.location.search).get("redirect");
  return param && param.startsWith("/") ? param : "/";
}

function isBusinessIntent() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("intent") === "business";
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function SignInPage() {
  const { session, loading } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // Skip the auto-redirect for business sign-ups: an existing session here
    // just means some account is active, not that it's the right one to
    // register a business under — let the account picker decide instead.
    if (!loading && session && !isBusinessIntent()) {
      window.location.assign(getRedirectTarget());
    }
  }, [loading, session]);

  async function handleGoogleSignIn() {
    setError(null);
    setPending(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${getRedirectTarget()}`,
        // Force Google's account chooser for business sign-ups so an owner
        // consciously picks which account to register a business under,
        // instead of silently reusing whichever account is already active.
        queryParams: isBusinessIntent() ? { prompt: "select_account" } : {},
      },
    });
    if (error) {
      setError(error.message);
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="surface-card w-full max-w-sm p-8 text-center">
          <h1 className="text-xl font-bold">
            {isBusinessIntent() ? "Sign in to list your business" : "Sign in to Rimbers Trip"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isBusinessIntent()
              ? "Choose the Google account you want to register your business under."
              : "Book stays or list your travel business in one account."}
          </p>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={pending}
            onClick={handleGoogleSignIn}
            className="mt-6 w-full gap-2"
          >
            <GoogleIcon />
            {pending ? "Redirecting…" : "Continue with Google"}
          </Button>

          {error ? (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <p className="mt-6 text-xs text-muted-foreground">
            By continuing, you agree to Rimbers Trip&apos;s terms and privacy policy.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
