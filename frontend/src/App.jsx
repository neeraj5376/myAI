import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ai from "./assets/ai.png";
import Header from "./Hearder"

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userText = message;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://myai-g3qt.onrender.com/api/chat",
        { message: userText }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error(error);

         setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
         text: res.data.reply,
          text: (res.data.reply || "").replace(/\\n/g, "\n"),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">

      {/* Header */}
      <Header/>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto max-h-[90%] px-3 sm:px-5 py-4">
        <div className="max-w-4xl mx-auto">

          {/* Welcome Screen */}
          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-zinc-200 uppercase">
                Welcome Your AI Assistant
              </h2>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-5">
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user";

              return (
                <div
                  key={index}
                  className={`flex gap-2 sm:gap-4 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-white shrink-0">
                      AI
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${
                      isUser ? "items-end" : "items-start"
                    } max-w-[80%] sm:max-w-[70%]`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm sm:text-base whitespace-pre-wrap break-words ${
                        isUser
                          ? "bg-white text-black rounded-tr-sm"
                          : msg.isError
                          ? "bg-red-900/30 border border-red-800 text-red-200 rounded-tl-sm"
                          : "bg-zinc-800 text-white border border-zinc-700 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>

                    <span className="text-[10px] sm:text-xs text-zinc-500 mt-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-zinc-700 border border-zinc-600 flex items-center justify-center text-xs text-white shrink-0">
                      ME
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
                  AI
                </div>

                <div className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-zinc-800 bg-zinc-950 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2">

            <textarea
              rows="1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white placeholder-zinc-500 resize-none outline-none px-3 py-2 text-sm sm:text-base"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              className="bg-white text-black px-4 sm:px-5 py-2.5 rounded-xl font-semibold disabled:opacity-50 transition"
            >
              Send
            </button>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;