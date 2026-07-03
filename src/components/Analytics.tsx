'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { TrendingUp, Users, CheckSquare, Clock, Award } from 'lucide-react';

const weeklyData = [
  { week: 'W1', completed: 18, created: 24, overdue: 3 },
  { week: 'W2', completed: 22, created: 19, overdue: 2 },
  { week: 'W3', completed: 31, created: 28, overdue: 4 },
  { week: 'W4', completed: 27, created: 32, overdue: 1 },
];

const teamPerf = [
  { name: 'Rasel', tasks: 14, rating: 4.8 },
  { name: 'Sadia', tasks: 18, rating: 4.9 },
  { name: 'Tanvir', tasks: 22, rating: 4.7 },
  { name: 'Jannatul', tasks: 10, rating: 4.6 },
  { name: 'Rahim', tasks: 12, rating: 4.5 },
  { name: 'Nazma', tasks: 30, rating: 5.0 },
];

const projectDist = [
  { name: 'Web Apps', value: 40, color: '#7c3aed' },
  { name: 'Mobile', value: 25, color: '#a855f7' },
  { name: 'E-commerce', value: 20, color: '#3b82f6' },
  { name: 'Enterprise', value: 15, color: '#10b981' },
];

const monthlyTrend = [
  { month: 'Jan', projects: 3, tasks: 45 },
  { month: 'Feb', projects: 5, tasks: 62 },
  { month: 'Mar', projects: 4, tasks: 58 },
  { month: 'Apr', projects: 7, tasks: 89 },
  { month: 'May', projects: 6, tasks: 102 },
  { month: 'Jun', projects: 8, tasks: 125 },
  { month: 'Jul', projects: 10, tasks: 156 },
];

export default function Analytics() {
  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Task Completion Rate', value: '78%', trend: '+12%', icon: CheckSquare, gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#4f46e5' },
          { label: 'Team Productivity', value: '94%', trend: '+5%', icon: Users, gradient: 'linear-gradient(135deg, #10b981, #34d399)', color: '#10b981' },
          { label: 'Avg Task Duration', value: '2.4d', trend: '-0.3d', icon: Clock, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#f59e0b' },
          { label: 'Projects On Track', value: '83%', trend: '+8%', icon: Award, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#3b82f6' },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: k.gradient, opacity: 0.08, filter: 'blur(20px)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8, letterSpacing: '0.02em' }}>{k.label}</p>
                <p style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{k.value}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <TrendingUp size={11} color="var(--success)" />
                  <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>{k.trend}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs last month</span>
                </div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${k.color}30` }}>
                <k.icon size={20} color="white" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="chart-grid" style={{ marginBottom: 20 }}>
        {/* Monthly Trend */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Trend</h2>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Projects & Tasks created over time</p>
            </div>
            <select style={{ fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', background: 'white', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0edff" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="tasks" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} name="Tasks" />
              <Line type="monotone" dataKey="projects" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 4 }} name="Projects" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Project Distribution */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Project Categories</h2>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>Distribution by project type</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={projectDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {projectDist.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {projectDist.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Weekly Task Activity */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Weekly Task Activity</h2>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>Completed vs created vs overdue</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0edff" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="completed" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="created" fill="#a855f7" radius={[4, 4, 0, 0]} name="Created" />
              <Bar dataKey="overdue" fill="#fca5a5" radius={[4, 4, 0, 0]} name="Overdue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Team Performance</h2>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>Tasks completed per member</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={teamPerf} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0edff" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="tasks" radius={[0, 6, 6, 0]} name="Tasks">
                {teamPerf.map((_, i) => (
                  <Cell key={i} fill={`hsl(${260 + i * 15}, 70%, ${55 + i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
