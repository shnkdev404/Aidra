import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, MessageSquareText, LineChart, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animated/FadeIn";
import { AuroraBackdrop } from "@/components/animated/AuroraBackdrop";
import { ShinyText } from "@/components/animated/ShinyText";
import { Magnetic } from "@/components/animated/Magnetic";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aidra — Your calm, always-on health companion" },
      {
        name: "description",
        content:
          "AI health guidance, BMI tracking, and verified doctors — in one unhurried place. Free to start.",
      },
      { property: "og:title", content: "Aidra — Your calm, always-on health companion" },
      {
        property: "og:description",
        content: "AI health guidance, BMI tracking, and verified doctors, in one place.",
      },
    ],
  }),
  component: PatientLanding,
});

function PatientLanding() {
  return (
    <div className="bg-paper text-ink">
      <SiteHeader variant="patient" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <AuroraBackdrop />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-28">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-paper-soft/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Now in early access
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1 className="serif mt-6 max-w-3xl text-balance text-5xl leading-[1.05] md:text-7xl">
              A quieter way to <em className="italic">tend</em> to your{" "}
              <ShinyText>health.</ShinyText>
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 max-w-xl text-lg text-ink-muted">
              Aidra is an AI health companion that listens carefully, explains gently, and keeps
              your BMI and health story in one calm, private place — with real, verified doctors
              a step away.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Button size="lg" asChild className="group h-12 gap-2 px-6">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Start free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </Magnetic>
              <Button size="lg" variant="ghost" asChild className="h-12 px-4">
                <Link to="/for-doctors">I'm a doctor →</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Bank-grade privacy · Not medical advice · You always own your data
            </p>
          </FadeIn>

          {/* Editorial preview card */}
          <FadeIn delay={0.45}>
            <div className="relative mt-16 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-editorial">
              <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
                <div className="border-b border-border/60 p-8 md:border-b-0 md:border-r">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    A conversation
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary p-4 text-sm">
                      I've had a dull headache for two days and I'm feeling foggy. Not sleeping well.
                    </div>
                    <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-primary/8 border border-primary/15 p-4 text-sm">
                      That sounds tiring. A few things can cause this together — dehydration,
                      screen strain, or unsettled sleep. Before anything else, how much water
                      did you have yesterday, and did you nap in the afternoon?
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Your BMI, tracked
                  </div>
                  <div className="mt-4">
                    <div className="serif text-5xl">22.4</div>
                    <div className="mt-1 text-sm text-muted-foreground">Healthy range</div>
                  </div>
                  <div className="mt-6 flex h-24 items-end gap-1.5">
                    {[40, 55, 48, 62, 58, 68, 72, 65, 74, 70, 78, 82].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary/80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Last 12 entries</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <FadeIn>
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              What's inside
            </div>
            <h2 className="serif mt-3 text-4xl md:text-5xl">
              Everything you'd ask a very patient friend who happens to have read the whole library.
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-6 md:grid-cols-2">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <FeatureCard {...f} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* HOW */}
      <section id="how" className="border-t border-border/60 bg-paper-soft/60">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <h2 className="serif text-4xl md:text-5xl">Three unhurried steps.</h2>
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="rounded-xl border border-border/60 bg-card p-7">
                  <div className="serif text-6xl text-gold/70">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-4 serif text-2xl">{s.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* DOCTOR CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-ink p-10 text-paper md:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: "radial-gradient(oklch(0.75 0.13 82) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-paper/60">
                  For clinicians
                </div>
                <h2 className="serif mt-3 text-4xl leading-[1.05] md:text-5xl">
                  A verified space that respects your license — and your time.
                </h2>
              </div>
              <div className="flex md:justify-end">
                <Magnetic>
                  <Button asChild size="lg" variant="secondary" className="h-12 px-6">
                    <Link to="/for-doctors">
                      Explore for doctors <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <SiteFooter />
    </div>
  );
}

const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Conversations that pause before they answer.",
    body: "Ask what's on your mind. Aidra listens for context — sleep, stress, medication — before it responds.",
  },
  {
    icon: LineChart,
    title: "BMI, tracked kindly over time.",
    body: "Log height and weight in seconds. See the trend, not just the number, on a quiet, honest chart.",
  },
  {
    icon: HeartPulse,
    title: "Your health, in one place.",
    body: "A gentle home for the conversations, entries, and updates you'd rather not scatter across apps.",
  },
  {
    icon: ShieldCheck,
    title: "Verified doctors, when you need one.",
    body: "Every clinician on Aidra passes a paid license review. No noise, no fake credentials.",
  },
];

const STEPS = [
  { title: "Sign in", body: "Email or Google. We keep it simple and secure — no passwords in the clear." },
  { title: "Say hello", body: "Tell Aidra what's going on. It replies like a person who read carefully." },
  { title: "Come back", body: "Your BMI trend, past conversations, and notes wait quietly for you." },
];

function FeatureCard({ icon: Icon, title, body }: (typeof FEATURES)[number]) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-7 transition-shadow hover:shadow-editorial">
      <div className="flex items-start gap-5">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="serif text-2xl leading-tight">{title}</div>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}
