import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, MessageSquareText, Loader2, Play, Sparkles, ChevronRight } from "lucide-react";

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#8b5cf6]/20 via-[#181818] to-[#121212] p-8 border border-[#282828]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b5cf6]">
              <Sparkles className="h-4 w-4" /> Consultation Library
            </div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Your AI Threads
            </h1>
            <p className="mt-2 text-sm text-[#b3b3b3]">
              Review past medical insights or start a brand new consultation stream.
            </p>
          </div>

          <button
            onClick={() => create.mutate()}
            disabled={create.isPending}
            className="flex items-center gap-2 rounded-full bg-[#1DB954] px-6 py-3 text-sm font-extrabold text-black shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            {create.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5 stroke-[3]" /> New Consultation
              </>
            )}
          </button>
        </div>

        {/* Thread Cards List */}
        <div className="space-y-3">
          {threads.isLoading && (
            <div className="py-12 text-center text-sm text-[#b3b3b3]">Loading consultations…</div>
          )}

          {threads.data && threads.data.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#282828] bg-[#181818] p-12 text-center">
              <MessageSquareText className="mx-auto h-10 w-10 text-[#1DB954]" />
              <h2 className="mt-4 text-2xl font-bold text-white">No Consultations Yet</h2>
              <p className="mt-2 text-sm text-[#b3b3b3]">
                Ask about a symptom, health routine, or general medical question.
              </p>
              <button
                className="mt-6 rounded-full bg-[#1DB954] px-6 py-3 text-sm font-bold text-black hover:scale-105 transition-all"
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
              className="group flex items-center justify-between rounded-xl bg-[#181818] p-4 transition-all duration-200 hover:bg-[#282828] border border-[#282828]/50 shadow-md"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-[#242424] text-[#1DB954] group-hover:bg-[#1DB954] group-hover:text-black transition-colors">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-bold text-white group-hover:text-[#1DB954] transition-colors">
                    {t.title}
                  </div>
                  <div className="text-xs text-[#a7a7a7]">
                    Session #{threads.data.length - idx} · Updated {new Date(t.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#242424] px-3 py-1 text-xs font-semibold text-[#1DB954]">
                  Active
                </span>
                <ChevronRight className="h-5 w-5 text-[#a7a7a7] group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
