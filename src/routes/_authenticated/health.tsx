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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addHealthRecord, listHealthRecords } from "@/lib/health.functions";

export const Route = createFileRoute("/_authenticated/health")({
  head: () => ({ meta: [{ title: "BMI & Vitals — Aidra Health" }, { name: "robots", content: "noindex" }] }),
  component: HealthPage,
});

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", tone: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
  if (bmi < 25) return { label: "Healthy Range", tone: "text-[#1DB954] bg-[#1DB954]/10 border-[#1DB954]/20" };
  if (bmi < 30) return { label: "Overweight", tone: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
  return { label: "Obese", tone: "text-red-400 bg-red-400/10 border-red-400/20" };
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
        {/* Hero Banner Header */}
        <div className="rounded-2xl bg-gradient-to-r from-[#3b82f6]/20 via-[#181818] to-[#121212] p-8 border border-[#282828]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3b82f6]">
            <Activity className="h-4 w-4" /> Vitals Monitor
          </div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            BMI & Health Trends
          </h1>
          <p className="mt-2 text-sm text-[#b3b3b3]">
            Track your physical body metrics over time with glowing analytics.
          </p>
        </div>

        {/* Main Grid: Chart & Form */}
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* Chart Container */}
          <div className="rounded-2xl bg-[#181818] p-6 md:p-8 border border-[#282828]">
            <div className="flex items-end justify-between border-b border-[#282828] pb-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#a7a7a7]">Latest BMI</div>
                <div className="mt-2 text-5xl font-extrabold text-white tracking-tight">
                  {latest ? latest.bmi.toFixed(1) : "—"}
                </div>
                {cat && (
                  <span className={`mt-3 inline-block rounded-full border px-3 py-1 text-xs font-bold ${cat.tone}`}>
                    {cat.label}
                  </span>
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1DB954]">
                  <TrendingUp className="h-4 w-4" /> {records.data?.length ?? 0} Logged Entries
                </div>
                {latest && (
                  <div className="mt-1 text-xs text-[#a7a7a7]">
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
                      <linearGradient id="emeraldGreenGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1DB954" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#1DB954" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip
                      contentStyle={{
                        background: "#282828",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#ffffff",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bmi"
                      stroke="#1DB954"
                      strokeWidth={3}
                      fill="url(#emeraldGreenGlow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[#a7a7a7]">
                  <Sparkles className="mb-2 h-8 w-8 text-[#1DB954]" />
                  Log at least two entries to render your glowing metric chart.
                </div>
              )}
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="rounded-2xl bg-[#181818] p-6 md:p-8 border border-[#282828]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1DB954]">
              <Plus className="h-4 w-4" /> New Vitals Log
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">Record Vitals</h2>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="height" className="text-xs font-bold text-[#b3b3b3]">
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
                    className="bg-[#242424] border-none text-white focus:ring-2 focus:ring-[#1DB954]"
                    placeholder="175"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="text-xs font-bold text-[#b3b3b3]">
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
                    className="bg-[#242424] border-none text-white focus:ring-2 focus:ring-[#1DB954]"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-bold text-[#b3b3b3]">
                  Notes (optional)
                </Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Morning weight, post-workout..."
                  className="bg-[#242424] border-none text-white focus:ring-2 focus:ring-[#1DB954]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#1DB954] py-3 text-sm font-extrabold text-black shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                disabled={add.isPending}
              >
                {add.isPending ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Save Entry"}
              </button>
            </div>
          </form>
        </div>

        {/* History Table Container */}
        <div className="rounded-2xl bg-[#181818] p-6 border border-[#282828]">
          <h3 className="text-lg font-bold text-white mb-4">Vitals History Log</h3>
          <div className="divide-y divide-[#282828]">
            {(records.data ?? []).slice().reverse().slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3.5 text-sm">
                <div className="text-xs text-[#a7a7a7]">
                  {new Date(r.recorded_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-[#b3b3b3]">{r.height_cm} cm · {r.weight_kg} kg</span>
                  <span className="font-extrabold text-white text-base bg-[#242424] px-3 py-1 rounded-full">
                    BMI {Number(r.bmi).toFixed(1)}
                  </span>
                </div>
              </div>
            ))}

            {records.data && records.data.length === 0 && (
              <div className="py-8 text-center text-sm text-[#a7a7a7]">
                No historical records found. Log your first weight entry above.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
