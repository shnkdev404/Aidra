import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Send, Loader2, Sparkles, Activity } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getThread, sendMessage } from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const getFn = useServerFn(getThread);
  const sendFn = useServerFn(sendMessage);

  const q = useQuery({
    queryKey: ["chat-thread", threadId],
    queryFn: () => getFn({ data: { threadId } }),
  });

  const [input, setInput] = useState("");
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const send = useMutation({
    mutationFn: (content: string) => sendFn({ data: { threadId, content } }),
    onSuccess: () => {
      setPendingUser(null);
      queryClient.invalidateQueries({ queryKey: ["chat-thread", threadId] });
      queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    onError: (err) => {
      setPendingUser(null);
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [q.data?.messages.length, pendingUser, send.isPending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || send.isPending) return;
    setPendingUser(trimmed);
    setInput("");
    send.mutate(trimmed);
  }

  if (q.error) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl p-10 text-center">
          <div className="text-[#ee0000] font-mono text-xs">{(q.error as Error).message}</div>
          <Button className="mt-4 bg-primary text-primary-foreground hover:opacity-90" onClick={() => router.invalidate()}>
            Retry Session
          </Button>
        </div>
      </AppShell>
    );
  }

  const messages = q.data?.messages ?? [];

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-140px)] flex-col rounded-xl border border-border bg-canvas-elevated shadow-whisper overflow-hidden">
        {/* Consultation Banner Header */}
        <div className="flex items-center justify-between border-b border-border bg-canvas-elevated px-6 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/chat"
              className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-canvas-elevated text-body hover:bg-canvas hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[6px] bg-primary text-primary-foreground shadow-xs">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 2L2 22h20L12 2z" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#0070f3]">
                  AI CLINICAL STREAM
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0070f3]" />
              </div>
              <h1 className="truncate text-sm font-semibold text-ink">
                {q.data?.thread.title ?? "New Consultation"}
              </h1>
            </div>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-canvas p-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.length === 0 && !pendingUser && (
              <div className="rounded-xl border border-dashed border-border bg-canvas-elevated p-8 text-center shadow-whisper">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#d3e5ff] bg-[#d3e5ff]/30 text-[#0070f3]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-ink">Start your consultation</h2>
                <p className="mt-1 text-xs text-body">
                  Describe any symptoms, medical questions, or health queries. Aidra is ready to explain clearly.
                </p>
              </div>
            )}

            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} />
            ))}

            <AnimatePresence>
              {pendingUser && <Bubble key="pending-u" role="user" content={pendingUser} />}
              {send.isPending && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-[85%] self-start rounded-xl border border-border bg-canvas-elevated px-4 py-3 shadow-whisper"
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-[#0070f3]">
                    <Activity className="h-3.5 w-3.5 animate-spin" />
                    <span>Aidra AI is processing prompt…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message Input Footer Bar */}
        <form onSubmit={handleSubmit} className="border-t border-border bg-canvas-elevated p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2.5">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent);
                }
              }}
              rows={1}
              placeholder="Ask Aidra about symptoms, lab tests, or health habits..."
              className="min-h-10 flex-1 resize-none rounded-[6px] border border-border bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder-mute focus:bg-canvas-elevated focus:border-ink outline-none transition-all"
              maxLength={4000}
              disabled={send.isPending}
            />
            <button
              type="submit"
              disabled={send.isPending || !input.trim()}
              className="flex h-10 w-10 flex-none items-center justify-center rounded-[6px] bg-primary text-primary-foreground shadow-xs hover:opacity-90 transition-all disabled:opacity-40"
            >
              {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <div className="mx-auto mt-2 max-w-3xl text-center font-mono text-[10px] text-mute">
            Aidra AI provides informational health guidance and does not replace emergency or clinical diagnoses.
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("max-w-[85%]", isUser ? "self-end" : "self-start")}
    >
      <div
        className={cn(
          "rounded-xl px-4 py-3.5 text-xs leading-relaxed shadow-whisper",
          isUser
            ? "rounded-tr-[2px] bg-primary text-primary-foreground font-normal"
            : "rounded-tl-[2px] border border-border bg-canvas-elevated text-ink",
        )}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-medium text-[#0070f3] uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> AIDRA CLINICAL DIAGNOSTIC
          </div>
        )}
        {isUser ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="prose prose-sm max-w-none text-xs text-ink prose-p:my-1.5 prose-headings:font-semibold prose-headings:text-ink prose-strong:text-ink prose-code:font-mono prose-code:bg-canvas prose-code:px-1 prose-code:py-0.5 prose-code:rounded-[4px] prose-code:border prose-code:border-border">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
