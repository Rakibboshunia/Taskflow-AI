'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Zap, BarChart3, FileText, RefreshCw, Copy, ThumbsUp, ThumbsDown, Cpu } from 'lucide-react';

const suggestions = [
  { icon: Sparkles, title: 'Generate project summary', desc: 'Get a comprehensive summary of your current project status' },
  { icon: Zap, title: 'Suggest tasks for this project', desc: 'AI-powered task recommendations based on project goals' },
  { icon: BarChart3, title: 'Analyze project performance', desc: 'Deep dive into metrics and performance insights' },
  { icon: FileText, title: 'Create project report', desc: 'Generate a detailed report for stakeholders' },
];

const aiResponses: Record<string, string> = {
  default: "I've analyzed your request and here's what I found based on your project data:\n\n**Key Insights:**\n• Your AI SaaS Dashboard is at 75% completion — on track for the deadline\n• Team velocity has increased by 18% this month 🚀\n• 3 tasks are flagged as high priority and need immediate attention\n• Mobile Banking App is in the Review phase — estimated completion in 3 days\n\n**Recommendations:**\n1. Reassign 2 overdue tasks from the E-commerce project\n2. Schedule a code review session for the Banking App\n3. Consider breaking down the Marketing Website tasks into smaller sprints\n\nWould you like me to take any specific action?",
};

type Message = { role: 'user' | 'ai'; text: string; time: string };

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hello! I'm your TaskFlow AI Assistant. I can help you analyze projects, suggest tasks, generate reports, and much more. What would you like to explore today? ✨",
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [liked, setLiked] = useState<Record<number, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: msg, time: now }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: aiResponses.default,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([{ role: 'ai', text: "Hello! I'm your TaskFlow AI Assistant. I can help you analyze projects, suggest tasks, generate reports, and much more. What would you like to explore today? ✨", time: 'Just now' }]);
    setLiked({});
    setCopied(null);
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="main-grid ai-layout" style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Chat */}
      <div className="card ai-chat-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.05))'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(124,58,237,0.3)'
          }}>
            <Cpu size={22} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>AI Assistant</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Online – GPT-4 powered</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 11 }} onClick={clearChat}>
              <RefreshCw size={12} /> Clear chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12,
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}>
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: m.role === 'ai'
                  ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                  : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {m.role === 'ai' ? <Sparkles size={14} color="white" /> : <span style={{ fontSize: 10, fontWeight: 700, color: 'white' }}>AR</span>}
              </div>

              {/* Bubble */}
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                    : 'var(--bg-main)',
                  border: m.role === 'ai' ? '1px solid var(--border)' : 'none',
                  fontSize: 13, lineHeight: 1.6,
                  color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                  whiteSpace: 'pre-line'
                }}>
                  {m.text}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.time}</span>
                  {m.role === 'ai' && (
                    <>
                      <button onClick={() => copyText(m.text, i)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: copied === i ? '#10b981' : 'var(--text-muted)', padding: 2, transition: 'color 0.2s' }} title={copied === i ? 'Copied!' : 'Copy'}>
                        <Copy size={11} />
                      </button>
                      <button onClick={() => setLiked(p => ({ ...p, [i]: p[i] === 'up' ? undefined as any : 'up' }))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: liked[i] === 'up' ? '#10b981' : 'var(--text-muted)', padding: 2, transition: 'color 0.2s' }}><ThumbsUp size={11} /></button>
                      <button onClick={() => setLiked(p => ({ ...p, [i]: p[i] === 'down' ? undefined as any : 'down' }))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: liked[i] === 'down' ? '#ef4444' : 'var(--text-muted)', padding: 2, transition: 'color 0.2s' }}><ThumbsDown size={11} /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="white" />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#a855f7',
                      animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask me anything about your projects... (Enter to send)"
              rows={2}
              style={{
                flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 12,
                fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', lineHeight: 1.5,
                color: 'var(--text-primary)', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#a855f7'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => send()}
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
            AI responses are generated based on your project data. Always verify important decisions.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Quick Actions */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(s.title)}
                style={{
                  display: 'flex', gap: 12, padding: '12px', borderRadius: 10,
                  border: '1px solid var(--border)', background: 'var(--bg-main)',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  transition: 'all 0.2s', alignItems: 'flex-start'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.07)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#a855f7'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-main)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={15} color="#7c3aed" />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>AI Capabilities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Project risk analysis', 'Smart task prioritization',
              'Team workload balancing', 'Deadline predictions',
              'Budget optimization', 'Resource allocation'
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
