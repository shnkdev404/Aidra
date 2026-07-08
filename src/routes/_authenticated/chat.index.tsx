import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, MessageSquareText, Loader2 } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animated/FadeIn";
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
      <div className="mx-auto max-w-3xl px-6 py-12">
        <FadeIn>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Chat</div>
              <h1 className="serif mt-3 text-5xl">Your conversations</h1>
            </div>
            <Button onClick={() => create.mutate()} disabled={create.isPending}>
              {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <><Plus className="mr-1 h-4 w-4" /> New</>
              )}
            </Button>
          </div>
        </FadeIn>

        <div className="mt-10 space-y-2">
          {threads.isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {threads.data && threads.data.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/70 p-10 text-center">
              <MessageSquareText className="mx-auto h-6 w-6 text-muted-foreground" />
              <div className="serif mt-4 text-2xl">Nothing here yet.</div>
              <p className="mt-1 text-sm text-muted-foreground">Start your first conversation with Aidra.</p>
              <Button className="mt-5" onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Start a conversation"}
              </Button>
            </div>
          )}
          {threads.data?.map((t) => (
            <Link
              key={t.id}
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3 transition-shadow hover:shadow-soft"
            >
              <div className="truncate">
                <div className="truncate text-sm">{t.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(t.updated_at).toLocaleString()}
                </div>
              </div>
              <MessageSquareText className="h-4 w-4 flex-none text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
