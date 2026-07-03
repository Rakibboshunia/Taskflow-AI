'use client';

import { useState, useRef } from 'react';
import { Plus, Search, MoreHorizontal, FolderOpen, Users, Calendar, CheckSquare, TrendingUp, X, Edit2, Trash2 } from 'lucide-react';

type ProjectStatus = 'In Progress' | 'Review' | 'Planning' | 'Completed';
type ProjectPriority = 'High' | 'Medium' | 'Low';

interface Project {
  id: number;
  name: string;
  category: string;
  progress: number;
  status: ProjectStatus;
  members: string[];
  tasks: { done: number; total: number };
  due: string;
  color: string;
  priority: ProjectPriority;
}

const initialProjects: Project[] = [
  { id: 1, name: 'AI SaaS Dashboard', category: 'Web App', progress: 75, status: 'In Progress', members: ['AR', 'SI', 'TH'], tasks: { done: 24, total: 32 }, due: 'Jun 30', color: '#7c3aed', priority: 'High' },
  { id: 2, name: 'E-commerce Platform', category: 'E-Commerce', progress: 60, status: 'In Progress', members: ['SI', 'JF'], tasks: { done: 18, total: 30 }, due: 'Jul 15', color: '#a855f7', priority: 'High' },
  { id: 3, name: 'Mobile Banking App', category: 'Mobile', progress: 90, status: 'Review', members: ['TH', 'AR', 'SI', 'JF'], tasks: { done: 45, total: 50 }, due: 'May 25', color: '#3b82f6', priority: 'Medium' },
  { id: 4, name: 'Marketing Website', category: 'Web', progress: 40, status: 'Planning', members: ['AR'], tasks: { done: 8, total: 20 }, due: 'Aug 1', color: '#10b981', priority: 'Low' },
  { id: 5, name: 'Analytics Platform', category: 'Data', progress: 55, status: 'In Progress', members: ['SI', 'TH'], tasks: { done: 22, total: 40 }, due: 'Jul 20', color: '#f59e0b', priority: 'Medium' },
  { id: 6, name: 'HR Management System', category: 'Enterprise', progress: 25, status: 'Planning', members: ['JF', 'AR'], tasks: { done: 5, total: 20 }, due: 'Sep 1', color: '#ef4444', priority: 'Low' },
];

const statusColors: Record<ProjectStatus, string> = {
  'In Progress': 'badge-primary', 'Review': 'badge-warning', 'Planning': 'badge-info', 'Completed': 'badge-success',
};

const colorOptions = ['#7c3aed', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const defaultForm = { name: '', category: '', progress: 0, status: 'Planning' as ProjectStatus, members: '', tasksDone: 0, tasksTotal: 0, due: '', color: '#7c3aed', priority: 'Medium' as ProjectPriority };

export default function Projects() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const nextId = useRef(initialProjects.length + 1);

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const openAdd = () => { setEditProject(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (p: Project) => {
    setEditProject(p);
    setForm({ name: p.name, category: p.category, progress: p.progress, status: p.status, members: p.members.join(', '), tasksDone: p.tasks.done, tasksTotal: p.tasks.total, due: p.due, color: p.color, priority: p.priority });
    setShowModal(true); setMenuOpen(null);
  };

  const saveProject = () => {
    if (!form.name.trim()) return;
    const proj: Project = {
      id: editProject ? editProject.id : nextId.current++,
      name: form.name, category: form.category || 'General',
      progress: Math.min(100, Math.max(0, form.progress)),
      status: form.status, color: form.color, priority: form.priority,
      members: form.members ? form.members.split(',').map(m => m.trim()).filter(Boolean) : ['AR'],
      tasks: { done: form.tasksDone, total: form.tasksTotal || 1 },
      due: form.due || 'TBD',
    };
    if (editProject) {
      setProjects(prev => prev.map(p => p.id === editProject.id ? proj : p));
    } else {
      setProjects(prev => [...prev, proj]);
    }
    setShowModal(false);
  };

  const deleteProject = (id: number) => { setProjects(prev => prev.filter(p => p.id !== id)); setMenuOpen(null); };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }} onClick={() => setMenuOpen(null)}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 220px', background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit', flex: 1, color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: 4, flexWrap: 'wrap' }}>
          {['All', 'In Progress', 'Review', 'Planning'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
              background: filter === f ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s'
            }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2, background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {[{ v: 'grid', icon: '▦' }, { v: 'list', icon: '☰' }].map(({ v, icon }) => (
            <button key={v} onClick={() => setView(v as 'grid' | 'list')} style={{
              padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 14, background: view === v ? '#ede9fe' : 'transparent',
              color: view === v ? '#7c3aed' : 'var(--text-muted)', transition: 'all 0.2s'
            }}>{icon}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={14} /> New Project</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: '#7c3aed' },
          { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, icon: TrendingUp, color: '#a855f7' },
          { label: 'Under Review', value: projects.filter(p => p.status === 'Review').length, icon: CheckSquare, color: '#f59e0b' },
          { label: 'Team Members', value: 18, icon: Users, color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid/List */}
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id} className="card" style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(124,58,237,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${p.color}25` }}>
                    <FolderOpen size={20} color={p.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.category}</p>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <MoreHorizontal size={16} />
                  </button>
                  {menuOpen === p.id && (
                    <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 22, background: 'white', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, minWidth: 130, overflow: 'hidden' }}>
                      <button onClick={() => openEdit(p)} style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontFamily: 'inherit' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f5f3ff'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => deleteProject(p.id)} style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontFamily: 'inherit' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span className={`badge ${statusColors[p.status]}`}>{p.status}</span>
                <span className={`badge ${p.priority === 'High' ? 'badge-danger' : p.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>{p.priority}</span>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.progress}%`, background: `linear-gradient(90deg, ${p.color}, ${p.color}aa)` }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckSquare size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.tasks.done}/{p.tasks.total} tasks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.due}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  {p.members.slice(0, 3).map((m, j) => (
                    <div key={j} style={{ width: 22, height: 22, borderRadius: '50%', marginLeft: j === 0 ? 0 : -6, background: `hsl(${j * 50 + 260}, 65%, 58%)`, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'white' }}>{m}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)' }}>
                {['Project', 'Status', 'Priority', 'Progress', 'Tasks', 'Due Date', 'Team', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border-light)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#faf5ff'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${p.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FolderOpen size={14} color={p.color} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</p>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge ${p.priority === 'High' ? 'badge-danger' : p.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>{p.priority}</span></td>
                  <td style={{ padding: '14px 16px', minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${p.progress}%` }} /></div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.tasks.done}/{p.tasks.total}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.due}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex' }}>
                      {p.members.slice(0, 3).map((m, j) => (
                        <div key={j} style={{ width: 24, height: 24, borderRadius: '50%', marginLeft: j === 0 ? 0 : -8, background: `hsl(${j * 50 + 260}, 65%, 58%)`, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white' }}>{m}</div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#7c3aed' }}><Edit2 size={14} /></button>
                      <button onClick={() => deleteProject(p.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
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
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, padding: 28, width: '90%', maxWidth: 500, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{editProject ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Project Name *', key: 'name', placeholder: 'Enter project name...' },
                { label: 'Category', key: 'category', placeholder: 'Web App, Mobile, Data...' },
                { label: 'Members (comma separated)', key: 'members', placeholder: 'AR, SI, TH...' },
                { label: 'Due Date', key: 'due', placeholder: 'e.g. Aug 15' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder} value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="input-field" />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Progress %</label>
                  <input type="number" min="0" max="100" value={form.progress}
                    onChange={e => setForm(p => ({ ...p, progress: parseInt(e.target.value) || 0 }))}
                    className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ProjectStatus }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', color: 'var(--text-primary)' }}>
                    {(['In Progress', 'Review', 'Planning', 'Completed'] as ProjectStatus[]).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as ProjectPriority }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', color: 'var(--text-primary)' }}>
                    {(['High', 'Medium', 'Low'] as ProjectPriority[]).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Color</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {colorOptions.map(c => (
                      <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                        style={{ width: 24, height: 24, borderRadius: 6, background: c, border: form.color === c ? '3px solid #1a1a2e' : '2px solid transparent', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-primary" onClick={saveProject} style={{ flex: 1, justifyContent: 'center' }}>
                {editProject ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
