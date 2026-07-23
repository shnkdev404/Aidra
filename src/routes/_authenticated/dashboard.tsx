import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  MessageSquareText,
  LineChart,
  Stethoscope,
  Sparkles,
  Activity,
  Heart,
  Brain,
  Pill,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { listHealthRecords } from "@/lib/health.functions";
import { listThreads } from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Home — Aidra Health" }, { name: "robots", content: "noindex" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const router = useRouter();
  const records = useQuery({
    queryKey: ["health-records"],
    queryFn: () => listHealthRecords(),
  });
  const threads = useQuery({
    queryKey: ["chat-threads"],
    queryFn: () => listThreads(),
  });

  const latest = records.data?.[records.data.length - 1];
  const recentThreads = threads.data?.slice(0, 6) ?? [];

  // Dynamic time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        {/* Hero Banner Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1DB954]/20 via-[#181818] to-[#121212] p-8 border border-[#282828]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1DB954]">
              <Sparkles className="h-4 w-4" /> AI Health Command
            </div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {greeting}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[#b3b3b3]">
              Your personalized medical intelligence hub. Start a consultation, check your vitals, or connect with verified professionals.
            </p>
          </div>
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#1DB954]/10 blur-3xl" />
        </div>

        {/* Top 6 Shortcut Grid */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-white tracking-tight">Quick Access</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ShortcutCard
              title="Start AI Consultation"
              subtitle="24/7 Medical Companion"
              to="/chat"
              icon={MessageSquareText}
              color="bg-[#1DB954]"
            />
            <ShortcutCard
              title={latest ? `BMI Score: ${latest.bmi}` : "Log BMI Entry"}
              subtitle={latest ? `Recorded ${new Date(latest.recorded_at).toLocaleDateString()}` : "Track height & weight"}
              to="/health"
              icon={LineChart}
              color="bg-[#3b82f6]"
            />
            <ShortcutCard
              title="Doctor Verification"
              subtitle="Medical Provider Portal"
              to="/doctor/verify"
              icon={Stethoscope}
              color="bg-[#8b5cf6]"
            />
            <ShortcutCard
              title="Symptom Checker"
              subtitle="Instant Diagnostic Guidance"
              to="/chat"
              icon={Activity}
              color="bg-[#f59e0b]"
            />
            <ShortcutCard
              title="Mental Health & Rest"
              subtitle="Wellness Advisor"
              to="/chat"
              icon={Brain}
              color="bg-[#ec4899]"
            />
            <ShortcutCard
              title="Medication & Habits"
              subtitle="Daily Routine Tracker"
              to="/chat"
              icon={Pill}
              color="bg-[#14b8a6]"
            />
          </div>
        </div>

        {/* Section: Made for Your Health (Module Grid) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Suggested Health Modules</h2>
            <Link to="/chat" className="text-xs font-bold text-[#b3b3b3] hover:text-white transition-colors">
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <ModuleCard
              title="General Symptom Check"
              description="Get instant AI insights on acute or chronic symptoms"
              icon={Heart}
              bgGradient="from-emerald-600 to-teal-900"
              to="/chat"
            />
            <ModuleCard
              title="BMI & Fitness Goal"
              description="Monitor body mass index and health trend charts"
              icon={LineChart}
              bgGradient="from-blue-600 to-indigo-900"
              to="/health"
            />
            <ModuleCard
              title="Verified Physician"
              description="Submit your medical license for physician verification"
              icon={ShieldCheck}
              bgGradient="from-purple-600 to-violet-900"
              to="/doctor/verify"
            />
            <ModuleCard
              title="Nutrition Guide"
              description="Personalized dietary advice and meal planning"
              icon={Sparkles}
              bgGradient="from-amber-600 to-orange-900"
              to="/chat"
            />
            <ModuleCard
              title="Lab Test Explainer"
              description="Understand blood test results and medical terms"
              icon={Brain}
              bgGradient="from-rose-600 to-pink-900"
              to="/chat"
            />
          </div>
        </div>

        {/* Section: Recent Consultations (Track List) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Consultations</h2>
            <Link to="/chat" className="text-xs font-bold text-[#b3b3b3] hover:text-white transition-colors">
              View all threads
            </Link>
          </div>

          <div className="rounded-xl bg-[#181818] p-4 border border-[#282828]/60 space-y-2">
            {threads.isLoading && (
              <div className="p-4 text-center text-sm text-[#b3b3b3]">Loading consultations…</div>
            )}
            {recentThreads.length === 0 && !threads.isLoading && (
              <div className="p-6 text-center text-sm text-[#b3b3b3]">
                No consultation history yet.{" "}
                <Link to="/chat" className="text-[#1DB954] hover:underline font-semibold">
                  Start your first chat.
                </Link>
              </div>
            )}
            {recentThreads.map((t, idx) => (
              <Link
                key={t.id}
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="group flex items-center justify-between rounded-lg p-3 hover:bg-[#282828] transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-4 text-center text-xs font-bold text-[#b3b3b3] group-hover:hidden">
                    {idx + 1}
                  </span>
                  <Play className="h-4 w-4 text-[#1DB954] fill-[#1DB954] hidden group-hover:block" />

                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-[#242424] text-[#1DB954]">
                    <MessageSquareText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white group-hover:text-[#1DB954] transition-colors">
                      {t.title}
                    </div>
                    <div className="text-xs text-[#a7a7a7]">AIDRA Medical Thread</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#a7a7a7]">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#a7a7a7] group-hover:text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ShortcutCard({
  title,
  subtitle,
  to,
  icon: Icon,
  color,
}: {
  title: string;
  subtitle: string;
  to: string;
  icon: typeof MessageSquareText;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-4 overflow-hidden rounded-md bg-[#282828]/60 p-2 pr-4 transition-all duration-300 hover:bg-[#282828] shadow-md"
    >
      <div className={`flex h-14 w-14 flex-none items-center justify-center rounded-md ${color} text-black font-bold shadow-md`}>
        <Icon className="h-7 w-7 text-black" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-white group-hover:text-[#1DB954] transition-colors">
          {title}
        </div>
        <div className="truncate text-xs text-[#a7a7a7]">{subtitle}</div>
      </div>
      <div className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <Play className="h-5 w-5 fill-black ml-0.5" />
      </div>
    </Link>
  );
}

function ModuleCard({
  title,
  description,
  icon: Icon,
  bgGradient,
  to,
}: {
  title: string;
  description: string;
  icon: typeof Heart;
  bgGradient: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl bg-[#181818] p-4 transition-all duration-300 hover:bg-[#282828] shadow-lg hover:-translate-y-1"
    >
      <div className={`relative mb-4 flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-br ${bgGradient} text-white shadow-md overflow-hidden`}>
        <Icon className="h-12 w-12" />
        <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Play className="h-5 w-5 fill-black ml-0.5" />
        </div>
      </div>
      <div className="truncate text-sm font-bold text-white group-hover:underline">{title}</div>
      <div className="mt-1 line-clamp-2 text-xs text-[#a7a7a7]">{description}</div>
    </Link>
  );
}
