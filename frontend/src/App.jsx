import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ai from "./assets/ai.png"

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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please check your connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
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
    <div className="h-screen flex flex-col bg-zinc-950 font-sans antialiased selection:bg-zinc-700 selection:text-zinc-200">

      {/* Header */}
      <header className="backdrop-blur-xl bg-zinc-900/50 border-b border-zinc-800 px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <div className="flex items-center gap-3">
            <div className="relative flex ">
              <img className=" size-22" src={ai} alt="" />
            </div>
            <h1 className="text-3xl pl-10 font-bold tracking-tight text-zinc-100">
              I am your <br /> AI Assistant.
            </h1>

          </div>
        </div>
        

      </header>


      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 bg-zinc-900/10">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Empty State Welcome Screen */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-50 text-center px-4">

              <h2 className="text-4xl p-10 fixed uppercase font-extrabold tracking-tight text-zinc-100">
                wall come your ai assistant.
              </h2>

            </div>
          )}

          {/* Messages Loop */}
          {messages.map((msg, index) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={index}
                className={`flex gap-4 items-start ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400 mt-1 shrink-0 shadow-md">
                    AI
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl shadow-md transition-all duration-200 whitespace-pre-wrap text-[15px] leading-relaxed ${isUser
                        ? "bg-zinc-100 text-zinc-900 font-medium rounded-tr-sm"
                        : msg.isError
                          ? "bg-red-950/40 border border-red-900/50 text-red-200 rounded-tl-sm"
                          : "bg-zinc-800/90 border border-zinc-700 text-zinc-100 rounded-tl-sm"
                      }`}
                  >
                    {msg.text}
                  </div>

                  {msg.timestamp && (
                    <span className="text-[10px] text-zinc-500 mt-1.5 px-1 tracking-wider">
                      {msg.timestamp}
                    </span>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-700 border border-zinc-600 flex items-center justify-center text-xs font-bold text-zinc-200 mt-1 shrink-0 shadow-md">
                    ME
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-4 items-start justify-start">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500 mt-1">
                ..
              </div>
              <div className="bg-zinc-800/40 border border-zinc-700 px-5 py-4 rounded-2xl rounded-tl-sm shadow-lg">
                <div className="flex gap-1.5 items-center py-1 px-0.5">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-duration:1s]"></div>
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-zinc-800 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
        <div className="max-w-3xl mx-auto flex gap-3 items-end bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-zinc-600 transition-all shadow-inner">

          <textarea
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 rounded-xl pl-3 pr-2 py-2.5 outline-none resize-none text-[15px] max-h-32 min-h-[40px] leading-normal"
            style={{ height: 'auto' }}
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim() || loading}
            className="bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 px-5 py-2.5 rounded-xl text-zinc-950 disabled:text-zinc-600 font-bold text-sm shadow-md active:scale-[0.98] transition-all disabled:pointer-events-none flex items-center gap-1.5 h-[40px]"
          >
            <span>Send</span>
            <svg className="w-3.5 h-3.5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>

        </div>
      </footer>
    </div>
  );
}

export default App;