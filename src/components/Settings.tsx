'use client';

import { useState } from 'react';
import {
  User, Bell, Palette, Shield, CreditCard, Camera,
  Check, Eye, EyeOff, ChevronRight, Crown, Zap,
  Monitor, Moon, Sun, Globe, Lock, Smartphone,
  Mail, MessageSquare, Clock, Trash2, LogOut, AlertTriangle
} from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'appearance' | 'security' | 'billing';

const accentColors = [
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Green', value: '#059669' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Pink', value: '#db2777' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    firstName: 'Al Rakeb', lastName: 'Boshunia',
    email: 'admin@taskflow.ai', phone: '+880-1234-567890',
    timezone: 'Asia/Dhaka', bio: 'Project Manager & Full-Stack Developer based in Dhaka, Bangladesh.',
    role: 'Admin',
  });

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    taskAssigned: true, taskCompleted: true, taskDeadline: true,
    projectUpdates: true, teamMentions: true, newComments: false,
    emailDigest: true, weeklyReport: false, smsAlerts: false,
    browserPush: true,
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    accentColor: '#7c3aed',
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    compactMode: false,
    animations: true,
  });

  // Security state
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const activeSessions = [
    { device: 'Chrome on Windows', location: 'Dhaka, BD', time: 'Current session', current: true },
    { device: 'Firefox on Android', location: 'Dhaka, BD', time: '2 hours ago', current: false },
    { device: 'Safari on iPhone', location: 'Chittagong, BD', time: '3 days ago', current: false },
  ];

  const invoices = [
    { id: 'INV-001', date: 'Aug 1, 2026', amount: '$12.00', status: 'Paid' },
    { id: 'INV-002', date: 'Jul 1, 2026', amount: '$12.00', status: 'Paid' },
    { id: 'INV-003', date: 'Jun 1, 2026', amount: '$12.00', status: 'Paid' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none',
      background: value ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e2e8f0',
      cursor: 'pointer', position: 'relative', transition: 'all 0.25s', flexShrink: 0
    }}>
      <span style={{
        position: 'absolute', top: 3, left: value ? 22 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.25s'
      }} />
    </button>
  );

  const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
      overflow: 'hidden', marginBottom: 16
    }}>
      {children}
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) => (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="#7c3aed" />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</p>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="animate-fadeInUp" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your account preferences and workspace configuration.</p>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Sidebar Tabs */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
          padding: 8, flexShrink: 0, width: 200,
          position: 'sticky', top: 80
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                marginBottom: 2, fontFamily: 'inherit', fontSize: 13, fontWeight: isActive ? 700 : 500,
                background: isActive ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s', textAlign: 'left',
                boxShadow: isActive ? '0 4px 12px rgba(124,58,237,0.25)' : 'none',
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--primary)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div>
              {/* Avatar */}
              <SectionCard>
                <SectionHeader icon={User} title="Profile Information" subtitle="Update your personal details" />
                <div style={{ padding: 20 }}>
                  {/* Avatar Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: 16, background: 'var(--bg-main)', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 24, fontWeight: 800,
                        boxShadow: '0 8px 24px rgba(124,58,237,0.35)'
                      }}>AR</div>
                      <button style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 26, height: 26, borderRadius: '50%', border: '2px solid white',
                        background: '#7c3aed', cursor: 'pointer', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Camera size={12} />
                      </button>
                    </div>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{profile.firstName} {profile.lastName}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{profile.email}</p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, background: '#ede9fe', color: '#7c3aed', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>
                        <Crown size={10} /> {profile.role}
                      </span>
                    </div>
                    <button style={{
                      marginLeft: 'auto', padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border)',
                      background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit'
                    }}>
                      <Camera size={13} /> Change Photo
                    </button>
                  </div>

                  {/* Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { label: 'First Name', key: 'firstName' },
                      { label: 'Last Name', key: 'lastName' },
                      { label: 'Email Address', key: 'email' },
                      { label: 'Phone Number', key: 'phone' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                        <input
                          className="input-field"
                          value={(profile as any)[f.key]}
                          onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                          style={{ fontSize: 13 }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timezone</label>
                      <select className="input-field" value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))} style={{ fontSize: 13, width: '100%' }}>
                        {['Asia/Dhaka', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'].map(tz => (
                          <option key={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
                      <input className="input-field" value={profile.role} readOnly style={{ fontSize: 13, opacity: 0.6 }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        value={profile.bio}
                        onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                        style={{ fontSize: 13, resize: 'vertical', lineHeight: 1.5 }}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }}>Discard</button>
                <button className="btn-primary" onClick={handleSave} style={{ fontSize: 13, minWidth: 130, justifyContent: 'center' }}>
                  {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === 'notifications' && (
            <div>
              <SectionCard>
                <SectionHeader icon={Bell} title="In-App Notifications" subtitle="Control what you see inside the app" />
                <div style={{ padding: '8px 20px 20px' }}>
                  {[
                    { key: 'taskAssigned', label: 'Task Assigned', sub: 'When someone assigns you a task', icon: Check },
                    { key: 'taskCompleted', label: 'Task Completed', sub: 'When your task is marked complete', icon: Check },
                    { key: 'taskDeadline', label: 'Deadline Reminders', sub: 'Remind me 24h before due date', icon: Clock },
                    { key: 'projectUpdates', label: 'Project Updates', sub: 'Status changes in your projects', icon: Zap },
                    { key: 'teamMentions', label: 'Team Mentions', sub: 'When someone @mentions you', icon: MessageSquare },
                    { key: 'newComments', label: 'New Comments', sub: 'Comments on tasks you follow', icon: MessageSquare },
                    { key: 'browserPush', label: 'Browser Notifications', sub: 'Push notifications in your browser', icon: Monitor },
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</p>
                      </div>
                      <Toggle value={(notifSettings as any)[item.key]} onChange={() => setNotifSettings(p => ({ ...p, [item.key]: !(p as any)[item.key] }))} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Mail} title="Email Notifications" subtitle="Choose when to receive emails" />
                <div style={{ padding: '8px 20px 20px' }}>
                  {[
                    { key: 'emailDigest', label: 'Daily Digest', sub: 'Summary of activity each morning' },
                    { key: 'weeklyReport', label: 'Weekly Report', sub: 'Team performance summary every Monday' },
                    { key: 'smsAlerts', label: 'SMS Alerts', sub: 'Critical deadline alerts via SMS' },
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</p>
                      </div>
                      <Toggle value={(notifSettings as any)[item.key]} onChange={() => setNotifSettings(p => ({ ...p, [item.key]: !(p as any)[item.key] }))} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={handleSave} style={{ fontSize: 13, minWidth: 130, justifyContent: 'center' }}>
                  {saved ? <><Check size={14} /> Saved!</> : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* ── APPEARANCE ── */}
          {activeTab === 'appearance' && (
            <div>
              <SectionCard>
                <SectionHeader icon={Palette} title="Theme" subtitle="Choose your preferred color mode" />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {[
                      { value: 'light', label: 'Light', icon: Sun, desc: 'Clean & bright' },
                      { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on eyes' },
                      { value: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
                    ].map(t => {
                      const Icon = t.icon;
                      const isActive = appearance.theme === t.value;
                      return (
                        <button key={t.value} onClick={() => setAppearance(p => ({ ...p, theme: t.value as any }))} style={{
                          padding: '16px', borderRadius: 14, border: `2px solid ${isActive ? '#7c3aed' : 'var(--border)'}`,
                          background: isActive ? 'rgba(124,58,237,0.06)' : 'var(--bg-main)',
                          cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'inherit'
                        }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: isActive ? '#ede9fe' : 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <Icon size={20} color={isActive ? '#7c3aed' : 'var(--text-muted)'} />
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#7c3aed' : 'var(--text-primary)', marginBottom: 2 }}>{t.label}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</p>
                          {isActive && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px auto 0' }}><Check size={11} color="white" /></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Palette} title="Accent Color" subtitle="Personalize your workspace color" />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {accentColors.map(c => (
                      <button key={c.value} onClick={() => setAppearance(p => ({ ...p, accentColor: c.value }))}
                        title={c.name}
                        style={{
                          width: 40, height: 40, borderRadius: '50%', background: c.value, border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: appearance.accentColor === c.value ? `0 0 0 3px white, 0 0 0 5px ${c.value}` : 'none',
                          transition: 'all 0.2s', transform: appearance.accentColor === c.value ? 'scale(1.1)' : 'scale(1)'
                        }}>
                        {appearance.accentColor === c.value && <Check size={16} color="white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Globe} title="Display Settings" />
                <div style={{ padding: '0 20px 20px' }}>
                  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Font Size</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['small', 'medium', 'large'] as const).map(s => (
                        <button key={s} onClick={() => setAppearance(p => ({ ...p, fontSize: s }))} style={{
                          padding: '6px 16px', borderRadius: 8, border: `1px solid ${appearance.fontSize === s ? '#7c3aed' : 'var(--border)'}`,
                          background: appearance.fontSize === s ? '#ede9fe' : 'transparent',
                          color: appearance.fontSize === s ? '#7c3aed' : 'var(--text-secondary)',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                          textTransform: 'capitalize'
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>
                  {[
                    { key: 'compactMode', label: 'Compact Mode', sub: 'Reduce spacing between elements' },
                    { key: 'animations', label: 'Animations', sub: 'Enable smooth transitions and effects' },
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</p>
                      </div>
                      <Toggle value={(appearance as any)[item.key]} onChange={() => setAppearance(p => ({ ...p, [item.key]: !(p as any)[item.key] }))} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={handleSave} style={{ fontSize: 13, minWidth: 130, justifyContent: 'center' }}>
                  {saved ? <><Check size={14} /> Saved!</> : 'Apply Changes'}
                </button>
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === 'security' && (
            <div>
              <SectionCard>
                <SectionHeader icon={Lock} title="Change Password" subtitle="Use a strong, unique password" />
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Current Password', key: 'old', show: showOldPass, toggle: () => setShowOldPass(p => !p) },
                    { label: 'New Password', key: 'new', show: showNewPass, toggle: () => setShowNewPass(p => !p) },
                    { label: 'Confirm New Password', key: 'confirm', show: showNewPass, toggle: () => setShowNewPass(p => !p) },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={f.show ? 'text' : 'password'}
                          className="input-field"
                          value={(passwords as any)[f.key]}
                          onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder="••••••••"
                          style={{ fontSize: 13, paddingRight: 44 }}
                        />
                        <button onClick={f.toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                          {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 13 }} onClick={handleSave}>
                    {saved ? <><Check size={14} /> Updated!</> : 'Update Password'}
                  </button>
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Smartphone} title="Two-Factor Authentication" subtitle="Add an extra layer of security" />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: twoFA ? 'rgba(16,185,129,0.08)' : 'var(--bg-main)', borderRadius: 12, border: `1px solid ${twoFA ? '#10b98160' : 'var(--border-light)'}` }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: twoFA ? '#065f46' : 'var(--text-primary)' }}>{twoFA ? '✓ 2FA Enabled' : '2FA Disabled'}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Authenticator app or SMS verification</p>
                    </div>
                    <Toggle value={twoFA} onChange={() => setTwoFA(p => !p)} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Monitor} title="Active Sessions" subtitle="Devices currently signed in" />
                <div style={{ padding: '0 20px 20px' }}>
                  {activeSessions.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: s.current ? '#ede9fe' : 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Monitor size={16} color={s.current ? '#7c3aed' : 'var(--text-muted)'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.device}</p>
                          {s.current && <span style={{ fontSize: 10, background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>Current</span>}
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <button style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, border: '1px solid #fecaca', background: 'transparent', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={AlertTriangle} title="Danger Zone" />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fff5f5', borderRadius: 12, border: '1px solid #fecaca' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Delete Account</p>
                      <p style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>Permanently remove your account and all data</p>
                    </div>
                    <button style={{ fontSize: 12, color: '#dc2626', fontWeight: 700, border: '1px solid #fecaca', background: 'white', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ── BILLING ── */}
          {activeTab === 'billing' && (
            <div>
              {/* Current Plan */}
              <SectionCard>
                <div style={{ padding: 20 }}>
                  <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: 16, padding: 24, color: 'white', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: -30, right: 40, width: 80, height: 80, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <Crown size={20} color="white" />
                          <span style={{ fontSize: 18, fontWeight: 800 }}>Pro Plan</span>
                        </div>
                        <p style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>$12<span style={{ fontSize: 16, fontWeight: 400, opacity: 0.8 }}>/month</span></p>
                        <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>Renews on October 1, 2026</p>
                      </div>
                      <span style={{ background: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20 }}>Active</span>
                    </div>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', margin: '20px 0' }} />
                    <div style={{ display: 'flex', gap: 20 }}>
                      {[{ label: 'Projects', value: '∞ Unlimited' }, { label: 'Storage', value: '100 GB' }, { label: 'Team Members', value: '25' }].map(s => (
                        <div key={s.label}>
                          <p style={{ fontSize: 11, opacity: 0.7 }}>{s.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 700 }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage */}
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Usage This Month</p>
                  {[
                    { label: 'Storage', used: 34, total: 100, unit: 'GB', color: '#7c3aed' },
                    { label: 'AI Requests', used: 820, total: 2000, unit: '', color: '#a855f7' },
                    { label: 'Team Members', used: 18, total: 25, unit: '', color: '#3b82f6' },
                  ].map(u => (
                    <div key={u.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{u.label}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.used}{u.unit} / {u.total}{u.unit}</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 10 }}>
                        <div style={{ height: '100%', width: `${(u.used / u.total) * 100}%`, background: u.color, borderRadius: 10, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={CreditCard} title="Invoice History" subtitle="Your past billing records" />
                <div style={{ padding: '0 20px 20px' }}>
                  {invoices.map((inv, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CreditCard size={16} color="#7c3aed" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{inv.id}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{inv.date}</p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{inv.amount}</span>
                      <span style={{ fontSize: 11, background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>{inv.status}</span>
                      <button style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, border: '1px solid #ddd6fe', background: 'transparent', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn-secondary" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LogOut size={14} /> Cancel Plan
                </button>
                <button className="btn-primary" style={{ fontSize: 13, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Crown size={14} /> Upgrade Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
