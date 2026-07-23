import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, MessageSquareText, LineChart, ShieldCheck, Play, Sparkles, Activity } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aidra — Always-On AI Health & Verified Doctors" },
      {
        name: "description",
        content:
          "AI health guidance, BMI tracking, and verified doctors in one sleek dark workspace. Free to start.",
      },
    ],
  }),
  component: PatientLanding,
});

function PatientLanding() {
  return (
    <div className="bg-black text-white selection:bg-[#1DB954] selection:text-black">
      <SiteHeader variant="patient" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-[#282828]">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#1DB954]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1DB954]">
            <Sparkles className="h-4 w-4" /> Next-Gen Medical AI
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.08]">
            Your health story, powered by <span className="text-[#1DB954]">Medical AI.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[#b3b3b3]">
            Instant 24/7 symptom analysis, glowing BMI trends, and verified clinician access — built inside a sleek, distraction-free environment.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="flex items-center gap-2 rounded-full bg-[#1DB954] px-8 py-4 text-base font-extrabold text-black shadow-xl hover:scale-105 transition-all"
            >
              Get Started Free <ArrowRight className="h-5 w-5 stroke-[3]" />
            </Link>

            <Link
              to="/for-doctors"
              className="rounded-full bg-[#242424] border border-[#282828] px-8 py-4 text-base font-bold text-white hover:bg-[#2a2a2a] transition-all"
            >
              For Physicians & Doctors
            </Link>
          </div>

          <div className="mt-8 text-xs font-bold uppercase tracking-wider text-[#a7a7a7]">
            🔒 HIPAA-Compliant Architecture · Verified Doctors · Private & Secure
          </div>

          {/* Interactive Preview Card */}
          <div className="relative mt-16 overflow-hidden rounded-2xl border border-[#282828] bg-[#181818] shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="border-b border-[#282828] p-8 md:border-b-0 md:border-r">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1DB954]">
                  <span>AI Consultation Stream</span>
                  <span className="flex h-2 w-2 rounded-full bg-[#1DB954] animate-pulse" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-[#282828] p-4 text-sm text-white">
                    "I've been having mild tightness in my chest after running, along with shortness of breath."
                  </div>
                  <div className="rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/30 p-4 text-sm text-white">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#1DB954]">
                      <Sparkles className="h-4 w-4" /> Aidra Medical Response
                    </div>
                    Exercise-induced chest tightness can range from simple bronchial asthma to cardiovascular exertion. Tell me more about your resting heart rate and hydration today.
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-b from-[#181818] to-[#121212]">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#3b82f6]">
                  <span>Live Vitals Monitor</span>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-extrabold text-white">22.4</div>
                  <div className="mt-1 text-xs font-bold text-[#1DB954]">Healthy Range BMI</div>
                </div>
                <div className="mt-8 flex h-28 items-end gap-2">
                  {[35, 45, 52, 60, 55, 68, 75, 70, 82, 78, 88, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-[#1DB954] transition-all hover:bg-[#1ed760]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 text-xs text-[#a7a7a7]">Glowing trend log (Last 12 checks)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1DB954]">Capabilities</div>
          <h2 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
            Built like your favorite music player, but for your health.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group flex gap-5 rounded-2xl bg-[#181818] p-8 border border-[#282828] hover:bg-[#282828] transition-all duration-300 shadow-xl"
            >
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-[#1DB954] text-black shadow-lg">
                <f.icon className="h-7 w-7 fill-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#1DB954] transition-colors">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[#b3b3b3] leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS SECTION */}
      <section id="how" className="border-t border-[#282828] bg-[#121212] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Three Simple Steps</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-[#181818] p-8 border border-[#282828]">
                <div className="text-5xl font-extrabold text-[#1DB954]">0{i + 1}</div>
                <h3 className="mt-4 text-2xl font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-[#b3b3b3] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTOR BANNER SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8b5cf6]/30 via-[#181818] to-[#121212] p-12 border border-[#282828]">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8b5cf6]">
                Physician Portal
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Are you a licensed medical doctor?
              </h2>
              <p className="mt-2 text-sm text-[#b3b3b3]">
                Get verified with your license and access the Aidra clinician platform.
              </p>
            </div>
            <Link
              to="/for-doctors"
              className="rounded-full bg-white px-8 py-4 text-sm font-extrabold text-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
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
    title: "AI Medical Consultation Stream",
    body: "Streamed responses for symptom diagnosis, medication questions, and health advice powered by Gemini Medical.",
  },
  {
    icon: LineChart,
    title: "Glowing BMI & Vitals Analytics",
    body: "Log height and weight entries effortlessly and watch your physical health trend across interactive health charts.",
  },
  {
    icon: HeartPulse,
    title: "All-in-One Health Hub",
    body: "Keep your consultation threads, health records, and physician notes securely stored in your personal library.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Physician Network",
    body: "Every doctor on Aidra undergoes manual license verification to guarantee authentic clinical expertise.",
  },
];

const STEPS = [
  { title: "Sign Up in Seconds", body: "Quick sign-in with Google or Email. Your health data stays completely private." },
  { title: "Ask Aidra Anything", body: "Describe your symptoms or health queries and receive instant, structured AI explanations." },
  { title: "Track Vitals Over Time", body: "Log your weight and BMI to view glowing progress charts and health trends." },
];
