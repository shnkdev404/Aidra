import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
    <header className="sticky top-0 z-30 border-b border-[#282828] bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg">
            <HeartPulse className="h-5 w-5 fill-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Aidra</span>
          <span className="ml-1 hidden text-xs font-semibold text-[#1DB954] uppercase tracking-wider sm:inline bg-[#1DB954]/10 px-2.5 py-0.5 rounded-full border border-[#1DB954]/20">
            AI Health
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-bold text-[#b3b3b3] md:flex">
          {variant === "patient" ? (
            <>
              <Link to="/" hash="features" className="hover:text-white transition-colors">Features</Link>
              <Link to="/" hash="how" className="hover:text-white transition-colors">How it works</Link>
              <Link to="/for-doctors" className="hover:text-white transition-colors">For doctors</Link>
            </>
          ) : (
            <>
              <Link to="/for-doctors" hash="verification" className="hover:text-white transition-colors">Verification</Link>
              <Link to="/for-doctors" hash="benefits" className="hover:text-white transition-colors">Benefits</Link>
              <Link to="/" className="hover:text-white transition-colors">For patients</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="rounded-full bg-[#1DB954] px-5 py-2 text-xs font-extrabold text-black hover:scale-105 transition-all shadow-md"
            >
              Open Dashboard
            </button>
          ) : variant === "patient" ? (
            <>
              <Link
                to="/auth"
                className="text-xs font-bold text-[#b3b3b3] hover:text-white px-3 py-2 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-full bg-[#1DB954] px-5 py-2 text-xs font-extrabold text-black hover:scale-105 transition-all shadow-md"
              >
                Get Started Free
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/doctor-auth"
                className="text-xs font-bold text-[#b3b3b3] hover:text-white px-3 py-2 transition-colors"
              >
                Doctor Login
              </Link>
              <Link
                to="/doctor-auth"
                search={{ mode: "signup" }}
                className="rounded-full bg-[#1DB954] px-5 py-2 text-xs font-extrabold text-black hover:scale-105 transition-all shadow-md"
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
