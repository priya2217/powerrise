import { useState, useRef, useEffect } from "react";
import { sendAiChatMessage } from "../api";

// height: CSS height for the message scroll area (e.g. "300px" for widget, "60vh" for full page)
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

    const userMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      // send only role/content pairs as history, excluding the very first greeting
      const history = newMessages
        .slice(1)
        .map(({ role, content }) => ({ role, content }));

      const data = await sendAiChatMessage(trimmed, history.slice(0, -1));
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.toString());
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
    <div style={containerStyle}>
      <div ref={scrollRef} style={{ ...messagesStyle, height }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                ...bubbleStyle,
                background: m.role === "user" ? "#4f46e5" : "#f3f4f6",
                color: m.role === "user" ? "#fff" : "#111827",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                ...bubbleStyle,
                background: "#f3f4f6",
                color: "#6b7280",
              }}
            >
              Thinking...
            </div>
          </div>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={inputRowStyle}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about workouts, nutrition, recovery..."
          disabled={loading}
          style={inputStyle}
        />
        <button onClick={handleSend} disabled={loading} style={sendButtonStyle}>
          Send
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const messagesStyle = {
  padding: "16px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

const bubbleStyle = {
  maxWidth: "75%",
  padding: "10px 14px",
  borderRadius: "14px",
  fontSize: "14px",
  lineHeight: "1.4",
  whiteSpace: "pre-wrap",
};

const inputRowStyle = {
  display: "flex",
  gap: "8px",
  padding: "12px",
  borderTop: "1px solid #e5e7eb",
};

const inputStyle = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  outline: "none",
};

const sendButtonStyle = {
  padding: "10px 18px",
  borderRadius: "10px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const errorStyle = {
  margin: "0 12px 10px",
  padding: "8px 12px",
  background: "#fee2e2",
  color: "#dc2626",
  borderRadius: "8px",
  fontSize: "13px",
};
