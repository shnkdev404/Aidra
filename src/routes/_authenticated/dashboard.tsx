import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageSquareText, LineChart, Stethoscope } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animated/FadeIn";
import { Button } from "@/components/ui/button";
import { listHealthRecords } from "@/lib/health.functions";
import { listThreads } from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Home — Aidra" }, { name: "robots", content: "noindex" }],
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
  const recentThreads = threads.data?.slice(0, 4) ?? [];

  function errorComponent(err: unknown, retry: () => void) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        {err instanceof Error ? err.message : "Something went wrong"}{" "}
        <button className="underline underline-offset-4" onClick={retry}>Retry</button>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <FadeIn>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 className="serif mt-3 text-5xl leading-tight md:text-6xl">
            Good to see you.
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Pick up a conversation, log where you are today, or open something new.
          </p>
        </FadeIn>

        {(records.error || threads.error) &&
          errorComponent(records.error ?? threads.error, () => { router.invalidate(); })}

        <StaggerChildren className="mt-12 grid gap-5 md:grid-cols-2">
          <StaggerItem>
            <Card
              icon={MessageSquareText}
              eyebrow="Chat"
              title="Talk to Aidra"
              body="Ask about a symptom, a habit, or a question you've been avoiding."
              to="/chat"
              cta="Open chat"
            />
          </StaggerItem>
          <StaggerItem>
            <Card
              icon={LineChart}
              eyebrow="BMI"
              title={latest ? `${latest.bmi} today` : "Log a BMI entry"}
              body={
                latest
                  ? `${records.data?.length} entries · latest ${new Date(latest.recorded_at).toLocaleDateString()}`
                  : "Height and weight — that's it. See your trend over time."
              }
              to="/health"
              cta={latest ? "See trend" : "Add entry"}
            />
          </StaggerItem>
          <StaggerItem>
            <Card
              icon={Stethoscope}
              eyebrow="Doctor"
              title="Become a verified doctor"
              body="Applying? Finish your license verification here."
              to="/doctor/verify"
              cta="Continue"
            />
          </StaggerItem>
          <StaggerItem>
            <div className="h-full rounded-xl border border-border/60 bg-card p-7">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recent conversations</div>
              <div className="mt-4 space-y-2">
                {threads.isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
                {recentThreads.length === 0 && !threads.isLoading && (
                  <div className="text-sm text-muted-foreground">
                    None yet. <Link to="/chat" className="text-primary underline underline-offset-4">Start one.</Link>
                  </div>
                )}
                {recentThreads.map((t) => (
                  <Link
                    key={t.id}
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    className="block truncate rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </div>
    </AppShell>
  );
}

function Card({
  icon: Icon,
  eyebrow,
  title,
  body,
  to,
  cta,
}: {
  icon: typeof MessageSquareText;
  eyebrow: string;
  title: string;
  body: string;
  to: "/chat" | "/health" | "/doctor/verify";
  cta: string;
}) {
  return (
    <div className="group h-full rounded-xl border border-border/60 bg-card p-7 transition-shadow hover:shadow-editorial">
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</div>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="serif mt-4 text-3xl leading-tight">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Button variant="ghost" size="sm" asChild className="mt-4 -ml-3 group-hover:text-primary">
        <Link to={to}>
          {cta} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </div>
  );
}
