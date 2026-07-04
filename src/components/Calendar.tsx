'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type CalEvent = { title: string; time: string; color: string; project: string };

const colorOptions = ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#a855f7', '#ef4444', '#ec4899'];

const initialEvents: Record<string, CalEvent[]> = {
  '2026-07-03': [
    { title: 'Design Review', time: '10:00 AM', color: '#7c3aed', project: 'AI Dashboard' },
    { title: 'Team Standup', time: '9:00 AM', color: '#10b981', project: 'All Projects' },
  ],
  '2026-07-07': [{ title: 'Sprint Planning', time: '2:00 PM', color: '#f59e0b', project: 'E-commerce' }],
  '2026-07-10': [
    { title: 'Client Demo', time: '4:00 PM', color: '#3b82f6', project: 'Mobile App' },
    { title: 'Code Review', time: '11:00 AM', color: '#a855f7', project: 'Banking App' },
  ],
  '2026-07-15': [{ title: 'Product Launch', time: '12:00 PM', color: '#ef4444', project: 'SaaS Platform' }],
  '2026-07-20': [{ title: 'Retrospective', time: '3:00 PM', color: '#10b981', project: 'All Teams' }],
};

const defaultForm = { title: '', time: '10:00 AM', color: '#7c3aed', project: '' };

export default function Calendar() {
  const [current, setCurrent] = useState(new Date(2026, 6, 1));
  const [selected, setSelected] = useState<string | null>('2026-07-03');
  const [events, setEvents] = useState<Record<string, CalEvent[]>>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString('default', { month: 'long' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const fmtKey = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const todayKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  const openAddEvent = () => { setForm(defaultForm); setShowModal(true); };

  const saveEvent = () => {
    if (!form.title.trim() || !selected) return;
    const newEvent: CalEvent = { title: form.title, time: form.time, color: form.color, project: form.project || 'General' };
    setEvents(prev => ({ ...prev, [selected]: [...(prev[selected] || []), newEvent] }));
    setShowModal(false);
  };

  const deleteEvent = (dateKey: string, idx: number) => {
    setEvents(prev => {
      const updated = [...(prev[dateKey] || [])];
      updated.splice(idx, 1);
      if (updated.length === 0) {
        const rest = { ...prev };
        delete rest[dateKey];
        return rest;
      }
      return { ...prev, [dateKey]: updated };
    });
  };

  return (
    <div className="main-grid" style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Calendar Grid */}
      <div className="card" style={{ padding: '24px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
            {monthName} <span className="gradient-text">{year}</span>
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setCurrent(new Date(year, month - 1, 1))}
              style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrent(new Date(year, month + 1, 1))}
              style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
              <ChevronRight size={16} />
            </button>
            <button className="btn-primary" style={{ marginLeft: 4 }} onClick={() => { if (selected) openAddEvent(); }}>
              <Plus size={14} /> Add Event
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, marginBottom: 8 }}>
          {daysOfWeek.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', padding: '8px 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {cells.map((day, i) => {
            const key = day ? fmtKey(day) : null;
            const dayEvents = key ? (events[key] || []) : [];
            const isToday = key === todayKey;
            const isSelected = key === selected;
            return (
              <div key={i} onClick={() => day && setSelected(key)}
                style={{
                  minHeight: 80, padding: '8px', borderRadius: 10,
                  background: isSelected ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : isToday ? 'rgba(124,58,237,0.1)' : 'var(--bg-main)',
                  border: `1px solid ${isSelected ? 'transparent' : isToday ? '#c4b5fd' : 'transparent'}`,
                  cursor: day ? 'pointer' : 'default', transition: 'all 0.15s', opacity: day ? 1 : 0,
                }}
                onMouseEnter={e => { if (day && !isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(124,58,237,0.07)'; }}
                onMouseLeave={e => { if (day && !isSelected) (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-main)'; }}>
                {day && (
                  <>
                    <span style={{ fontSize: 13, fontWeight: isToday || isSelected ? 800 : 500, color: isSelected ? 'white' : isToday ? '#7c3aed' : 'var(--text-primary)', display: 'block', marginBottom: 4 }}>{day}</span>
                    {dayEvents.slice(0, 2).map((ev, j) => (
                      <div key={j} style={{ padding: '2px 6px', borderRadius: 4, marginBottom: 2, background: isSelected ? 'rgba(255,255,255,0.25)' : `${ev.color}20`, fontSize: 9, fontWeight: 600, color: isSelected ? 'white' : ev.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: 9, color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>+{dayEvents.length - 2} more</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {selected ? new Date(selected + 'T00:00:00').toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
            </h3>
            {selected && (
              <button className="btn-primary" style={{ padding: '5px 10px', fontSize: 11 }} onClick={openAddEvent}>
                <Plus size={11} /> Add
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>
            {selected && events[selected] ? `${events[selected].length} event(s)` : 'No events'}
          </p>

          {selected && events[selected] ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {events[selected].map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px', borderRadius: 10, background: 'var(--bg-main)', border: `1px solid ${ev.color}25`, transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = ev.color}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${ev.color}25`}>
                  <div style={{ width: 3, height: 'auto', alignSelf: 'stretch', background: ev.color, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{ev.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ev.time} • {ev.project}</p>
                  </div>
                  <button onClick={() => deleteEvent(selected, i)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', padding: 2, opacity: 0.6, flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.6'}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No events for this day</p>
              <button className="btn-primary" style={{ marginTop: 12, fontSize: 12 }} onClick={openAddEvent}><Plus size={12} /> Add Event</button>
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Upcoming Events</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(events).sort().slice(0, 4).map(([date, evts]) => (
              <div key={date} onClick={() => setSelected(date)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                <div style={{ textAlign: 'center', minWidth: 36 }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>{new Date(date + 'T00:00:00').getDate()}</p>
                  <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{new Date(date + 'T00:00:00').toLocaleString('default', { month: 'short' })}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{evts[0].title}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{evts[0].time}</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: evts[0].color, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--modal-bg)', borderRadius: 20, padding: 28, width: '90%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>Add Event</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            {selected && (
              <p style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, marginBottom: 16, background: '#ede9fe', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>
                📅 {new Date(selected + 'T00:00:00').toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Event Title *</label>
                <input type="text" placeholder="e.g. Team Meeting" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Time</label>
                <input type="text" placeholder="e.g. 10:00 AM" value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Project / Context</label>
                <input type="text" placeholder="e.g. AI Dashboard" value={form.project}
                  onChange={e => setForm(p => ({ ...p, project: e.target.value }))}
                  className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Event Color</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {colorOptions.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                      style={{ width: 28, height: 28, borderRadius: 8, background: c, border: form.color === c ? '3px solid #1a1a2e' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-primary" onClick={saveEvent} style={{ flex: 1, justifyContent: 'center' }}>Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
