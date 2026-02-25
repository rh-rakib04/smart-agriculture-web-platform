"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function page() {

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [typing, setTyping] = useState(false);

  // Only for testing (Never use in production)
  const GEMINI_KEY = "AIzaSyDC596Nq2X5ekDqqzm5cFmz4RHhhzshGP4";

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = {
      text: message,
      type: "user",
      time: new Date().toLocaleTimeString()
    };

    setChats(prev => [...prev, userMsg]);
    setMessage("");

    try {
      setTyping(true);

      // ⭐ Gemini API Call
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
You are Agriculture Expert AI.

User Question:
${message}

Give short farming / crop related answer.
                    `
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await res.json();

      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I can't respond now.";

      setChats(prev => [
        ...prev,
        {
          text: aiReply,
          type: "ai",
          time: new Date().toLocaleTimeString()
        }
      ]);

    } catch {
      setChats(prev => [
        ...prev,
        {
          text: "AI response failed",
          type: "ai"
        }
      ]);
    }

    setTyping(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-6">

      <div className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-4xl font-bold text-primary">
          🤖 Smart Agriculture AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask about crops, farming & weather 🌱
        </p>
      </div>

      {/* Chat Box */}
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-xl flex flex-col h-[500px]">

        <div className="flex-1 p-6 overflow-y-auto space-y-4">

          {chats.map((chat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
                chat.type === "user"
                  ? "ml-auto bg-primary text-white"
                  : "mr-auto bg-muted"
              }`}
            >
              <p>{chat.text}</p>

              <span className="text-xs opacity-70 block mt-2">
                {chat.time}
              </span>
            </motion.div>
          ))}

          {typing && (
            <div className="text-sm text-muted-foreground animate-pulse">
              🤖 AI is thinking...
            </div>
          )}

        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex gap-3">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about farming..."
            className="flex-1 p-3 rounded-xl border border-border bg-background"
          />

          <button
            onClick={sendMessage}
            className="px-6 bg-primary text-white rounded-xl hover:opacity-90 transition"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}