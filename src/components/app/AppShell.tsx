import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home,
  MessageSquareText,
  LineChart,
  Stethoscope,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Library,
  Plus,
  Activity,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { listThreads } from "@/lib/chat.functions";
import { listHealthRecords } from "@/lib/health.functions";
import { useTheme } from "@/hooks/use-theme";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/chat", label: "AI Consultation", icon: MessageSquareText },
  { to: "/health", label: "BMI & Vitals", icon: LineChart },
  { to: "/doctor/verify", label: "Doctor Portal", icon: Stethoscope },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [name, setName] = useState<string>("");
  const [libraryFilter, setLibraryFilter] = useState<"all" | "chat" | "vitals">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const threads = useQuery({
    queryKey: ["chat-threads"],
    queryFn: () => listThreads(),
  });

  const records = useQuery({
    queryKey: ["health-records"],
    queryFn: () => listHealthRecords(),
  });

  const latestBmi = records.data?.[records.data.length - 1];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setName(
        (data.user?.user_metadata?.display_name as string | undefined) ??
          data.user?.email?.split("@")[0] ??
          "Guest User",
      );
    });
  }, []);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const recentThreads = threads.data?.slice(0, 6) ?? [];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-canvas text-ink selection:bg-primary selection:text-primary-foreground">
      {/* Main Container with Geist Dual Panel Layout */}
      <div className="flex flex-1 overflow-hidden p-3 gap-3">
        {/* Left Sidebar */}
        <aside className="hidden w-72 flex-col gap-3 md:flex">
          {/* Top Panel: Brand & Main Navigation */}
          <div className="rounded-xl border border-border bg-canvas-elevated p-4 shadow-whisper">
            <Link to="/dashboard" className="mb-6 flex items-center gap-2.5 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary text-primary-foreground shadow-xs">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight text-ink">Aidra</span>
              <span className="ml-auto rounded-[4px] border border-border bg-hairline-soft px-2 py-0.5 font-mono text-[10px] font-medium text-ink uppercase tracking-wider">
                PRO
              </span>
            </Link>

            <nav className="space-y-1">
              {NAV.map((n) => {
                const active = pathname === n.to || pathname.startsWith(n.to + "/");
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-hairline-soft text-ink font-semibold"
                        : "text-body hover:text-ink hover:bg-canvas",
                    )}
                  >
                    <n.icon className={cn("h-4 w-4", active ? "text-ink" : "text-mute")} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Panel: Your Health Library */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-canvas-elevated p-3 shadow-whisper">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2.5 text-body">
                <Library className="h-4 w-4 text-mute" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-ink">Health Library</span>
              </div>
              <Link
                to="/chat"
                className="flex h-7 w-7 items-center justify-center rounded-[6px] text-body border border-border hover:bg-canvas hover:text-ink transition-all"
                title="New Consultation"
              >
                <Plus className="h-4 w-4" />
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="mt-3 flex gap-1.5 px-1">
              {(["all", "chat", "vitals"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setLibraryFilter(f)}
                  className={cn(
                    "rounded-[64px] px-3 py-1 text-xs font-medium capitalize transition-all border",
                    libraryFilter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-canvas-elevated text-body border-border hover:bg-canvas hover:text-ink",
                  )}
                >
                  {f === "chat" ? "Consultations" : f}
                </button>
              ))}
            </div>

            {/* Scrollable Library Content */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-1 pr-1">
              {(libraryFilter === "all" || libraryFilter === "chat") && (
                <>
                  <div className="px-2 py-1 font-mono text-[10px] font-medium text-mute uppercase tracking-wider">
                    Recent Sessions
                  </div>
                  {recentThreads.length === 0 && (
                    <div className="px-3 py-3 text-xs text-mute">No recent consultations yet.</div>
                  )}
                  {recentThreads.map((t) => (
                    <Link
                      key={t.id}
                      to="/chat/$threadId"
                      params={{ threadId: t.id }}
                      className={cn(
                        "group flex items-center gap-3 rounded-[6px] p-2 hover:bg-canvas border border-transparent transition-all",
                        pathname.includes(t.id) && "bg-hairline-soft border-border",
                      )}
                    >
                      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[6px] border border-border bg-canvas text-ink group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <MessageSquareText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-ink">
                          {t.title}
                        </div>
                        <div className="font-mono text-[10px] text-mute">AI THREAD</div>
                      </div>
                    </Link>
                  ))}
                </>
              )}

              {(libraryFilter === "all" || libraryFilter === "vitals") && latestBmi && (
                <div className="mt-2">
                  <div className="px-2 py-1 font-mono text-[10px] font-medium text-mute uppercase tracking-wider">
                    Vitals Overview
                  </div>
                  <Link
                    to="/health"
                    className="flex items-center gap-3 rounded-[6px] p-2 hover:bg-canvas border border-transparent hover:border-border transition-all"
                  >
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[6px] border border-[#d3e5ff] bg-[#d3e5ff]/30 text-[#0070f3]">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-ink">BMI Score: {latestBmi.bmi}</div>
                      <div className="text-[11px] text-mute">
                        Recorded {new Date(latestBmi.recorded_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content View with Top Bar & Scroll Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-canvas-elevated shadow-whisper">
          {/* Top Bar Header */}
          <header className="flex h-14 items-center justify-between px-6 bg-canvas-elevated border-b border-border sticky top-0 z-20">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => window.history.back()}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-canvas-elevated text-body hover:bg-canvas hover:text-ink transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => window.history.forward()}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-canvas-elevated text-body hover:bg-canvas hover:text-ink transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mute" />
                <input
                  type="text"
                  placeholder="Explore health topics or ask AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate({ to: "/chat" });
                    }
                  }}
                  className="w-full rounded-[6px] border border-border bg-canvas py-1.5 pl-9 pr-3 text-xs text-ink placeholder-mute outline-none focus:bg-canvas-elevated focus:border-ink transition-all"
                />
              </div>
            </div>

            {/* Profile Avatar, Theme Switcher & Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-border bg-canvas-elevated text-body hover:text-ink hover:bg-hairline-soft transition-all"
                title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <Link
                to="/doctor/verify"
                className="hidden rounded-[6px] border border-border bg-canvas-elevated px-3 py-1.5 text-xs font-medium text-ink hover:bg-canvas transition-colors md:block"
              >
                Doctor Portal
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-border bg-canvas p-1 pl-2.5 pr-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-[11px]">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate text-xs font-medium text-ink hidden sm:inline">
                  {name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full text-mute hover:text-ink hover:bg-border"
                  onClick={handleSignOut}
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Scrollable View */}
          <main className="flex-1 overflow-y-auto bg-canvas p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Persistent Bottom Health Status Bar */}
      <footer className="h-12 bg-canvas-elevated border-t border-border px-6 flex items-center justify-between z-30 text-xs">
        {/* Left: Active Medical AI Core */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-canvas">
            <Sparkles className="h-3.5 w-3.5 text-[#0070f3]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0070f3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0070f3]"></span>
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-ink flex items-center gap-2">
              Aidra Clinical AI Engine
              <span className="font-mono rounded-[4px] border border-[#d3e5ff] bg-[#d3e5ff]/40 px-1.5 py-0.2 text-[10px] font-medium text-[#0070f3]">
                READY
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Action Button */}
        <div className="hidden sm:flex items-center">
          <Link
            to="/chat"
            className="flex items-center gap-2 rounded-[6px] bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-xs hover:opacity-90 transition-all"
          >
            Start New AI Consultation <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Right: Quick Vitals Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-[6px] border border-border bg-canvas px-2.5 py-1 text-xs">
            <Activity className="h-3.5 w-3.5 text-[#0070f3]" />
            <span className="font-medium text-ink">
              {latestBmi ? `BMI: ${latestBmi.bmi}` : "Vitals Active"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
