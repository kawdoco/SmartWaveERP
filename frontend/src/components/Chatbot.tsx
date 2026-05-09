"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { getStoredUser, productApi, posApi, supplierApi } from '@/lib/api';

const GEMINI_API_KEY = "AIzaSyBhwI0nzkxTblTNYLC-GHBwKblQdbdToLA";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'system' | 'user' | 'bot', content: string }[]>([
    { role: 'system', content: 'Hello! I am your SmartWave AI Assistant. Ask me anything about the system.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [systemContext, setSystemContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.role !== 'CASHIER') {
      setIsAllowed(true);
    }
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen && isAllowed) {
      Promise.all([
        productApi.getAll().catch(()=>[]),
        posApi.getAllSales().catch(()=>[]),
        supplierApi.getAll().catch(()=>[])
      ]).then(([products, sales, suppliers]) => {
        const lowStock = products.flatMap(p => p.variants.map(v => ({...v, productName: p.productName})))
          .filter(v => v.quantity <= 20)
          .map(v => `${v.productName} (${v.barcode}) - Qty: ${v.quantity}`);
        
        const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);

        let ctx = `\n\n--- CURRENT LIVE SYSTEM DATA ---\n`;
        ctx += `- Total Products: ${products.length}\n`;
        ctx += `- Total Suppliers: ${suppliers.length}\n`;
        ctx += `- Total Revenue: Rs. ${totalSales.toLocaleString('en-LK')}\n`;
        ctx += `- Low Stock Items (Qty <= 20): ${lowStock.length > 0 ? lowStock.join(', ') : 'None'}\n`;
        ctx += `If the user asks for exact data, use this context to answer directly instead of just telling them where to find it.`;
        
        setSystemContext(ctx);
      });
    }
  }, [isOpen, isAllowed]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const contents = newMessages.filter(m => m.role !== 'system').map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are the SmartWave ERP AI Assistant. Your job is to help the user with FAQs regarding the system. Keep your responses short, concise, and professional." + systemContext }]
          },
          contents
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Gemini API Error Response:", data);
        setMessages(prev => [...prev, { role: 'bot', content: `API Error: ${data.error?.message || res.statusText}` }]);
        return;
      }

      if (data.candidates && data.candidates.length > 0) {
        const botResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
      } else {
        console.error("Unexpected Gemini response:", data);
        setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I received an empty response from the AI." }]);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: `Connection error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  if (!isAllowed) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'system-ui, sans-serif' }}>
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '0',
          width: '350px',
          height: '500px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          animation: 'fade-in 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#0ea5e9',
            backgroundImage: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%' }}></div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Smart Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', opacity: 0.8 }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
              Today
            </div>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? '#2563eb' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#334155',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role !== 'user' ? '4px' : '16px',
                  maxWidth: '85%',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                    return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px',
            backgroundColor: '#ffffff'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: input.trim() ? '#2563eb' : '#e2e8f0',
                color: input.trim() ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} style={{ marginLeft: input.trim() ? '2px' : '0' }} />}
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundImage: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
        onMouseOver={(e) => !isOpen && (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => !isOpen && (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
