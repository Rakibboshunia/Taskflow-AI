'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FolderOpen, CheckCircle, Clock, Users, MoreHorizontal,
  TrendingUp, TrendingDown, Bot, Sparkles, Send, Zap,
  ArrowUpRight, AlertCircle, CheckSquare
} from 'lucide-react';

const activityData = [
  { day: 'Mon', tasks: 42 },
  { day: 'Tue', tasks: 55 },
  { day: 'Wed', tasks: 48 },
  { day: 'Thu', tasks: 70 },
  { day: 'Fri', tasks: 95 },
  { day: 'Sat', tasks: 60 },
  { day: 'Sun', tasks: 35 },
];

const recentProjects = [
  { name: 'AI SaaS Dashboard', updated: '2h ago', progress: 75, members: ['AR', 'SI', 'TH'], extra: 3, status: 'In Progress', color: '#7c3aed' },
  { name: 'E-commerce Platform', updated: '5h ago', progress: 60, members: ['AR', 'SI'], extra: 2, status: 'In Progress', color: '#7c3aed' },
  { name: 'Mobile Banking App', updated: '1d ago', progress: 90, members: ['TH', 'JF', 'AR', 'SI'], extra: 4, status: 'Review', color: '#f59e0b' },
  { name: 'Marketing Website', updated: '2d ago', progress: 40, members: ['SI', 'AR'], extra: 1, status: 'Planning', color: '#94a3b8' },
];

const upcomingTasks = [
  { title: 'UI/UX Design Review', project: 'Website Redesign', date: 'May 20', priority: 'high' },
  { title: 'API Integration', project: 'Mobile App', date: 'May 21', priority: 'medium' },
  { title: 'Database Optimization', project: 'Dashboard', date: 'May 22', priority: 'medium' },
  { title: 'Testing & Bug Fixes', project: 'E-commerce Platform', date: 'May 23', priority: 'low' },
];

const teamMembers = [
  { name: 'Rasel Ahmed', role: 'UI/UX Designer', initials: 'RA', status: 'online', color: '#7c3aed' },
  { name: 'Sadia Islam', role: 'Frontend Developer', initials: 'SI', status: 'online', color: '#a855f7' },
  { name: 'Tanvir Hasan', role: 'Backend Developer', initials: 'TH', status: 'away', color: '#3b82f6' },
  { name: 'Jannatul Ferdaus', role: 'QA Engineer', initials: 'JF', status: 'online', color: '#10b981' },
];

const aiSuggestions = [
  'Generate project summary',
  'Suggest tasks for this project',
  'Analyze project performance',
];

function StatCard({ icon: Icon, label, value, trend, trendUp, gradient, iconColor }: any) {
  return (
    <div className="card" style={{ padding: '20px', display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
      {/* Glow accent */}
      <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: gradient, opacity: 0.08, filter: 'blur(20px)', pointerEvents: 'none' }} />
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 20px ${iconColor}30`
      }}>
        <Icon size={22} color="white" strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>{label}</p>
          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <MoreHorizontal size={14} />
          </button>
        </div>
        <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: 4, letterSpacing: '-0.5px' }}>{value}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          {trendUp
            ? <TrendingUp size={12} color="var(--success)" />
            : <TrendingDown size={12} color="var(--danger)" />}
          <span style={{ fontSize: 11, color: trendUp ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
            {trend}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>from last month</span>
        </div>
      </div>
    </div>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    high: '#ef4444', medium: '#f59e0b', low: '#10b981'
  };
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      background: colors[priority] || '#94a3b8',
      display: 'inline-block', flexShrink: 0
    }} />
  );
}

export default function Dashboard({ setActivePage }: { setActivePage?: (page: any) => void }) {
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiSend = (text?: string) => {
    const msg = text || aiInput;
    if (!msg.trim()) return;
    setAiMessages(prev => [...prev, { role: 'user', text: msg }]);
    setAiInput('');
    setAiLoading(true);
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        role: 'ai',
        text: `I've analyzed your request: "${msg}". Based on your current project data, I recommend prioritizing the AI SaaS Dashboard tasks this week as it has the highest ROI potential. Your team's velocity is up 12% this month – great work! 🎯`
      }]);
      setAiLoading(false);
    }, 1200);
  };

  const donutData = [
    { label: 'Completed', value: 8, color: '#7c3aed', pct: 33 },
    { label: 'In Progress', value: 10, color: '#a855f7', pct: 42 },
    { label: 'Planning', value: 6, color: '#e2d9f3', pct: 25 },
  ];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 1400 }}>
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon={FolderOpen} label="Total Projects" value="24" trend="12%" trendUp={true} gradient="linear-gradient(135deg, #4f46e5, #7c3aed)" iconColor="#4f46e5" />
        <StatCard icon={CheckCircle} label="Tasks Completed" value="156" trend="18%" trendUp={true} gradient="linear-gradient(135deg, #10b981, #34d399)" iconColor="#10b981" />
        <StatCard icon={Clock} label="In Progress" value="12" trend="5%" trendUp={false} gradient="linear-gradient(135deg, #f59e0b, #fbbf24)" iconColor="#f59e0b" />
        <StatCard icon={Users} label="Total Members" value="18" trend="8%" trendUp={true} gradient="linear-gradient(135deg, #3b82f6, #60a5fa)" iconColor="#3b82f6" />
      </div>

      {/* Main Grid: Chart + AI */}
      <div className="main-grid" style={{ marginBottom: 20 }}>
        {/* Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Project Activity</h2>
            <select style={{
              fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '5px 10px', background: 'white', cursor: 'pointer',
              fontFamily: 'inherit', outline: 'none'
            }}>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0edff" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              <Area
                type="monotone" dataKey="tasks" stroke="#7c3aed" strokeWidth={2.5}
                fill="url(#taskGrad)" dot={{ fill: '#7c3aed', r: 4, strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6, fill: '#7c3aed' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Assistant */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>AI Assistant</h2>
            <span style={{
              background: '#ede9fe', color: '#7c3aed', fontSize: 9, fontWeight: 700,
              padding: '2px 8px', borderRadius: 10, letterSpacing: '0.05em'
            }}>Beta</span>
            <Sparkles size={14} color="#a855f7" style={{ marginLeft: 'auto' }} />
          </div>

          {aiMessages.length === 0 ? (
            <>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                How can I help you today?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {aiSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleAiSend(s)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                      background: 'var(--bg-main)', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: 12, color: 'var(--text-secondary)', textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#a855f7';
                      e.currentTarget.style.background = '#faf5ff';
                      e.currentTarget.style.color = '#7c3aed';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-main)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {s}
                    <ArrowUpRight size={12} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {aiMessages.map((m, i) => (
                <div key={i} style={{
                  padding: '8px 12px', borderRadius: 10,
                  background: m.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'var(--bg-main)',
                  color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: 12, lineHeight: 1.5,
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}>{m.text}</div>
              ))}
              {aiLoading && (
                <div style={{
                  padding: '8px 12px', borderRadius: 10, background: 'var(--bg-main)',
                  fontSize: 12, color: 'var(--text-muted)'
                }}>Thinking… ✨</div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiSend()}
              placeholder="Ask AI Assistant..."
              className="input-field"
              style={{ flex: 1, fontSize: 12 }}
            />
            <button
              onClick={() => handleAiSend()}
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Send size={14} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 220px', gap: 20 }}>
        {/* Recent Projects */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Projects</h2>
            <button onClick={() => setActivePage && setActivePage('projects')} style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              View all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentProjects.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)',
                transition: 'all 0.2s', cursor: 'pointer'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#a855f7'; (e.currentTarget as HTMLDivElement).style.background = '#faf5ff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: '#ede9fe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <FolderOpen size={16} color="#7c3aed" />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated {p.updated}</p>
                </div>
                {/* Progress */}
                <div style={{ width: 120 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)' }}>{p.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                {/* Members */}
                <div style={{ display: 'flex', marginLeft: 4 }}>
                  {p.members.slice(0, 2).map((m, j) => (
                    <div key={j} style={{
                      width: 24, height: 24, borderRadius: '50%', marginLeft: j === 0 ? 0 : -8,
                      background: `hsl(${(j * 40 + 260)}, 70%, 60%)`,
                      border: '2px solid white', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white'
                    }}>{m}</div>
                  ))}
                  {p.extra > 0 && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', marginLeft: -8,
                      background: '#e2d9f3', border: '2px solid white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, fontWeight: 700, color: '#7c3aed'
                    }}>+{p.extra}</div>
                  )}
                </div>
                {/* Status */}
                <span className={`badge ${p.status === 'In Progress' ? 'badge-primary' : p.status === 'Review' ? 'badge-warning' : 'badge-info'}`}
                  style={{ flexShrink: 0 }}>
                  {p.status}
                </span>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <MoreHorizontal size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Upcoming Tasks</h2>
            <button onClick={() => setActivePage && setActivePage('tasks')} style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              View all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingTasks.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <PriorityDot priority={t.priority} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{t.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{t.project}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#7c3aed', whiteSpace: 'nowrap' }}>{t.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team + Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Team */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Team Members</h2>
              <button onClick={() => setActivePage && setActivePage('team')} style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>View all</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {teamMembers.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: m.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700
                  }}>{m.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.role}</p>
                  </div>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                    background: m.status === 'online' ? '#10b981' : '#f59e0b'
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Project Progress Donut */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Project Progress</h2>
              <button onClick={() => setActivePage && setActivePage('analytics')} style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>View report</button>
            </div>
            {/* Simple donut using CSS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f0edff" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#7c3aed" strokeWidth="4"
                    strokeDasharray={`${33 * 0.88} 88`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#a855f7" strokeWidth="4"
                    strokeDasharray={`${42 * 0.88} 88`} strokeDashoffset={`-${33 * 0.88}`} strokeLinecap="round" />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>24</span>
                  <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>Total</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {donutData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{d.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', marginLeft: 'auto' }}>
                      {d.value} ({d.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
