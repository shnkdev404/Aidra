import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquareText, LineChart, ShieldCheck, Sparkles, Activity, Cpu } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aidra — Developer-Grade AI Health Platform & Verified Physicians" },
      {
        name: "description",
        content:
          "AI clinical intelligence, BMI vitals analytics, and verified doctor workflows in a stark Geist developer-platform aesthetic.",
      },
    ],
  }),
  component: PatientLanding,
});

function PatientLanding() {
  return (
    <div className="bg-canvas text-ink selection:bg-primary selection:text-primary-foreground min-h-screen">
      <SiteHeader variant="patient" />

      {/* GEIST HERO SECTION WITH MESH GRADIENT */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-border bg-canvas bg-geist-mesh">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-elevated px-3.5 py-1 text-xs font-mono font-medium text-ink shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#0070f3]" />
            <span>AIDRA MEDICAL PLATFORM v2.0</span>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tighter text-ink sm:text-7xl leading-[1.05]">
            Clinical intelligence. <br />
            <span className="geist-gradient-brand">Engineered for human health.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-body leading-relaxed">
            Real-time AI symptom analysis, quantitative BMI vitals tracking, and verified physician access — built inside a stark black-on-white developer interface.
          </p>

          {/* DUAL BUTTON SYSTEM: MARKETING PILLS */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Start Consultation <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/for-doctors"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-elevated px-7 py-3.5 text-sm font-medium text-ink shadow-xs hover:bg-canvas transition-all"
            >
              For Physicians & Doctors
            </Link>
          </div>

          <div className="mt-8 font-mono text-xs text-mute uppercase tracking-wider flex items-center gap-4 flex-wrap">
            <span><span>🔒</span> HIPAA COMPLIANT</span>
            <span>•</span>
            <span>VERIFIED DOCTOR NETWORK</span>
            <span>•</span>
            <span>ZERO DATA RETENTION</span>
          </div>

          {/* INTERACTIVE GEIST PREVIEW CARD */}
          <div className="relative mt-16 overflow-hidden rounded-xl border border-border bg-canvas-elevated shadow-floating">
            <div className="grid md:grid-cols-2">
              <div className="border-b border-border p-8 md:border-b-0 md:border-r">
                <div className="flex items-center justify-between font-mono text-xs font-medium uppercase tracking-wider text-mute">
                  <span className="flex items-center gap-2 text-ink">
                    <Cpu className="h-4 w-4 text-[#0070f3]" />
                    AI CLINICAL STREAM
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-[#0070f3] animate-pulse" />
                </div>
                <div className="mt-6 space-y-4 font-mono text-xs">
                  <div className="rounded-[6px] border border-border bg-canvas p-4 text-body">
                    "Exertional shortness of breath with mild retrosternal tightness following running."
                  </div>
                  <div className="rounded-[6px] border border-[#d3e5ff] bg-[#d3e5ff]/20 p-4 text-ink">
                    <div className="mb-2 font-mono text-[11px] font-medium text-[#0070f3] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> AIDRA CLINICAL DIAGNOSTIC
                    </div>
                    Differential diagnosis includes exercise-induced bronchospasm vs exertion-related cardiac strain. Recommend baseline ECG and vitals log.
                  </div>
                </div>
              </div>

              <div className="p-8 bg-canvas">
                <div className="flex items-center justify-between font-mono text-xs font-medium uppercase tracking-wider text-mute">
                  <span>VITALS MONITOR</span>
                  <Activity className="h-4 w-4 text-[#0070f3]" />
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-semibold tracking-tighter text-ink">22.4</div>
                  <div className="mt-1 font-mono text-xs font-medium text-[#0070f3]">HEALTHY BMI INDEX</div>
                </div>
                <div className="mt-8 flex h-24 items-end gap-1.5">
                  {[35, 45, 52, 60, 55, 68, 75, 70, 82, 78, 88, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[2px] bg-ink transition-all hover:bg-[#0070f3]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 font-mono text-[11px] text-mute">Quantitative log · 12 historical entries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO / TRUST STRIP */}
      <div className="border-b border-border bg-canvas py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-8 font-mono text-xs text-mute">
          <span>TRUSTED BY LEADING CLINICAL RESEARCHERS</span>
          <span className="font-semibold text-ink">HARVARD MED</span>
          <span className="font-semibold text-ink">STANFORD HEALTH</span>
          <span className="font-semibold text-ink">MAYO CLINIC</span>
          <span className="font-semibold text-ink">JOHNS HOPKINS</span>
        </div>
      </div>

      {/* FEATURES SECTION (HAIRLINE CARDS GRID) */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-3xl">
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">CAPABILITIES</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tighter text-ink sm:text-5xl">
            Engineered precision. Built like documentation.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-canvas-elevated p-8 shadow-whisper hover:border-body transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border bg-canvas text-ink group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-6">
                <div className="font-mono text-[11px] font-medium text-mute uppercase tracking-wider">{f.eyebrow}</div>
                <h3 className="mt-1 text-xl font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-body leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS SECTION */}
      <section id="how" className="border-t border-border bg-canvas py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">WORKFLOW</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tighter text-ink sm:text-5xl">Three-step clinical flow</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-border bg-canvas-elevated p-8 shadow-whisper">
                <div className="font-mono text-3xl font-bold tracking-tighter text-ink">0{i + 1}</div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-body leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTOR BANNER SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-xl border border-border bg-canvas-elevated p-10 shadow-floating">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">
                PHYSICIAN PORTAL
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Are you a licensed medical doctor?
              </h2>
              <p className="mt-2 text-sm text-body">
                Verify your credentials and access the Aidra clinician platform and patient review console.
              </p>
            </div>
            <Link
              to="/for-doctors"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Doctor Verification <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const FEATURES = [
  {
    icon: MessageSquareText,
    eyebrow: "SPEC // 01",
    title: "AI Medical Consultation Stream",
    body: "Streamed responses for symptom diagnosis, medication questions, and health advice powered by Gemini Medical.",
  },
  {
    icon: LineChart,
    eyebrow: "SPEC // 02",
    title: "Quantitative Vitals Analytics",
    body: "Log height and weight entries effortlessly and watch your physical health trend across clean interactive health charts.",
  },
  {
    icon: Cpu,
    eyebrow: "SPEC // 03",
    title: "All-in-One Health Hub",
    body: "Keep your consultation threads, health records, and physician notes securely stored in your personal library.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "SPEC // 04",
    title: "Verified Physician Network",
    body: "Every doctor on Aidra undergoes manual license verification to guarantee authentic clinical expertise.",
  },
];

const STEPS = [
  { title: "Sign Up in Seconds", body: "Quick sign-in with Google or Email. Your health data stays completely private." },
  { title: "Ask Aidra Anything", body: "Describe your symptoms or health queries and receive instant, structured AI explanations." },
  { title: "Track Vitals Over Time", body: "Log your weight and BMI to view progress charts and health trends." },
];
