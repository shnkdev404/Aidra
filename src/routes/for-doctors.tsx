import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, FileCheck2, Stethoscope, ArrowRight, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/for-doctors")({
  head: () => ({
    meta: [
      { title: "Doctor Portal & License Verification — Aidra" },
      {
        name: "description",
        content: "Join Aidra as a verified clinician. Manual medical license review and authentic doctor badges.",
      },
    ],
  }),
  component: DoctorLanding,
});

function DoctorLanding() {
  return (
    <div className="bg-canvas text-ink selection:bg-primary selection:text-primary-foreground min-h-screen">
      <SiteHeader variant="doctor" />

      {/* HERO SECTION WITH MESH GRADIENT */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-border bg-canvas bg-geist-mesh">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-elevated px-3.5 py-1 text-xs font-mono font-medium text-ink shadow-xs">
            <BadgeCheck className="h-3.5 w-3.5 text-[#0070f3]" />
            <span>VERIFIED PHYSICIAN NETWORK v2.0</span>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tighter text-ink sm:text-7xl leading-[1.05]">
            Practice with clinical signal. <br />
            <span className="geist-gradient-brand">Zero credential noise.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-body leading-relaxed">
            Aidra connects verified clinicians with informed patients. One license review, verified medical badges, and pre-organized AI symptom telemetry.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/doctor-auth"
              search={{ mode: "signup" }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Apply for Doctor Verification <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/doctor-auth"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-elevated px-7 py-3.5 text-sm font-medium text-ink shadow-xs hover:bg-canvas transition-all"
            >
              Doctor Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* VERIFICATION STEPS */}
      <section id="verification" className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-3xl">
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">VERIFICATION PROCESS</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tighter text-ink sm:text-5xl">
            Three simple steps to clinician verification.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-canvas-elevated p-8 shadow-whisper">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-border bg-canvas text-ink mb-6">
                <s.icon className="h-5 w-5 text-[#0070f3]" />
              </div>
              <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-body leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="border-t border-border bg-canvas py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div>
            <div className="font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">PLATFORM ADVANTAGES</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tighter text-ink sm:text-5xl">
              Why physicians join Aidra.
            </h2>
          </div>

          <div className="space-y-4">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-4 rounded-xl border border-border bg-canvas-elevated p-5 shadow-whisper">
                <ShieldCheck className="h-5 w-5 flex-none text-[#0070f3]" />
                <span className="text-sm font-medium text-ink">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const STEPS = [
  {
    icon: FileCheck2,
    title: "Submit License Details",
    body: "Provide your full name, medical license number, specialty, and state/country of practice.",
  },
  {
    icon: BadgeCheck,
    title: "Board Review",
    body: "Our team verifies your credentials directly with state and national medical licensing boards.",
  },
  {
    icon: Stethoscope,
    title: "Verified Physician Badge",
    body: "Receive your verified clinician status on Aidra with patient consultation privileges.",
  },
];

const BENEFITS = [
  "Patients arrive informed with pre-organized AI symptom notes.",
  "Stark black-on-white developer interface optimized for clinical focus.",
  "Verified physician badge displayed across your Aidra profile.",
  "Complete privacy control over patient interactions.",
];
