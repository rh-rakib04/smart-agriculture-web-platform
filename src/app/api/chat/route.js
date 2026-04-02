export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("GROQ KEY:", process.env.GROQ_API_KEY);

    // 🔥 GROQ API CALL (replaces OpenAI)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
   body: JSON.stringify({
  model: "llama3-8b-instant", // ✅ WORKING MODEL
  messages: [
    {
      role: "system",
      content: "You are a helpful AI assistant.",
    },
    {
      role: "user",
      content: message,
    },
  ],
}),
    });

const data = await response.json();

console.log("GROQ RESPONSE:", data); // 🔥 debug

// ✅ safer extraction
let reply = "⚠️ No response";

if (data.choices && data.choices.length > 0) {
  reply = data.choices[0].message?.content;
} else if (data.error) {
  reply = data.error.message;
}

return Response.json({ reply });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}