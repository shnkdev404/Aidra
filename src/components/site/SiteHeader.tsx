import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function SiteHeader({ variant = "patient" }: { variant?: "patient" | "doctor" }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="relative z-20 border-b border-border/60 bg-paper/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="serif text-lg leading-none">a</span>
            <span className="absolute inset-0 rounded-full animate-pulse-ring" />
          </div>
          <span className="serif text-xl tracking-tight">Aidra</span>
          <span className="ml-1 hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Health, in prose.
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          {variant === "patient" ? (
            <>
              <Link to="/" hash="features" className="hover:text-foreground">Features</Link>
              <Link to="/" hash="how" className="hover:text-foreground">How it works</Link>
              <Link to="/for-doctors" className="hover:text-foreground">For doctors</Link>
            </>
          ) : (
            <>
              <Link to="/for-doctors" hash="verification" className="hover:text-foreground">Verification</Link>
              <Link to="/for-doctors" hash="benefits" className="hover:text-foreground">Benefits</Link>
              <Link to="/" className="hover:text-foreground">For patients</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="default" size="sm" onClick={() => navigate({ to: "/dashboard" })}>
              Open app
            </Button>
          ) : variant === "patient" ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/auth" search={{ mode: "signup" }}>Get started</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/doctor-auth">Doctor sign in</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/doctor-auth" search={{ mode: "signup" }}>Apply as doctor</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
