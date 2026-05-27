"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAIRecommendations, suggestedPrompts } from "@/src/services/aiService";

export default function AIAssistant({ open, onClose }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, loading]);

  async function handleSubmit(text) {
    const query = text || prompt.trim();
    if (!query || loading) return;

    setPrompt("");
    setConversation((prev) => [...prev, { role: "user", text: query }]);
    setLoading(true);

    try {
      const result = await getAIRecommendations(query);
      setConversation((prev) => [
        ...prev,
        { role: "ai", text: result.reasoning, events: result.events },
      ]);
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again.", events: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* panel */}
          <motion.aside
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/[0.07] bg-slate-950/95 backdrop-blur-xl sm:w-[420px]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-500">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">AI Discovery</h2>
                  <p className="text-[11px] text-slate-500">Smart event recommendations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors duration-150"
              >
                <X size={18} />
              </button>
            </div>

            {/* conversation body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {conversation.length === 0 && !loading && (
                <div className="pt-6">
                  <p className="text-center text-sm text-slate-400 mb-5">
                    Ask me anything about events — I'll find the best matches for you.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedPrompts.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleSubmit(sp)}
                        className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition-all duration-200 hover:border-sky-400/25 hover:bg-sky-400/[0.06] hover:text-sky-300"
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {conversation.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-r from-sky-500/20 to-violet-500/20 border border-sky-500/15 px-4 py-2.5 text-sm text-slate-100">
                        {msg.text}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 }}
                      className="space-y-3"
                    >
                      <div className="flex gap-2.5">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-sky-500/30 to-violet-500/30">
                          <Sparkles size={12} className="text-sky-300" />
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{msg.text}</p>
                      </div>

                      {/* recommendation cards */}
                      {msg.events?.length > 0 && (
                        <div className="ml-8 space-y-2.5">
                          {msg.events.map((ev, j) => (
                            <motion.div
                              key={ev.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + j * 0.07 }}
                            >
                              <Link
                                href={`/event/${ev.id}`}
                                onClick={onClose}
                                className="group flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.05]"
                              >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                  <Image src={ev.image} alt={ev.title} fill className="object-cover" sizes="56px" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate group-hover:text-sky-300 transition-colors duration-200">{ev.title}</p>
                                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-0.5">
                                      <Calendar size={10} />
                                      {ev.date}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <MapPin size={10} />
                                      {ev.location}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-slate-400 capitalize">{ev.category}</span>
                                    <span className="text-[11px] font-medium text-accent">{ev.price === 0 ? "Free" : `$${ev.price}`}</span>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}

              {/* loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-sky-500/30 to-violet-500/30">
                    <Sparkles size={12} className="text-sky-300" />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <span className="ai-shimmer inline-block h-4 w-32 rounded-md" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* input */}
            <div className="border-t border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 transition-colors duration-200 focus-within:border-sky-400/25 focus-within:bg-white/[0.06]">
                <input
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about events..."
                  className="flex-1 bg-transparent text-sm placeholder:text-slate-500 outline-none border-none ring-0 focus:ring-0"
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={!prompt.trim() || loading}
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 p-2 text-white transition-all duration-200 disabled:opacity-30 hover:shadow-md hover:shadow-sky-500/20"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-600">
                AI suggestions based on event data. Results may vary.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
