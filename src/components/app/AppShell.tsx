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
  Play,
  Pause,
  Volume2,
  Activity,
  Sparkles,
  User,
  HeartPulse,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { listThreads } from "@/lib/chat.functions";
import { listHealthRecords } from "@/lib/health.functions";

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
  const [name, setName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
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
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-black text-white selection:bg-[#1DB954] selection:text-black">
      {/* Main Container with Dual Sidebar Layout */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {/* Left Sidebar */}
        <aside className="hidden w-72 flex-col gap-2 md:flex">
          {/* Top Panel: Brand & Main Navigation */}
          <div className="rounded-xl bg-[#121212] p-4">
            <Link to="/dashboard" className="mb-6 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DB954] text-black font-extrabold shadow-lg shadow-[#1DB954]/20">
                <HeartPulse className="h-5 w-5 fill-black" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Aidra</span>
              <span className="ml-auto rounded-full bg-[#1DB954]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1DB954] border border-[#1DB954]/20">
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
                      "flex items-center gap-4 rounded-md px-3 py-3 text-sm font-semibold transition-all duration-200",
                      active
                        ? "bg-[#282828] text-white"
                        : "text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]",
                    )}
                  >
                    <n.icon className={cn("h-5 w-5", active ? "text-[#1DB954]" : "text-[#b3b3b3]")} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Panel: Your Health Library */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-[#121212] p-3">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer">
                <Library className="h-5 w-5" />
                <span className="text-sm font-bold">Your Health Library</span>
              </div>
              <Link
                to="/chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#b3b3b3] hover:bg-[#282828] hover:text-white transition-all"
                title="New Consultation"
              >
                <Plus className="h-5 w-5" />
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="mt-3 flex gap-2 px-1">
              {(["all", "chat", "vitals"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setLibraryFilter(f)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all",
                    libraryFilter === f
                      ? "bg-white text-black"
                      : "bg-[#232323] text-white hover:bg-[#2a2a2a]",
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
                  <div className="px-2 py-1 text-[11px] font-bold text-[#a7a7a7] uppercase tracking-wider">
                    Recent Sessions
                  </div>
                  {recentThreads.length === 0 && (
                    <div className="px-3 py-4 text-xs text-[#a7a7a7]">No recent consultations yet.</div>
                  )}
                  {recentThreads.map((t) => (
                    <Link
                      key={t.id}
                      to="/chat/$threadId"
                      params={{ threadId: t.id }}
                      className={cn(
                        "group flex items-center gap-3 rounded-md p-2 hover:bg-[#1a1a1a] transition-all",
                        pathname.includes(t.id) && "bg-[#282828]",
                      )}
                    >
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-[#242424] text-[#1DB954] group-hover:bg-[#1DB954] group-hover:text-black transition-colors">
                        <MessageSquareText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-white group-hover:text-[#1DB954] transition-colors">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-[#a7a7a7]">AI Thread</div>
                      </div>
                    </Link>
                  ))}
                </>
              )}

              {(libraryFilter === "all" || libraryFilter === "vitals") && latestBmi && (
                <div className="mt-2">
                  <div className="px-2 py-1 text-[11px] font-bold text-[#a7a7a7] uppercase tracking-wider">
                    Vitals Overview
                  </div>
                  <Link
                    to="/health"
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-[#1a1a1a] transition-all"
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-[#3b82f6]/20 text-[#3b82f6]">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white">BMI Score: {latestBmi.bmi}</div>
                      <div className="text-[11px] text-[#a7a7a7]">
                        Updated {new Date(latestBmi.recorded_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content View with Top Bar & Scroll Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-[#121212]">
          {/* Top Bar Header */}
          <header className="flex h-16 items-center justify-between px-6 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-20 border-b border-[#282828]/50">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.history.back()}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-[#b3b3b3] hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => window.history.forward()}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-[#b3b3b3] hover:text-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a7a7a7]" />
                <input
                  type="text"
                  placeholder="What health topic do you want to explore?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate({ to: "/chat" });
                    }
                  }}
                  className="w-full rounded-full bg-[#242424] py-2 pl-10 pr-4 text-xs text-white placeholder-[#a7a7a7] outline-none ring-1 ring-transparent focus:ring-[#1DB954] transition-all"
                />
              </div>
            </div>

            {/* Profile Avatar & Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/doctor/verify"
                className="hidden rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black hover:scale-105 transition-transform md:block"
              >
                Doctor Portal
              </Link>

              <div className="flex items-center gap-2 rounded-full bg-black/60 p-1 pl-3 pr-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954] text-black font-bold text-xs">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate text-xs font-semibold text-white hidden sm:inline">
                  {name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full text-[#a7a7a7] hover:text-white"
                  onClick={handleSignOut}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Scrollable View */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#181818] via-[#121212] to-[#121212] p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Health Playback Bar */}
      <footer className="h-20 bg-black border-t border-[#282828] px-4 flex items-center justify-between z-30">
        {/* Left: Active Health Session Info */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-md bg-[#181818] border border-[#282828]">
            <Sparkles className="h-6 w-6 text-[#1DB954]" />
            {isPlaying && (
              <span className="absolute bottom-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white hover:underline cursor-pointer flex items-center gap-2">
              Aidra AI Medical Core
              <span className="inline-block h-2 w-2 rounded-full bg-[#1DB954]" />
            </div>
            <div className="text-[11px] text-[#a7a7a7] flex items-center gap-2">
              {isPlaying ? "Streaming AI Consultation..." : "Ready for new session"}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-col items-center gap-1 max-w-md w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DB954] text-black hover:scale-105 transition-transform"
              title={isPlaying ? "Pause Session" : "Play Session"}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-black" /> : <Play className="h-5 w-5 fill-black ml-0.5" />}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-sm">
            <span className="text-[10px] text-[#a7a7a7]">0:00</span>
            <div className="h-1 flex-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className="h-full bg-white hover:bg-[#1DB954] transition-colors"
                style={{ width: isPlaying ? "65%" : "0%" }}
              />
            </div>
            <span className="text-[10px] text-[#a7a7a7]">LIVE</span>
          </div>
        </div>

        {/* Right: Quick Vitals Indicator */}
        <div className="hidden md:flex items-center gap-3 min-w-[200px] justify-end">
          <Activity className="h-4 w-4 text-[#1DB954]" />
          <span className="text-xs font-semibold text-white">
            {latestBmi ? `BMI ${latestBmi.bmi}` : "Vitals Active"}
          </span>
          <Volume2 className="h-4 w-4 text-[#a7a7a7]" />
        </div>
      </footer>
    </div>
  );
}
