
'use client';

import { useState, useRef } from 'react';
import { Plus, Search, Mail, Phone, MoreHorizontal, Star, MessageSquare, X, Edit2, Trash2, Send } from 'lucide-react';

import { useGlobalContext, Member } from '@/context/GlobalContext';

const statusConfig: Record<string, { color: string; label: string }> = {
  online: { color: '#10b981', label: 'Online' },
  away: { color: '#f59e0b', label: 'Away' },
  offline: { color: '#94a3b8', label: 'Offline' },
};

interface MemberForm {
  name: string;
  role: string;
  email: string;
  phone: string;
  dept: string;
  color: string;
  status: 'online' | 'away' | 'offline';
}

const colorOptions = ['#7c3aed', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
const defaultMemberForm: MemberForm = { name: '', role: '', email: '', phone: '', dept: '', color: '#7c3aed', status: 'online' };

export default function Team() {
  const { members, setMembers } = useGlobalContext();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState<Member | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<Member | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState<MemberForm>(defaultMemberForm);
  const [msgText, setMsgText] = useState('');
  const [sentMsg, setSentMsg] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const nextId = useRef(members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1);

  const depts = ['All', ...Array.from(new Set(members.map(m => m.dept)))];
  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) && (dept === 'All' || m.dept === dept));

  const openAddMember = () => { setEditMember(null); setMemberForm(defaultMemberForm); setShowMemberModal(true); };
  const openEdit = (m: Member) => {
    setEditMember(m);
    setMemberForm({ name: m.name, role: m.role, email: m.email, phone: m.phone, dept: m.dept, color: m.color, status: m.status });
    setShowMemberModal(true); setMenuOpen(null);
  };

  const saveMember = () => {
    if (!memberForm.name.trim()) return;
    const initials = memberForm.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const newMember: Member = {
      id: editMember ? editMember.id : nextId.current++,
      name: memberForm.name, role: memberForm.role || 'Team Member',
      initials, email: memberForm.email || `${memberForm.name.split(' ')[0].toLowerCase()}@taskflow.ai`,
      phone: memberForm.phone || 'N/A', projects: editMember?.projects || 0,
      tasks: editMember?.tasks || 0, status: memberForm.status,
      rating: editMember?.rating || 4.5, color: memberForm.color, dept: memberForm.dept || 'General',
    };
    if (editMember) {
      setMembers(prev => prev.map(m => m.id === editMember.id ? newMember : m));
    } else {
      setMembers(prev => [...prev, newMember]);
    }
    setShowMemberModal(false);
  };

  const deleteMember = (id: number) => { setMembers(prev => prev.filter(m => m.id !== id)); setMenuOpen(null); };

  const sendMessage = () => {
    if (!msgText.trim()) return;
    setSentMsg(true);
    setTimeout(() => { setSentMsg(false); setMsgText(''); setShowMsgModal(null); }, 1500);
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }} onClick={() => setMenuOpen(null)}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input type="text" placeholder="Search team..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit', flex: 1, color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, flexWrap: 'wrap' }}>
          {depts.map(d => (
            <button key={d} onClick={() => setDept(d)} style={{
              padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
              background: dept === d ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
              color: dept === d ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s'
            }}>{d}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={openAddMember}><Plus size={14} /> Add Member</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Members', value: members.length, color: '#7c3aed' },
          { label: 'Online Now', value: members.filter(m => m.status === 'online').length, color: '#10b981' },
          { label: 'Departments', value: new Set(members.map(m => m.dept)).size, color: '#3b82f6' },
          { label: 'Avg Rating', value: (members.reduce((a, m) => a + m.rating, 0) / members.length).toFixed(1), color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Members Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
        {filtered.map(member => (
          <div key={member.id} className="card" style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(124,58,237,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${member.color}, ${member.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700 }}>{member.initials}</div>
                  <span style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: statusConfig[member.status].color, border: '2px solid var(--bg-card-solid)' }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{member.role}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Star size={10} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b' }}>{member.rating}</span>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === member.id ? null : member.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <MoreHorizontal size={16} />
                </button>
                {menuOpen === member.id && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 22, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, minWidth: 130, overflow: 'hidden' }}>
                    <button onClick={() => openEdit(member)} style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f5f3ff'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => deleteMember(member.id)} style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className="badge badge-primary">{member.dept}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusConfig[member.status].color}18`, color: statusConfig[member.status].color }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusConfig[member.status].color }} />
                {statusConfig[member.status].label}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <div style={{ padding: '10px', background: 'var(--bg-main)', borderRadius: 10, textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: member.color }}>{member.projects}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Projects</p>
              </div>
              <div style={{ padding: '10px', background: 'var(--bg-main)', borderRadius: 10, textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: member.color }}>{member.tasks}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Tasks</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={12} color="var(--text-muted)" />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{member.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={12} color="var(--text-muted)" />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{member.phone}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={() => { setShowMsgModal(member); setSentMsg(false); setMsgText(''); }} style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px 12px' }}>
                <MessageSquare size={12} /> Message
              </button>
              <button className="btn-secondary" onClick={() => setShowProfileModal(member)} style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px 12px' }}>
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Member Modal */}
      {showMemberModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowMemberModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--modal-bg)', borderRadius: 20, padding: 28, width: '90%', maxWidth: 460, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{editMember ? 'Edit Member' : 'Add Team Member'}</h2>
              <button onClick={() => setShowMemberModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Full Name *', key: 'name', placeholder: 'e.g. John Doe' },
                { label: 'Role', key: 'role', placeholder: 'e.g. Frontend Developer' },
                { label: 'Email', key: 'email', placeholder: 'john@taskflow.ai' },
                { label: 'Phone', key: 'phone', placeholder: '+880-...' },
                { label: 'Department', key: 'dept', placeholder: 'Engineering, Design...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder} value={(memberForm as any)[f.key]}
                    onChange={e => setMemberForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="input-field" />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Status</label>
                  <select value={memberForm.status} onChange={e => setMemberForm(p => ({ ...p, status: e.target.value as any }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    <option value="online">Online</option>
                    <option value="away">Away</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Avatar Color</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 4 }}>
                    {colorOptions.map(c => (
                      <button key={c} onClick={() => setMemberForm(p => ({ ...p, color: c }))}
                        style={{ width: 24, height: 24, borderRadius: 6, background: c, border: memberForm.color === c ? '3px solid #1a1a2e' : '2px solid transparent', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-secondary" onClick={() => setShowMemberModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-primary" onClick={saveMember} style={{ flex: 1, justifyContent: 'center' }}>
                {editMember ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMsgModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowMsgModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--modal-bg)', borderRadius: 20, padding: 28, width: '90%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${showMsgModal.color}, ${showMsgModal.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>{showMsgModal.initials}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Message {showMsgModal.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{showMsgModal.role}</p>
                </div>
              </div>
              <button onClick={() => setShowMsgModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            {sentMsg ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>Message Sent!</p>
              </div>
            ) : (
              <>
                <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
                  placeholder={`Write a message to ${showMsgModal.name}...`} rows={4}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', color: 'var(--text-primary)', marginBottom: 14 }}
                  onFocus={e => e.target.style.borderColor = '#a855f7'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-secondary" onClick={() => setShowMsgModal(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button className="btn-primary" onClick={sendMessage} style={{ flex: 1, justifyContent: 'center' }}>
                    <Send size={13} /> Send Message
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowProfileModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--modal-bg)', borderRadius: 24, padding: 32, width: '90%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${showProfileModal.color}, ${showProfileModal.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 800 }}>{showProfileModal.initials}</div>
                  <span style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: statusConfig[showProfileModal.status].color, border: '3px solid var(--bg-card-solid)' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{showProfileModal.name}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{showProfileModal.role}</p>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <span className="badge badge-primary">{showProfileModal.dept}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${statusConfig[showProfileModal.status].color}18`, color: statusConfig[showProfileModal.status].color }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusConfig[showProfileModal.status].color }} />
                {statusConfig[showProfileModal.status].label}
              </span>
            </div>

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ padding: '16px 12px', background: 'var(--bg-main)', borderRadius: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: showProfileModal.color }}>{showProfileModal.projects}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Projects</p>
              </div>
              <div style={{ padding: '16px 12px', background: 'var(--bg-main)', borderRadius: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: showProfileModal.color }}>{showProfileModal.tasks}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Tasks</p>
              </div>
              <div style={{ padding: '16px 12px', background: 'var(--bg-main)', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, height: 26 }}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>{showProfileModal.rating}</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Rating</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, padding: '16px', background: 'var(--bg-main)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={14} color="var(--text-muted)" />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{showProfileModal.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={14} color="var(--text-muted)" />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{showProfileModal.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => setShowProfileModal(null)} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>Close</button>
              <button className="btn-primary" onClick={() => { setShowMsgModal(showProfileModal); setShowProfileModal(null); setSentMsg(false); setMsgText(''); }} style={{ flex: 2, justifyContent: 'center', padding: '12px' }}>
                <MessageSquare size={16} /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
