import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";
import type { User } from "@supabase/supabase-js";

export function SiteHeader({ variant = "patient" }: { variant?: "patient" | "doctor" }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-primary text-primary-foreground shadow-xs transition-all">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-ink">Aidra</span>
          <span className="ml-1 hidden font-mono text-[11px] font-medium text-ink uppercase tracking-wider bg-hairline-soft px-2 py-0.5 rounded-[4px] border border-border sm:inline">
            HEALTH AI
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-body md:flex">
          {variant === "patient" ? (
            <>
              <Link to="/" hash="features" className="hover:text-ink transition-colors">Features</Link>
              <Link to="/" hash="how" className="hover:text-ink transition-colors">How it works</Link>
              <Link to="/for-doctors" className="hover:text-ink transition-colors">For doctors</Link>
            </>
          ) : (
            <>
              <Link to="/for-doctors" hash="verification" className="hover:text-ink transition-colors">Verification</Link>
              <Link to="/for-doctors" hash="benefits" className="hover:text-ink transition-colors">Benefits</Link>
              <Link to="/" className="hover:text-ink transition-colors">For patients</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-border bg-canvas-elevated text-body hover:text-ink hover:bg-hairline-soft transition-all"
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="rounded-[6px] bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-all shadow-xs"
            >
              Open Dashboard
            </button>
          ) : variant === "patient" ? (
            <>
              <Link
                to="/auth"
                className="rounded-[6px] text-xs font-medium text-body hover:text-ink hover:bg-hairline-soft px-3 py-1.5 transition-all"
              >
                Log In
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-[6px] bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-all shadow-xs"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/doctor-auth"
                className="rounded-[6px] text-xs font-medium text-body hover:text-ink hover:bg-hairline-soft px-3 py-1.5 transition-all"
              >
                Doctor Log In
              </Link>
              <Link
                to="/doctor-auth"
                search={{ mode: "signup" }}
                className="rounded-[6px] bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-all shadow-xs"
              >
                Apply as Doctor
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
