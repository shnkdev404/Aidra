import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, MessageSquareText, Loader2, Sparkles, ChevronRight } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { createThread, listThreads } from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ThreadListPage,
});

function ThreadListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createFn = useServerFn(createThread);

  const threads = useQuery({
    queryKey: ["chat-threads"],
    queryFn: () => listThreads(),
  });

  const create = useMutation({
    mutationFn: () => createFn({ data: {} }),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: row.id } });
    },
  });

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Consultation Banner Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-canvas-elevated p-8 shadow-whisper">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[#0070f3]">
              <Sparkles className="h-3.5 w-3.5" /> CONSULTATION LIBRARY
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tighter text-ink sm:text-4xl">
              Your AI Threads
            </h1>
            <p className="mt-2 text-sm text-body">
              Review past medical insights or start a brand new consultation stream.
            </p>
          </div>

          <button
            onClick={() => create.mutate()}
            disabled={create.isPending}
            className="flex items-center gap-2 rounded-[6px] bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-xs hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {create.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4" /> New Consultation
              </>
            )}
          </button>
        </div>

        {/* Thread Cards List */}
        <div className="space-y-2">
          {threads.isLoading && (
            <div className="py-12 text-center text-xs text-mute">Loading consultations…</div>
          )}

          {threads.data && threads.data.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-canvas-elevated p-12 text-center shadow-whisper">
              <MessageSquareText className="mx-auto h-8 w-8 text-[#0070f3]" />
              <h2 className="mt-4 text-xl font-semibold text-ink">No Consultations Yet</h2>
              <p className="mt-2 text-xs text-body">
                Ask about a symptom, health routine, or general medical question.
              </p>
              <button
                className="mt-6 rounded-[6px] bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-all"
                onClick={() => create.mutate()}
                disabled={create.isPending}
              >
                Start First Session
              </button>
            </div>
          )}

          {threads.data?.map((t, idx) => (
            <Link
              key={t.id}
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              className="group flex items-center justify-between rounded-xl border border-border bg-canvas-elevated p-4 shadow-whisper hover:border-body transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[6px] border border-border bg-canvas text-ink group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink">
                    {t.title}
                  </div>
                  <div className="font-mono text-[11px] text-mute">
                    SESSION #0{threads.data.length - idx} · UPDATED {new Date(t.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono rounded-[4px] border border-[#d3e5ff] bg-[#d3e5ff]/30 px-2 py-0.5 text-[10px] font-medium text-[#0070f3]">
                  ACTIVE
                </span>
                <ChevronRight className="h-4 w-4 text-mute group-hover:text-ink" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
