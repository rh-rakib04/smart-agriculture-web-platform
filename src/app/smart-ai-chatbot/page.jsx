"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function page() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMsg = {
      text: message,
      type: "user",
      time: new Date().toLocaleTimeString()
    };

    setChats(prev => [...prev, userMsg]);
    setMessage("");

    // AI Response Simulation (Replace with API later)
    setTyping(true);

    setTimeout(() => {
      setChats(prev => [
        ...prev,
        {
          text: "🌱 AI Assistant is analyzing your query...",
          type: "ai",
          time: new Date().toLocaleTimeString()
        }
      ]);

      setTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-6">

      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-4xl font-bold text-primary">
          🤖 Smart Agriculture AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask anything about farming, weather & crops 🌱
        </p>
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-xl flex flex-col h-[600px]">

        {/* Chat Messages */}
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
              🤖 AI is typing...
            </div>
          )}

        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-border flex gap-3">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about crops, weather or farming..."
            className="flex-1 p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
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