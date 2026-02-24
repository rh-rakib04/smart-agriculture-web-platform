"use client";

import { useState } from "react";

export default function ChatCard() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🌾 Hello! I am your AI Crop Assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // 🔥 Temporary Fake AI Response (Later connect API)
    setTimeout(() => {
      const botReply = {
        role: "assistant",
        content: "🌱 Based on current weather, rice or wheat could be suitable."
      };

      setMessages((prev) => [...prev, botReply]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-screen max-h-screen bg-white shadow-xl rounded-2xl p-4 max-w-md mx-auto flex flex-col h-[500px]">

      <h2 className="text-xl font-bold text-center mb-3">
        🤖 AI Crop Assistant
      </h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.role === "user"
                ? "bg-green-600 text-white ml-auto"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 p-3 rounded-xl w-fit">
            Typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about crops..."
          className="border p-3 rounded-xl flex-1 outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}