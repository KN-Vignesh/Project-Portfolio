import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  BrainCircuit,
  Loader2,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const GeminiChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am Vignesh’s AI Portfolio Assistant. Ask me anything about Vignesh K N’s projects (Customer Churn, LoRA/QLoRA adaptation, BERT, VERO), software engineering background, or system architecture.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          thinking: thinkingMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'No response received from system.',
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Unable to communicate with the AI model right now. If running in a preview environment, ensure GEMINI_API_KEY is configured in the AI Studio Secrets panel.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="gemini-chat-toggle"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B] text-[#F2F2F2] hover:text-[#7CFF6B] p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all group cursor-pointer"
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-[#7CFF6B]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7CFF6B] animate-ping" />
        </div>
        <span className="font-mono text-xs hidden md:inline tracking-wider font-semibold">
          AI ASSISTANT
        </span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          id="gemini-chat-container"
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[460px] h-full sm:h-[620px] bg-[#101216] border border-[#24272D] rounded-none sm:rounded-xl flex flex-col shadow-2xl overflow-hidden"
          role="dialog"
          aria-labelledby="gemini-chat-title"
        >
          {/* Header */}
          <div className="bg-[#15181D] border-b border-[#24272D] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#08090B] border border-[#24272D] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-[#7CFF6B]" />
              </div>
              <div>
                <h3 id="gemini-chat-title" className="font-bold text-sm text-[#F2F2F2]">
                  PORTFOLIO INTELLIGENCE
                </h3>
                <p className="font-mono text-[10px] text-[#8B8F98]">
                  {thinkingMode ? 'GEMINI 3.1 PRO (HIGH THINKING)' : 'GEMINI 3.5 FLASH'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Thinking Mode Toggle */}
              <button
                type="button"
                onClick={() => setThinkingMode(!thinkingMode)}
                className={`font-mono text-[10px] px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                  thinkingMode
                    ? 'bg-[#6EA8FE]/20 border-[#6EA8FE] text-[#6EA8FE]'
                    : 'bg-[#08090B] border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
                title="Toggle High Thinking Mode (Uses gemini-3.1-pro-preview with ThinkingLevel.HIGH for deep architectural analysis)"
              >
                <Sparkles className="w-3 h-3" />
                <span>THINKING: {thinkingMode ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded border border-[#24272D] text-[#8B8F98] hover:text-[#F2F2F2] transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="bg-[#08090B] border-b border-[#24272D] px-3 py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
            <button
              onClick={() => {
                setInput('How does VERO synthesize SonarQube with LLMs?');
              }}
              className="px-2.5 py-1 rounded bg-[#15181D] border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] whitespace-nowrap"
            >
              VERO Architecture
            </button>
            <button
              onClick={() => {
                setInput('Explain the QLoRA 4-bit NF4 fine-tuning implementation.');
              }}
              className="px-2.5 py-1 rounded bg-[#15181D] border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] whitespace-nowrap"
            >
              QLoRA Pipeline
            </button>
            <button
              onClick={() => {
                setInput('What is Vignesh’s software engineering background before AI?');
              }}
              className="px-2.5 py-1 rounded bg-[#15181D] border border-[#24272D] text-[#8B8F98] hover:text-[#7CFF6B] whitespace-nowrap"
            >
              Background
            </button>
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded bg-[#15181D] border border-[#24272D] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#7CFF6B]" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-lg p-3 text-xs md:text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#7CFF6B] text-[#08090B] font-medium'
                      : 'bg-[#15181D] border border-[#24272D] text-[#F2F2F2] whitespace-pre-wrap'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded bg-[#24272D] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#F2F2F2]" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 items-center text-xs font-mono text-[#8B8F98]">
                <Loader2 className="w-4 h-4 animate-spin text-[#7CFF6B]" />
                <span>
                  {thinkingMode
                    ? 'Executing high thinking mode via Gemini 3.1 Pro...'
                    : 'Querying portfolio knowledge base...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#15181D] border-t border-[#24272D] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about AI engineering, projects, or architecture..."
              className="flex-1 bg-[#08090B] border border-[#24272D] focus:border-[#7CFF6B] rounded px-3 py-2 text-xs md:text-sm text-[#F2F2F2] placeholder-[#8B8F98] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded bg-[#7CFF6B] text-[#08090B] hover:bg-[#7CFF6B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
