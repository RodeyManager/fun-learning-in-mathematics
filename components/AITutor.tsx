import React, { useState, useEffect, useRef } from 'react';
import { createMathTutorChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { motion } from 'framer-motion';
import { Send, Bot, Sparkles, User } from 'lucide-react';
import { Chat } from '@google/genai';

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "你好呀！我是数学小博士 🧙‍♂️。我可以帮你解决难题或者解释数学概念。尽管问我吧！" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    if (!chatRef.current) {
      chatRef.current = createMathTutorChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      const responseText = result.text || "我现在脑子有点转不过来，再试一次吧！";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "哎呀！出错了。我们再试一次好吗？" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-[600px] flex flex-col">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-100 flex flex-col h-full overflow-hidden">
        <div className="bg-purple-600 p-4 flex items-center gap-3 text-white shadow-md z-10">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">问问数学小博士</h2>
            <p className="text-xs text-purple-200">AI 智能驱动</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm flex gap-3 ${
                msg.role === 'user' 
                  ? 'bg-purple-500 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 rounded-bl-none border border-purple-100'
              }`}>
                {msg.role === 'model' && <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.role === 'user' && <User className="w-5 h-5 text-purple-200 shrink-0 mt-1" />}
              </div>
            </motion.div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 rounded-bl-none border border-purple-100 shadow-sm flex gap-2 items-center">
                    <Bot className="w-5 h-5 text-purple-400 animate-bounce" />
                    <span className="text-slate-400 text-sm italic">思考中...</span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="问我一个数学问题..."
              className="flex-1 bg-slate-700 text-white placeholder-slate-400 border-2 border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-xl px-6 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};