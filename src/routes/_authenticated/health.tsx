import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, Activity, Plus, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addHealthRecord, listHealthRecords } from "@/lib/health.functions";

export const Route = createFileRoute("/_authenticated/health")({
  head: () => ({ meta: [{ title: "BMI & Vitals — Aidra Health" }, { name: "robots", content: "noindex" }] }),
  component: HealthPage,
});

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", tone: "text-[#ab570a] bg-[#ffefcf] border-[#f5a623]/30" };
  if (bmi < 25) return { label: "Healthy Range", tone: "text-[#0070f3] bg-[#d3e5ff]/40 border-[#0070f3]/30" };
  if (bmi < 30) return { label: "Overweight", tone: "text-[#ab570a] bg-[#ffefcf] border-[#f5a623]/30" };
  return { label: "Obese", tone: "text-[#ee0000] bg-[#ee0000]/10 border-[#ee0000]/20" };
}

function HealthPage() {
  const queryClient = useQueryClient();
  const addFn = useServerFn(addHealthRecord);
  const records = useQuery({
    queryKey: ["health-records"],
    queryFn: () => listHealthRecords(),
  });

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const add = useMutation({
    mutationFn: (input: { height_cm: number; weight_kg: number; notes?: string }) =>
      addFn({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      setWeight("");
      setNotes("");
      toast.success("Vitals entry logged successfully");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to log entry"),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w)) {
      toast.error("Please enter valid height and weight numbers");
      return;
    }
    add.mutate({ height_cm: h, weight_kg: w, notes: notes.trim() || undefined });
  }

  const latest = records.data?.[records.data.length - 1];
  const cat = latest ? bmiCategory(latest.bmi) : null;

  const chartData =
    records.data?.map((r) => ({
      date: new Date(r.recorded_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      bmi: Number(r.bmi),
    })) ?? [];

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Geist Hero Banner Header */}
        <div className="rounded-xl border border-border bg-canvas-elevated p-8 shadow-whisper">
          <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">
            <Activity className="h-3.5 w-3.5" /> VITALS TELEMETRY
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tighter text-ink sm:text-4xl">
            BMI & Health Trends
          </h1>
          <p className="mt-2 text-sm text-body">
            Track physical body metrics over time with precision developer analytics.
          </p>
        </div>

        {/* Main Grid: Chart & Form */}
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* Chart Container */}
          <div className="rounded-xl border border-border bg-canvas-elevated p-6 md:p-8 shadow-whisper">
            <div className="flex items-end justify-between border-b border-border pb-6">
              <div>
                <div className="font-mono text-xs font-medium uppercase tracking-wider text-mute">Latest BMI</div>
                <div className="mt-2 text-5xl font-semibold tracking-tighter text-ink">
                  {latest ? latest.bmi.toFixed(1) : "—"}
                </div>
                {cat && (
                  <span className={`mt-3 inline-block font-mono text-[11px] font-medium rounded-full border px-3 py-0.5 ${cat.tone}`}>
                    {cat.label}
                  </span>
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 font-mono text-xs font-medium text-[#0070f3]">
                  <TrendingUp className="h-3.5 w-3.5" /> {records.data?.length ?? 0} LOGGED ENTRIES
                </div>
                {latest && (
                  <div className="mt-1 font-mono text-xs text-mute">
                    {latest.height_cm}cm / {latest.weight_kg}kg
                  </div>
                )}
              </div>
            </div>

            {/* Rechart View */}
            <div className="mt-6 h-64">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="geistBlueGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0070f3" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#0070f3" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--mute)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--mute)" fontSize={11} tickLine={false} axisLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--ink)",
                        fontSize: 12,
                        fontWeight: 500,
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bmi"
                      stroke="#0070f3"
                      strokeWidth={2}
                      fill="url(#geistBlueGlow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-xs text-mute">
                  <Sparkles className="mb-2 h-6 w-6 text-[#0070f3]" />
                  Log at least two entries to render your vitals trend chart.
                </div>
              )}
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-canvas-elevated p-6 md:p-8 shadow-whisper">
            <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">
              <Plus className="h-3.5 w-3.5" /> NEW VITALS LOG
            </div>
            <h2 className="mt-2 text-xl font-semibold text-ink">Record Vitals</h2>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="height" className="text-xs font-medium text-body">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="50"
                    max="272"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
                    placeholder="175"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="text-xs font-medium text-body">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="20"
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-medium text-body">
                  Notes (optional)
                </Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Morning weight, post-workout..."
                  className="rounded-[6px] border border-border bg-canvas text-ink focus:bg-canvas-elevated focus:border-ink"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-[6px] bg-primary py-2.5 text-xs font-medium text-primary-foreground shadow-xs hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                disabled={add.isPending}
              >
                {add.isPending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Save Entry"}
              </button>
            </div>
          </form>
        </div>

        {/* History Table Container */}
        <div className="rounded-xl border border-border bg-canvas-elevated p-6 shadow-whisper">
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-mute mb-4">VITALS HISTORY LOG</div>
          <div className="divide-y divide-border">
            {(records.data ?? []).slice().reverse().slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3 text-xs">
                <div className="font-mono text-mute">
                  {new Date(r.recorded_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-body">{r.height_cm} cm · {r.weight_kg} kg</span>
                  <span className="font-mono font-medium text-ink text-xs bg-canvas border border-border px-2.5 py-0.5 rounded-[4px]">
                    BMI {Number(r.bmi).toFixed(1)}
                  </span>
                </div>
              </div>
            ))}

            {records.data && records.data.length === 0 && (
              <div className="py-8 text-center text-xs text-mute">
                No historical records found. Log your first weight entry above.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
