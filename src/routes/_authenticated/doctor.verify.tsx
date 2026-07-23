import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, Clock, Loader2, ShieldCheck, Stethoscope } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getMyDoctorApplication,
  submitDoctorApplication,
  upsertDoctorApplication,
} from "@/lib/doctor.functions";

export const Route = createFileRoute("/_authenticated/doctor/verify")({
  head: () => ({ meta: [{ title: "Doctor Verification — Aidra Health" }, { name: "robots", content: "noindex" }] }),
  component: DoctorVerifyPage,
});

function DoctorVerifyPage() {
  const queryClient = useQueryClient();
  const saveFn = useServerFn(upsertDoctorApplication);
  const submitFn = useServerFn(submitDoctorApplication);
  const app = useQuery({
    queryKey: ["doctor-application"],
    queryFn: () => getMyDoctorApplication(),
  });

  const [form, setForm] = useState({
    full_name: "",
    license_number: "",
    specialty: "",
    country: "",
    bio: "",
  });

  useEffect(() => {
    if (app.data) {
      setForm({
        full_name: app.data.full_name ?? "",
        license_number: app.data.license_number ?? "",
        specialty: app.data.specialty ?? "",
        country: app.data.country ?? "",
        bio: app.data.bio ?? "",
      });
    }
  }, [app.data]);

  const save = useMutation({
    mutationFn: () => saveFn({ data: form }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-application"] });
      toast.success("Draft saved successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save draft"),
  });

  const submit = useMutation({
    mutationFn: () => submitFn({ data: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-application"] });
      toast.success("Submitted for license verification");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to submit application"),
  });

  function handleSave(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  const status = app.data?.status ?? "draft";
  const canEdit = status === "draft" || status === "rejected";

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Verified Clinician Banner Header */}
        <div className="rounded-xl border border-border bg-canvas-elevated p-8 shadow-whisper">
          <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">
            <BadgeCheck className="h-3.5 w-3.5" /> VERIFIED CLINICIAN BADGE
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tighter text-ink sm:text-4xl">
            Doctor Portal Verification
          </h1>
          <p className="mt-2 text-sm text-body">
            Submit your medical license to unlock verified physician status on Aidra.
          </p>
        </div>

        {/* Status Strip */}
        <StatusStrip status={status} />

        {/* Form Container */}
        <form onSubmit={handleSave} className="rounded-xl border border-border bg-canvas-elevated p-6 md:p-8 shadow-whisper">
          <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3] mb-6">
            <Stethoscope className="h-3.5 w-3.5" /> PROFESSIONAL CREDENTIALS
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" required>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                disabled={!canEdit}
                maxLength={120}
                required
                className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
                placeholder="Dr. Sarah Connor"
              />
            </Field>

            <Field label="License Number" required>
              <Input
                value={form.license_number}
                onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                disabled={!canEdit}
                maxLength={80}
                required
                className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
                placeholder="MD-984210"
              />
            </Field>

            <Field label="Specialty" required>
              <Input
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                disabled={!canEdit}
                placeholder="e.g. Cardiology / Internal Medicine"
                maxLength={80}
                required
                className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
              />
            </Field>

            <Field label="Country of Practice" required>
              <Input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                disabled={!canEdit}
                maxLength={80}
                required
                className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
                placeholder="United States"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Short Clinical Bio">
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                disabled={!canEdit}
                rows={4}
                maxLength={1000}
                placeholder="Describe your background and clinical focus for patients..."
                className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
              />
            </Field>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="text-xs text-mute">
              Free manual license verification by the Aidra medical review board.
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!canEdit || save.isPending}
                className="rounded-[6px] border border-border bg-canvas-elevated px-4 py-2 text-xs font-medium text-ink hover:bg-canvas transition-all disabled:opacity-50"
              >
                {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Draft"}
              </button>
              <button
                type="button"
                disabled={!canEdit || submit.isPending}
                onClick={() => {
                  save.mutateAsync().then(() => submit.mutate());
                }}
                className="rounded-[6px] bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for Verification"}
              </button>
            </div>
          </div>
        </form>

        {app.data?.admin_notes && (
          <div className="rounded-xl border border-border bg-canvas-elevated p-5 shadow-whisper">
            <div className="font-mono text-xs font-medium uppercase tracking-wider text-mute">VERIFICATION NOTES</div>
            <p className="mt-2 text-sm text-ink">{app.data.admin_notes}</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-body">
        {label} {required && <span className="text-[#ee0000]">*</span>}
      </Label>
      {children}
    </div>
  );
}

function StatusStrip({ status }: { status: string }) {
  const map = {
    draft: {
      icon: ShieldCheck,
      label: "Draft Application",
      body: "Fill out your credentials and submit for verification review.",
      tone: "text-ink bg-canvas-elevated border border-border",
    },
    pending_payment: {
      icon: Clock,
      label: "Verification Pending",
      body: "Your application is queued for medical review.",
      tone: "text-[#ab570a] bg-[#ffefcf] border border-[#f5a623]/30",
    },
    submitted: {
      icon: Clock,
      label: "Under Verification Review",
      body: "Our team is confirming your license with your medical board (1–3 business days).",
      tone: "text-[#0070f3] bg-[#d3e5ff]/30 border border-[#0070f3]/30",
    },
    approved: {
      icon: BadgeCheck,
      label: "Verified Physician Status Active",
      body: "Congratulations! Your verified clinician badge is live on Aidra.",
      tone: "text-ink bg-hairline-soft border border-ink",
    },
    rejected: {
      icon: ShieldCheck,
      label: "Updates Required",
      body: "Please review the notes below and update your application details.",
      tone: "text-[#ee0000] bg-[#ee0000]/10 border border-[#ee0000]/20",
    },
  } as const;

  const s = map[status as keyof typeof map] ?? map.draft;

  return (
    <div className={`flex items-center gap-4 rounded-xl p-5 shadow-whisper ${s.tone}`}>
      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[6px] border border-current bg-canvas/50">
        <s.icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-base font-semibold">{s.label}</div>
        <div className="text-xs opacity-90">{s.body}</div>
      </div>
    </div>
  );
}
