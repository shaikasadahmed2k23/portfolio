"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hey! Ask me anything about Asad — his projects, stack, hackathons, whatever you're curious about.",
};

function BikeIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="0 0 64 40" width={40} height={26} aria-hidden className="overflow-visible">
      {/* frame */}
      <path
        d="M14 28 L26 14 L38 14 L30 28 M26 14 L32 24 M38 14 L44 24 M14 28 L44 24"
        fill="none"
        stroke="var(--color-brass)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* seat + handlebar */}
      <path d="M22 14 L18 11 M44 24 L49 20 L52 20" fill="none" stroke="var(--color-brass)" strokeWidth={2} strokeLinecap="round" />
      {/* wheels */}
      <g style={{ transformOrigin: "14px 28px" }} className={spinning ? "animate-spin" : ""}>
        <circle cx={14} cy={28} r={8} fill="none" stroke="var(--color-ink-dim)" strokeWidth={2} />
        <circle cx={14} cy={28} r={1.5} fill="var(--color-ink-dim)" />
      </g>
      <g style={{ transformOrigin: "44px 24px" }} className={spinning ? "animate-spin" : ""}>
        <circle cx={44} cy={24} r={8} fill="none" stroke="var(--color-ink-dim)" strokeWidth={2} />
        <circle cx={44} cy={24} r={1.5} fill="var(--color-ink-dim)" />
      </g>
    </svg>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: data.reply || data.error || "Something went wrong — try again?" },
      ]);
    } catch {
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: "Couldn't reach the server — try again in a bit." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Ask about Asad"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass fixed bottom-24 right-4 z-40 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-xl sm:right-6"
    >
      <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-4 py-3">
        <div>
          <div className="font-[family-name:var(--font-data)] text-[10px] text-brass">ASK ABOUT ASAD</div>
          <div className="font-[family-name:var(--font-display)] text-sm text-ink">Portfolio Assistant</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="font-[family-name:var(--font-data)] text-xs text-ink-dim hover:text-brass"
        >
          close ✕
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-brass/15 text-ink"
                : "border border-[var(--glass-border)] bg-surface-2/60 text-ink-dim"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="w-fit rounded-lg border border-[var(--glass-border)] bg-surface-2/60 px-3 py-2 text-sm text-ink-faint">
            typing…
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--glass-border)] p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about his stack, projects…"
          className="flex-1 rounded-md border border-[var(--glass-border)] bg-surface-2/50 px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brass/60"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="rounded-md border border-brass/50 px-3 py-2 font-[family-name:var(--font-data)] text-xs text-brass transition-colors hover:bg-brass/10 disabled:opacity-40"
        >
          send
        </button>
      </div>
    </motion.div>
  );
}

export default function AskAsadBike() {
  const [phase, setPhase] = useState<"riding" | "parked">("riding");
  const [showBubble, setShowBubble] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const bubbleTimer = setTimeout(() => setShowBubble(true), 2600);
    const hideTimer = setTimeout(() => setShowBubble(false), 7200);
    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ x: "-110vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 1 }}
        onAnimationComplete={() => setPhase("parked")}
        className="fixed bottom-6 right-4 z-30 flex items-center gap-2 sm:right-6"
      >
        <AnimatePresence>
          {showBubble && !chatOpen && (
            <motion.button
              type="button"
              onClick={() => {
                setChatOpen(true);
                setShowBubble(false);
              }}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.3 }}
              className="glass whitespace-nowrap rounded-full px-4 py-2 text-left font-[family-name:var(--font-data)] text-xs text-ink hover:border-brass/60"
            >
              ask about Asad here →
            </motion.button>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => {
            setChatOpen((v) => !v);
            setShowBubble(false);
          }}
          aria-label={chatOpen ? "Close Ask Asad chat" : "Open Ask Asad chat"}
          className="glass relative flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-105 hover:border-brass/60"
        >
          <BikeIcon spinning={phase === "riding"} />
          {!chatOpen && !showBubble && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-brass" />
          )}
        </button>
      </motion.div>

      <AnimatePresence>{chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}</AnimatePresence>
    </>
  );
}
