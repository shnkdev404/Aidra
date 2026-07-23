import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        {/* Geist Hero Banner Header */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-canvas-elevated p-8 shadow-whisper">
          <div className="relative z-10">
            <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">
              <Sparkles className="h-3.5 w-3.5" /> AI HEALTH COMMAND
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tighter text-ink sm:text-4xl">
              {greeting}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-body">
              Your personalized medical intelligence hub. Start an AI consultation, track physical vitals, or access verified clinician tools.
            </p>
          </div>
        </div>

        {/* Top 6 Shortcut Grid */}
        <div>
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-mute mb-3">QUICK ACCESS</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ShortcutCard
              title="Start AI Consultation"
              subtitle="24/7 Clinical Companion"
              to="/chat"
              icon={MessageSquareText}
            />
            <ShortcutCard
              title={latest ? `BMI Score: ${latest.bmi}` : "Log BMI Entry"}
              subtitle={latest ? `Recorded ${new Date(latest.recorded_at).toLocaleDateString()}` : "Track height & weight"}
              to="/health"
              icon={LineChart}
            />
            <ShortcutCard
              title="Doctor Verification"
              subtitle="Medical Provider Portal"
              to="/doctor/verify"
              icon={Stethoscope}
            />
            <ShortcutCard
              title="Symptom Checker"
              subtitle="Diagnostic Guidance"
              to="/chat"
              icon={Activity}
            />
            <ShortcutCard
              title="Mental Health & Rest"
              subtitle="Wellness Telemetry"
              to="/chat"
              icon={Brain}
            />
            <ShortcutCard
              title="Medication & Habits"
              subtitle="Daily Routine Tracker"
              to="/chat"
              icon={Pill}
            />
          </div>
        </div>

        {/* Section: Suggested Health Modules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-xs font-medium uppercase tracking-wider text-mute">SUGGESTED MODULES</div>
            <Link to="/chat" className="text-xs font-medium text-[#0070f3] hover:underline">
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <ModuleCard
              title="Symptom Check"
              description="Get instant AI insights on acute symptoms"
              icon={Heart}
              to="/chat"
            />
            <ModuleCard
              title="BMI & Fitness"
              description="Monitor body mass index and health trend charts"
              icon={LineChart}
              to="/health"
            />
            <ModuleCard
              title="Physician Portal"
              description="Submit medical license for doctor verification"
              icon={ShieldCheck}
              to="/doctor/verify"
            />
            <ModuleCard
              title="Nutrition Guide"
              description="Personalized dietary advice and meal planning"
              icon={Sparkles}
              to="/chat"
            />
            <ModuleCard
              title="Lab Test Explainer"
              description="Understand blood test results and terms"
              icon={Brain}
              to="/chat"
            />
          </div>
        </div>

        {/* Section: Recent Consultations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-xs font-medium uppercase tracking-wider text-mute">RECENT CONSULTATIONS</div>
            <Link to="/chat" className="text-xs font-medium text-[#0070f3] hover:underline">
              View all threads
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-canvas-elevated p-2 shadow-whisper space-y-1">
            {threads.isLoading && (
              <div className="p-4 text-center text-xs text-mute">Loading consultations…</div>
            )}
            {recentThreads.length === 0 && !threads.isLoading && (
              <div className="p-6 text-center text-xs text-mute">
                No consultation history yet.{" "}
                <Link to="/chat" className="text-[#0070f3] hover:underline font-medium">
                  Start your first chat.
                </Link>
              </div>
            )}
            {recentThreads.map((t, idx) => (
              <Link
                key={t.id}
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="group flex items-center justify-between rounded-[6px] p-3 hover:bg-canvas transition-all border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-5 text-center font-mono text-xs font-medium text-mute">
                    0{idx + 1}
                  </span>

                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[6px] border border-border bg-canvas text-ink group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <MessageSquareText className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-ink">
                      {t.title}
                    </div>
                    <div className="font-mono text-[10px] text-mute">AIDRA AI THREAD</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-mute">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                  <ChevronRight className="h-4 w-4 text-mute group-hover:text-ink" />
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
}: {
  title: string;
  subtitle: string;
  to: string;
  icon: typeof MessageSquareText;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3.5 rounded-xl border border-border bg-canvas-elevated p-3 pr-4 shadow-whisper hover:border-body transition-all"
    >
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[6px] border border-border bg-canvas text-ink group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-ink">
          {title}
        </div>
        <div className="truncate text-[11px] text-mute">{subtitle}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-mute group-hover:text-ink transition-colors" />
    </Link>
  );
}

function ModuleCard({
  title,
  description,
  icon: Icon,
  to,
}: {
  title: string;
  description: string;
  icon: typeof Heart;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-border bg-canvas-elevated p-4 shadow-whisper hover:border-body transition-all"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[6px] border border-border bg-canvas text-ink group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div className="truncate text-xs font-medium text-ink">{title}</div>
      <div className="mt-1 line-clamp-2 text-[11px] text-mute leading-relaxed">{description}</div>
    </Link>
  );
}
