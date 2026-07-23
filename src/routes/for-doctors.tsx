import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, FileCheck2, Stethoscope, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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
    <div className="bg-black text-white selection:bg-[#1DB954] selection:text-black">
      <SiteHeader variant="doctor" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-[#282828]">
        <div className="absolute top-0 right-1/3 h-96 w-96 rounded-full bg-[#8b5cf6]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#8b5cf6]">
            <BadgeCheck className="h-4 w-4" /> Verified Physician Network
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.08]">
            Practice with the <span className="text-[#1DB954]">clinical signal</span> you deserve.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[#b3b3b3]">
            Aidra connects verified clinicians with informed patients. One license review, zero credential noise, and authentic medical badges.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/doctor-auth"
              search={{ mode: "signup" }}
              className="flex items-center gap-2 rounded-full bg-[#1DB954] px-8 py-4 text-base font-extrabold text-black shadow-xl hover:scale-105 transition-all"
            >
              Apply for Doctor Verification <ArrowRight className="h-5 w-5 stroke-[3]" />
            </Link>

            <Link
              to="/doctor-auth"
              className="rounded-full bg-[#242424] border border-[#282828] px-8 py-4 text-base font-bold text-white hover:bg-[#2a2a2a] transition-all"
            >
              Doctor Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* VERIFICATION STEPS */}
      <section id="verification" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1DB954]">Verification Process</div>
          <h2 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
            Three simple steps to clinician verification.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-2xl bg-[#181818] p-8 border border-[#282828]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8b5cf6]/20 text-[#8b5cf6] mb-6">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-[#b3b3b3] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="border-t border-[#282828] bg-[#121212] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#1DB954]">Benefits</div>
            <h2 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
              Why physicians join Aidra.
            </h2>
          </div>

          <div className="space-y-4">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-4 rounded-xl bg-[#181818] p-5 border border-[#282828]">
                <ShieldCheck className="h-6 w-6 flex-none text-[#1DB954]" />
                <span className="text-base font-semibold text-white">{b}</span>
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
  "Distraction-free dark mode workspace optimized for clinical focus.",
  "Verified physician badge displayed across your Aidra profile.",
  "Complete privacy control over patient interactions.",
];
