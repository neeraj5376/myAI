import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ai from "./assets/ai.png";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
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
        {
          message: userText,
        }
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
          text: "Sorry, something went wrong. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: true,
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
     <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-auto">
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto backdrop-blur-xl bg-zinc-900/70 border-b border-zinc-800 px-3 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-lg">
        <div className="flex flex-col justify-center sm:flex-row items-center gap-3 w-full">
          <img
            src={ai}
            alt="AI"
            className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
          />

          <h1 className="text-xl sm:text-3xl font-bold text-center sm:text-left">
            I am your <br /> AI Assistant
          </h1>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto space-y-5">
          {messages.length === 0 && (
            <div className="h-[70vh] flex items-center justify-center px-4">
              <h2 className="text-2xl sm:text-5xl font-extrabold text-center text-zinc-300">
                Welcome Your AI Assistant
              </h2>
            </div>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={index}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[95%] sm:max-w-[75%] flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-lg whitespace-pre-wrap break-words ${
                      isUser
                        ? "bg-white text-black rounded-br-md"
                        : msg.isError
                        ? "bg-red-900/30 border border-red-700 text-red-200 rounded-bl-md"
                        : "bg-zinc-800 border border-zinc-700 text-white rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span className="text-[10px] text-zinc-500 mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 p-2 sm:p-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3 items-end bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
          <textarea
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 min-h-[42px] sm:min-h-[48px] max-h-36 bg-transparent text-white placeholder-zinc-500 resize-none outline-none px-3 py-2 text-sm sm:text-base"
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim() || loading}
            className="w-full sm:w-auto bg-white text-black font-semibold px-4 sm:px-5 py-2 rounded-xl hover:bg-zinc-200 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;