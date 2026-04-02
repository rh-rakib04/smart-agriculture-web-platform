"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/shared/Header";
import Image from "next/image";

// 🌿 Banner (same style)
function PageBanner() {
  return (
    <div className="relative h-56 sm:h-64 w-full">
      <Image
        src="/images/planner-bg.jpg"
        alt="AI Assistant"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          🌱 KrishiNova AI Assistant
        </h1>
        <p className="text-white/70 text-sm mt-2">
          Ask anything about crops & farming
        </p>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

const sendMessage = async () => {
  if (!message) return;

  const newChat = [...chat, { role: "user", text: message }];
  setChat(newChat);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setChat([
      ...newChat,
      { role: "bot", text: data.reply || "⚠️ No response" },
    ]);
  } catch (error) {
    setChat([
      ...newChat,
      { role: "bot", text: "❌ Error connecting to server" },
    ]);
  }

  setMessage("");
};

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner */}
      <PageBanner />

      {/* SAME CONTAINER STYLE AS YOUR WEATHER PAGE */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl shadow-xl p-6"
        >
          {/* Chat Box */}
          <div className="h-80 overflow-y-auto border rounded-xl p-3 mb-4">
            {chat.map((msg, i) => (
              <div key={i} className="mb-2">
                <span className="font-bold">
                  {msg.role === "user" ? "You" : "AI"}:
                </span>{" "}
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about crops..."
              className="flex-1 border p-3 rounded-xl"
            />

            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-5 rounded-xl"
            >
              Send
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}