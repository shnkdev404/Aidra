import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { HeartPulse, MessageSquareText, LineChart, Stethoscope, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  to: string;
  label: string;
  icon: typeof HeartPulse;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Home", icon: HeartPulse },
  { to: "/chat", label: "Chat", icon: MessageSquareText },
  { to: "/health", label: "BMI", icon: LineChart },
  { to: "/doctor/verify", label: "Doctor", icon: Stethoscope },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setName(
        (data.user?.user_metadata?.display_name as string | undefined) ??
          data.user?.email?.split("@")[0] ??
          "",
      );
    });
  }, []);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-border/60 md:block">
          <div className="sticky top-0 flex h-screen flex-col p-5">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="serif text-lg leading-none">a</span>
              </div>
              <span className="serif text-xl">Aidra</span>
            </Link>

            <nav className="mt-10 space-y-1">
              {NAV.map((n) => {
                const active = pathname === n.to || pathname.startsWith(n.to + "/");
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/8 text-primary"
                        : "text-ink-muted hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <n.icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 border-t border-border/60 pt-4">
              <div className="text-xs text-muted-foreground">Signed in as</div>
              <div className="truncate serif text-lg">{name || "You"}</div>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <Link to="/dashboard" className="serif text-xl">Aidra</Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex overflow-x-auto border-b border-border/60 px-2 py-2">
            {NAV.map((n) => {
              const active = pathname === n.to || pathname.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex flex-none items-center gap-2 rounded-md px-3 py-2 text-sm",
                    active ? "bg-primary/10 text-primary" : "text-ink-muted",
                  )}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
