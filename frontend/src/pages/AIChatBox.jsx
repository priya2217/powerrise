import { useState, useRef, useEffect } from "react";
import { sendAiChatMessage } from "../api";
import { FaRobot, FaUser } from "react-icons/fa";

/* ---------------------------------------------------------
   AI CHAT BOX :: HUD theme, matches Dashboard / WorkoutPlan / BMICalculator
   bg #04070d  panel #0c1420  cyan #22e5ff  blue #3b6fed
   mint #21ffa3  red #ff3b5c
   display Orbitron  label Rajdhani  data Share Tech Mono
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');`;

export default function AIChatBox({ height = "400px" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your fitness assistant. Ask me about workouts, exercise form, nutrition basics, or recovery tips.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();

    if (!trimmed || loading) return;

    const userMessage = {
      role: "user",
      content: trimmed,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const history = newMessages.slice(1).map(({ role, content }) => ({
        role,
        content,
      }));

      const data = await sendAiChatMessage(trimmed, history.slice(0, -1));

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      const detail =
        err?.response?.data?.message || err?.message || err.toString();
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="hud-chat rounded-sm overflow-hidden"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      <style>{`
        ${FONT_IMPORT}

        .hud-mono { font-family: 'Share Tech Mono', monospace; }
        .hud-display { font-family: 'Orbitron', sans-serif; }

        .hud-chat {
          background: linear-gradient(180deg, rgba(13,21,34,0.9), rgba(7,12,20,0.92));
          border: 1px solid rgba(34,229,255,0.16);
        }

        @keyframes riseIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hud-msg-in { animation: riseIn 0.3s cubic-bezier(.2,.7,.3,1) both; }

        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
        }
        .hud-blink { animation: blink 1.6s ease-in-out infinite; }

        .hud-avatar-bot {
          width: 36px; height: 36px; border-radius: 4px;
          background: rgba(34,229,255,0.1);
          border: 1px solid rgba(34,229,255,0.4);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #aef3ff;
        }
        .hud-avatar-user {
          width: 36px; height: 36px; border-radius: 4px;
          background: rgba(33,255,163,0.1);
          border: 1px solid rgba(33,255,163,0.4);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #9dffd9;
        }

        .hud-bubble-bot {
          background: #0a101c;
          border: 1px solid rgba(34,229,255,0.14);
          color: #d6e9f8;
        }
        .hud-bubble-user {
          background: linear-gradient(135deg, rgba(34,229,255,0.16), rgba(59,111,237,0.16));
          border: 1px solid rgba(34,229,255,0.35);
          color: #eaf8ff;
        }

        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        .hud-typing-dot { animation: typingDot 1.1s ease-in-out infinite; background: #22e5ff; }

        .hud-input {
          background: #070b14;
          border: 1px solid rgba(34,229,255,0.18);
          color: #e6f6ff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .hud-input:focus {
          outline: none;
          border-color: #22e5ff;
          box-shadow: 0 0 0 3px rgba(34,229,255,0.12);
        }
        .hud-input::placeholder { color: #46566f; }

        .hud-send-btn {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.1em;
          background: linear-gradient(180deg, rgba(34,229,255,0.2), rgba(34,229,255,0.08));
          border: 1px solid rgba(34,229,255,0.5);
          color: #aef3ff;
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease, opacity 0.2s ease;
          clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
        }
        .hud-send-btn:hover:not(:disabled) {
          background: linear-gradient(180deg, rgba(34,229,255,0.32), rgba(34,229,255,0.14));
          box-shadow: 0 0 16px rgba(34,229,255,0.25);
          transform: translateY(-1px);
        }
        .hud-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Header strip */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-cyan-400/10">
        <span className="w-2 h-2 rounded-full bg-[#21ffa3] hud-blink" />
        <span className="hud-mono text-[11px] tracking-[0.25em] text-cyan-300/80">
          AI ASSISTANT&nbsp;&nbsp;UPLINK
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="p-6 overflow-y-auto space-y-4"
        style={{ height }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`hud-msg-in flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex gap-3 max-w-[80%]">
              {m.role === "assistant" && (
                <div className="hud-avatar-bot">
                  <FaRobot size={14} />
                </div>
              )}

              <div
                className={`px-5 py-4 rounded-sm ${
                  m.role === "user" ? "hud-bubble-user" : "hud-bubble-bot"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {m.content}
                </p>
              </div>

              {m.role === "user" && (
                <div className="hud-avatar-user">
                  <FaUser size={14} />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="hud-msg-in flex justify-start">
            <div className="flex gap-3">
              <div className="hud-avatar-bot">
                <FaRobot size={14} />
              </div>

              <div className="hud-bubble-bot px-5 py-4 rounded-sm">
                <div className="flex gap-2">
                  <div
                    className="w-2 h-2 rounded-full hud-typing-dot"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full hud-typing-dot"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full hud-typing-dot"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="hud-mono mx-4 mb-3 text-xs text-[#ff3b5c] tracking-wide">
          ⚠ {error.toUpperCase()}
        </p>
      )}

      {/* Input */}
      <div className="border-t border-cyan-400/10 p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask about workouts, nutrition, recovery…"
          className="hud-input flex-1 rounded-sm px-4 py-3 text-sm"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="hud-send-btn px-6 py-3 text-xs"
        >
          {loading ? "…" : "SEND"}
        </button>
      </div>
    </div>
  );
}
