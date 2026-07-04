'use client';

import { useState, useRef } from 'react';
import { Plus, Search, CheckCircle, Circle, Clock, AlertCircle, MoreHorizontal, Flag, X, Trash2, Edit2 } from 'lucide-react';

type Status = 'Todo' | 'In Progress' | 'Review' | 'Completed';
type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: number;
  title: string;
  project: string;
  assignee: string;
  priority: Priority;
  status: Status;
  due: string;
  tags: string[];
}

const initialTasks: Task[] = [
  { id: 1, title: 'Design new onboarding flow', project: 'AI SaaS Dashboard', assignee: 'AR', priority: 'High', status: 'In Progress', due: 'Jun 20', tags: ['Design', 'UX'] },
  { id: 2, title: 'Implement user authentication', project: 'Mobile Banking App', assignee: 'TH', priority: 'High', status: 'Completed', due: 'Jun 18', tags: ['Backend', 'Security'] },
  { id: 3, title: 'Write API documentation', project: 'E-commerce Platform', assignee: 'SI', priority: 'Medium', status: 'Todo', due: 'Jun 25', tags: ['Docs'] },
  { id: 4, title: 'Fix payment gateway bug', project: 'E-commerce Platform', assignee: 'TH', priority: 'High', status: 'In Progress', due: 'Jun 21', tags: ['Bug', 'Critical'] },
  { id: 5, title: 'Create landing page mockups', project: 'Marketing Website', assignee: 'AR', priority: 'Low', status: 'Todo', due: 'Jul 1', tags: ['Design'] },
  { id: 6, title: 'Database schema optimization', project: 'Analytics Platform', assignee: 'TH', priority: 'Medium', status: 'Review', due: 'Jun 28', tags: ['Backend', 'DB'] },
  { id: 7, title: 'Setup CI/CD pipeline', project: 'AI SaaS Dashboard', assignee: 'SI', priority: 'Medium', status: 'Todo', due: 'Jun 30', tags: ['DevOps'] },
  { id: 8, title: 'Conduct user testing sessions', project: 'Mobile Banking App', assignee: 'JF', priority: 'High', status: 'Completed', due: 'Jun 15', tags: ['Testing', 'UX'] },
];

const statusIcons: Record<Status, React.ReactNode> = {
  'Completed': <CheckCircle size={16} color="#10b981" />,
  'In Progress': <Clock size={16} color="#7c3aed" />,
  'Todo': <Circle size={16} color="#94a3b8" />,
  'Review': <AlertCircle size={16} color="#f59e0b" />,
};

const priorityColors: Record<Priority, string> = {
  'High': '#ef4444', 'Medium': '#f59e0b', 'Low': '#10b981'
};

const columns: Status[] = ['Todo', 'In Progress', 'Review', 'Completed'];

const defaultForm = { title: '', project: '', assignee: '', priority: 'Medium' as Priority, status: 'Todo' as Status, due: '', tags: '' };

export default function Tasks() {
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const nextId = useRef(tasks.length + 1);

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditTask(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (task: Task) => {
    setEditTask(task);
    setForm({ title: task.title, project: task.project, assignee: task.assignee, priority: task.priority, status: task.status, due: task.due, tags: task.tags.join(', ') });
    setShowModal(true);
    setMenuOpen(null);
  };

  const saveTask = () => {
    if (!form.title.trim()) return;
    const newTask: Task = {
      id: editTask ? editTask.id : nextId.current++,
      title: form.title,
      project: form.project || 'General',
      assignee: form.assignee || 'AR',
      priority: form.priority,
      status: form.status,
      due: form.due || 'TBD',
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    if (editTask) {
      setTasks(prev => prev.map(t => t.id === editTask.id ? newTask : t));
    } else {
      setTasks(prev => [...prev, newTask]);
    }
    setShowModal(false);
  };

  const deleteTask = (id: number) => { setTasks(prev => prev.filter(t => t.id !== id)); setMenuOpen(null); };

  const toggleStatus = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next: Record<Status, Status> = { 'Todo': 'In Progress', 'In Progress': 'Review', 'Review': 'Completed', 'Completed': 'Todo' };
      return { ...t, status: next[t.status] };
    }));
  };

  const handleDrop = (col: Status) => {
    if (dragging === null) return;
    setTasks(prev => prev.map(t => t.id === dragging ? { ...t, status: col } : t));
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }} onClick={() => setMenuOpen(null)}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit', flex: 1, color: 'var(--text-primary)' }} />
        </div>

        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {[{ v: 'kanban', label: 'Kanban' }, { v: 'list', label: 'List' }].map(({ v, label }) => (
            <button key={v} onClick={() => setView(v as 'list' | 'kanban')} style={{
              padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
              background: view === v ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
              color: view === v ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s'
            }}>{label}</button>
          ))}
        </div>

        <button className="btn-primary" onClick={openAdd}><Plus size={14} /> Add Task</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Tasks', value: tasks.length, color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#10b981', bg: '#d1fae5' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Overdue', value: 2, color: '#ef4444', bg: '#fee2e2' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={18} color={s.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Kanban View */}
      {view === 'kanban' ? (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
          {columns.map(col => (
            <div key={col}
              onDragOver={e => { e.preventDefault(); setDragOver(col); }}
              onDrop={() => handleDrop(col)}
              style={{
                background: dragOver === col ? '#f0ebff' : 'var(--bg-main)',
                borderRadius: 16, padding: 14,
                border: `1px solid ${dragOver === col ? '#a855f7' : 'var(--border-light)'}`,
                minWidth: 260, flexShrink: 0, transition: 'all 0.2s'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                {statusIcons[col]}
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{col}</span>
                <span style={{ marginLeft: 'auto', background: '#e2d9f3', color: '#7c3aed', fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 10 }}>
                  {filtered.filter(t => t.status === col).length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.filter(t => t.status === col).map(task => (
                  <div key={task.id} className="card" style={{ padding: '14px', cursor: 'grab', opacity: dragging === task.id ? 0.5 : 1, transition: 'all 0.2s' }}
                    draggable
                    onDragStart={() => setDragging(task.id)}
                    onDragEnd={() => { setDragging(null); setDragOver(null); }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1 }}>{task.title}</p>
                      <div style={{ position: 'relative' }}>
                        <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === task.id ? null : task.id); }}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: 4 }}>
                          <MoreHorizontal size={13} />
                        </button>
                        {menuOpen === task.id && (
                          <div onClick={e => e.stopPropagation()} style={{
                            position: 'absolute', right: 0, top: 20, background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, minWidth: 130, overflow: 'hidden'
                          }}>
                            <button onClick={() => openEdit(task)} style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontFamily: 'inherit' }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f5f3ff'}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => toggleStatus(task.id)} style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontFamily: 'inherit' }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f5f3ff'}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                              <Clock size={12} /> Move Next
                            </button>
                            <button onClick={() => deleteTask(task.id)} style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontFamily: 'inherit' }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2'}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>{task.project}</p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                      {task.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, background: '#ede9fe', color: '#7c3aed', fontWeight: 600 }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: priorityColors[task.priority] }} />
                        <span style={{ fontSize: 10, color: priorityColors[task.priority], fontWeight: 600 }}>{task.priority}</span>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Due {task.due}</span>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: `hsl(${task.id * 45 + 260}, 65%, 58%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, fontWeight: 700, color: 'white'
                      }}>{task.assignee}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setForm({ ...defaultForm, status: col }); setEditTask(null); setShowModal(true); }}
                  style={{
                    width: '100%', padding: '8px', border: '2px dashed var(--border)', borderRadius: 10,
                    background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#a855f7'; (e.currentTarget as HTMLButtonElement).style.color = '#7c3aed'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}>
                  <Plus size={13} /> Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)' }}>
                {['Task', 'Project', 'Assignee', 'Priority', 'Status', 'Due Date', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => (
                <tr key={task.id} style={{ borderTop: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(168,85,247,0.06)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => toggleStatus(task.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', padding: 0 }}>
                        {statusIcons[task.status]}
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 600, color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>{task.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{task.project}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: `hsl(${task.id * 45 + 260}, 65%, 58%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{task.assignee}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: priorityColors[task.priority] }} />
                      <span style={{ fontSize: 12, color: priorityColors[task.priority], fontWeight: 600 }}>{task.priority}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>{statusIcons[task.status]}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{task.due}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(task)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#7c3aed' }}><Edit2 size={14} /></button>
                      <button onClick={() => deleteTask(task.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--modal-bg)', borderRadius: 20, padding: 28, width: '90%', maxWidth: 480,
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{editTask ? 'Edit Task' : 'Add New Task'}</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Task Title *', key: 'title', type: 'text', placeholder: 'Enter task title...' },
                { label: 'Project', key: 'project', type: 'text', placeholder: 'Project name...' },
                { label: 'Assignee', key: 'assignee', type: 'text', placeholder: 'Initials (e.g. AR)' },
                { label: 'Due Date', key: 'due', type: 'text', placeholder: 'e.g. Jul 15' },
                { label: 'Tags (comma separated)', key: 'tags', type: 'text', placeholder: 'Design, UI, Backend...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="input-field" />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    {(['High', 'Medium', 'Low'] as Priority[]).map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Status }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    {columns.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-primary" onClick={saveTask} style={{ flex: 1, justifyContent: 'center' }}>
                {editTask ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
