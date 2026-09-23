import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Brain, RefreshCw, ChevronDown, Terminal, MessageSquare } from 'lucide-react';
import { generatePortfolioKnowledgeResponse } from '../utils/portfolioKnowledgeEngine';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const GeminiAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am Vignesh's AI Portfolio Assistant. You can ask me technical questions about his system architecture, projects (e.g., QLoRA, VERO, Customer Churn API), experience at ACL Digital / Enmarq, or engineering methodology."
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "How can I download Vignesh's resume?",
    "How does the QLoRA pipeline work?",
    "Explain VERO's AI code analysis architecture",
    "What did Vignesh build at ACL Digital?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          thinking: isThinkingMode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('NON_JSON_RESPONSE');
      }

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        return;
      }
      throw new Error('EMPTY_REPLY');
    } catch (err) {
      // Seamless fallback to built-in Portfolio Knowledge Engine
      const fallbackReply = generatePortfolioKnowledgeResponse(query, updatedMessages);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fallbackReply }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#101216]/95 backdrop-blur-md border border-[#7CFF6B]/50 hover:border-[#7CFF6B] text-[#F2F2F2] shadow-2xl shadow-black/80 flex items-center space-x-2 sm:space-x-2.5 font-mono text-xs transition-all hover:scale-105 cursor-pointer group"
          aria-label="Open AI Assistant"
        >
          <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#7CFF6B]/15 text-[#7CFF6B] flex items-center justify-center">
            <Bot className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#F2F2F2]">ASK AI AGENT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-16 md:bottom-6 right-2 sm:right-6 z-50 w-[96vw] sm:w-[420px] h-[550px] max-h-[80vh] bg-[#08090B] border border-[#24272D] rounded-xl shadow-2xl shadow-black flex flex-col font-mono overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-3.5 bg-[#101216] border-b border-[#24272D] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded border border-[#24272D] bg-[#15181D] flex items-center justify-center text-[#7CFF6B]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F2F2F2] flex items-center gap-1.5">
                  <span>AI ARCHITECTURE AGENT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B]"></span>
                </div>
                <div className="text-[10px] text-[#8B8F98]">Vignesh K N Knowledge Base</div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* High Thinking Toggle */}
              <button
                onClick={() => setIsThinkingMode(!isThinkingMode)}
                title={isThinkingMode ? "High Thinking Mode (gemini-3.1-pro-preview)" : "Standard Fast Mode (gemini-3.5-flash)"}
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                  isThinkingMode
                    ? 'bg-[#6EA8FE]/20 text-[#6EA8FE] border border-[#6EA8FE]/40'
                    : 'text-[#8B8F98] hover:text-[#F2F2F2]'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">{isThinkingMode ? "HIGH THINK" : "FAST"}</span>
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-[#8B8F98] hover:text-[#F2F2F2] hover:bg-[#15181D]"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Status Bar */}
          <div className="px-3 py-1 bg-[#101216]/60 border-b border-[#24272D] text-[10px] text-[#8B8F98] flex items-center justify-between">
            <span>MODEL: {isThinkingMode ? 'gemini-3.1-pro-preview (Thinking: HIGH)' : 'gemini-3.8-flash'}</span>
            <span className="text-[#7CFF6B]">CONNECTED</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="text-[10px] text-[#8B8F98] mb-1">
                  {msg.role === 'user' ? 'YOU' : 'PORTFOLIO AGENT'}
                </div>
                <div
                  className={`p-3 rounded-lg max-w-[90%] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#7CFF6B] text-[#08090B] font-medium'
                      : 'bg-[#101216] border border-[#24272D] text-[#F2F2F2]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-2 text-xs text-[#8B8F98]">
                <div className="p-3 rounded-lg bg-[#101216] border border-[#24272D] flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#7CFF6B] animate-spin" />
                  <span>
                    {isThinkingMode ? "Synthesizing deep architectural reasoning..." : "Consulting knowledge repository..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-[#08090B] border-t border-[#24272D] overflow-x-auto flex gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded bg-[#101216] border border-[#24272D] hover:border-[#7CFF6B] text-[10px] text-[#8B8F98] hover:text-[#F2F2F2] whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-[#101216] border-t border-[#24272D] flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask about projects, architecture, or skills..."
              className="flex-1 bg-[#08090B] border border-[#24272D] rounded px-3 py-2 text-xs text-[#F2F2F2] placeholder-[#8B8F98]/60 focus:outline-none focus:border-[#7CFF6B]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded bg-[#7CFF6B] text-[#08090B] hover:bg-[#7CFF6B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
