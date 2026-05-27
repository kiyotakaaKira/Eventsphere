/*
 * AI Event Discovery Service
 *
 * This handles the communication with an AI backend for smart event recommendations.
 * To use a real API, set NEXT_PUBLIC_AI_API_KEY in your .env.local file.
 *
 * Supported providers: gemini | openai
 * Set NEXT_PUBLIC_AI_PROVIDER to choose (defaults to "gemini").
 */

import { evs } from "@/data/events";

const API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || "";
const PROVIDER = process.env.NEXT_PUBLIC_AI_PROVIDER || "gemini";

// ── Simulated AI recommendations ──────────────────────────
// Falls back to a local matching algorithm when no API key is set.

function localMatch(prompt) {
  const lower = prompt.toLowerCase();
  const keywords = lower.split(/[\s,]+/).filter(Boolean);

  const scored = evs.map((ev) => {
    let score = 0;
    const blob = `${ev.title} ${ev.category} ${ev.location} ${ev.tags.join(" ")} ${ev.description}`.toLowerCase();

    keywords.forEach((kw) => {
      if (blob.includes(kw)) score += 2;
    });

    // boost trending events slightly
    score += ev.trendingScore / 100;

    return { ...ev, _score: score };
  });

  return scored
    .filter((e) => e._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);
}

function buildReasoningText(prompt, matches) {
  if (matches.length === 0) {
    return `I searched through our events but couldn't find a strong match for "${prompt}". Try broadening your search — for example, try categories like "hackathon", "workshop", or "meetup".`;
  }

  const names = matches.map((m) => m.title).join(", ");
  return `Based on your interest in "${prompt}", I found ${matches.length} events that match well: ${names}. These were selected by analyzing categories, tags, and descriptions for relevance.`;
}

// ── Public API ────────────────────────────────────────────

export async function getAIRecommendations(prompt) {
  // simulate a small network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

  if (API_KEY) {
    // If a real key is set, call the provider API.
    // For now this is a placeholder — wire up the real fetch when ready.
    try {
      if (PROVIDER === "gemini") {
        return await callGemini(prompt);
      } else {
        return await callOpenAI(prompt);
      }
    } catch (err) {
      console.error("AI API call failed, falling back to local match:", err);
    }
  }

  // Fallback: local keyword matching
  const matches = localMatch(prompt);
  const reasoning = buildReasoningText(prompt, matches);

  return {
    reasoning,
    events: matches.map(({ _score, ...rest }) => rest),
  };
}

// ── Provider stubs ────────────────────────────────────────
// Replace these with actual API calls when you're ready.

async function callGemini(prompt) {
  // Example endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
  // You'd POST with { contents: [{ parts: [{ text: prompt }] }] }
  // and parse the response to extract event IDs and reasoning.

  // For now, fall through to local matching.
  const matches = localMatch(prompt);
  return {
    reasoning: buildReasoningText(prompt, matches),
    events: matches.map(({ _score, ...rest }) => rest),
  };
}

async function callOpenAI(prompt) {
  // Example endpoint: https://api.openai.com/v1/chat/completions
  // You'd POST with model, messages, etc.

  const matches = localMatch(prompt);
  return {
    reasoning: buildReasoningText(prompt, matches),
    events: matches.map(({ _score, ...rest }) => rest),
  };
}

// ── Suggestion chips ─────────────────────────────────────

export const suggestedPrompts = [
  "Hackathons for AI beginners",
  "Networking events this month",
  "Free workshops near campus",
  "Startup pitch events",
  "Design & UI workshops",
];
