import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Send, Loader2, Sparkles, HeartPulse, Play, Activity } from "lucide-react";
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
          <div className="text-red-400 font-bold">{(q.error as Error).message}</div>
          <Button className="mt-4 bg-[#1DB954] text-black hover:scale-105" onClick={() => router.invalidate()}>
            Retry Session
          </Button>
        </div>
      </AppShell>
    );
  }

  const messages = q.data?.messages ?? [];

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-140px)] flex-col rounded-2xl overflow-hidden bg-[#121212] border border-[#282828]">
        {/* Consultation Banner Header */}
        <div className="flex items-center justify-between border-b border-[#282828] bg-gradient-to-r from-[#1DB954]/20 via-[#181818] to-[#121212] px-6 py-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/chat"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-[#b3b3b3] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#1DB954] text-black shadow-lg">
              <HeartPulse className="h-6 w-6 fill-black" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1DB954]">
                  AI Medical Consultation
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
              </div>
              <h1 className="truncate text-xl font-extrabold text-white">
                {q.data?.thread.title ?? "New Consultation"}
              </h1>
            </div>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gradient-to-b from-[#181818]/60 to-[#121212] p-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.length === 0 && !pendingUser && (
              <div className="rounded-2xl border border-dashed border-[#282828] bg-[#181818] p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954]/20 text-[#1DB954]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-2xl font-extrabold text-white">Start your consultation</h2>
                <p className="mt-2 text-sm text-[#b3b3b3]">
                  Describe any symptoms, medical questions, or lifestyle queries. Aidra is here to explain clearly.
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
                  className="max-w-[85%] self-start rounded-2xl bg-[#181818] border border-[#1DB954]/30 px-5 py-4 shadow-lg"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1DB954]">
                    <Activity className="h-4 w-4 animate-spin" />
                    <span>Aidra is analyzing your prompt…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message Input Footer Bar */}
        <form onSubmit={handleSubmit} className="border-t border-[#282828] bg-[#181818] p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-3">
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
              className="min-h-12 flex-1 resize-none rounded-xl bg-[#242424] border-none px-4 py-3 text-sm text-white placeholder-[#a7a7a7] focus:ring-2 focus:ring-[#1DB954] outline-none"
              maxLength={4000}
              disabled={send.isPending}
            />
            <button
              type="submit"
              disabled={send.isPending || !input.trim()}
              className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#1DB954] text-black font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-40"
            >
              {send.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 fill-black" />}
            </button>
          </div>
          <div className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-[#a7a7a7]">
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("max-w-[85%]", isUser ? "self-end" : "self-start")}
    >
      <div
        className={cn(
          "rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-lg",
          isUser
            ? "rounded-tr-none bg-[#282828] text-white"
            : "rounded-tl-none bg-[#181818] border border-[#1DB954]/20 text-white",
        )}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#1DB954]">
            <Sparkles className="h-4 w-4" /> Aidra Medical Response
          </div>
        )}
        {isUser ? (
          <div className="whitespace-pre-wrap font-medium">{content}</div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:font-bold prose-headings:text-[#1DB954] prose-strong:text-white prose-ul:my-2">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
