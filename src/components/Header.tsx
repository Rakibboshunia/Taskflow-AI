'use client';

import { useState, useRef, useEffect } from 'react';
import { Page } from '@/app/page';
import { Search, Bell, Plus, Menu, Command, User, Settings, LogOut, ChevronDown, Shield, Sun, Moon } from 'lucide-react';

const pageTitles: Record<Page, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: "Here's what's happening with your projects today." },
  projects: { title: 'Projects', sub: 'Manage and track all your projects.' },
  tasks: { title: 'Tasks', sub: 'View and manage all tasks across projects.' },
  'ai-assistant': { title: 'AI Assistant', sub: 'Your smart AI-powered project assistant.' },
  calendar: { title: 'Calendar', sub: 'Schedule and manage your timeline.' },
  team: { title: 'Team', sub: 'Manage your team members and roles.' },
  analytics: { title: 'Analytics', sub: 'Track performance and project insights.' },
  files: { title: 'Files', sub: 'Manage all your project files and assets.' },
  integrations: { title: 'Integrations', sub: 'Connect your favorite tools and apps.' },
  settings: { title: 'Settings', sub: 'Configure your workspace preferences.' },
};

interface HeaderProps {
  activePage: Page;
  onMenuToggle: () => void;
  setActivePage?: (page: Page) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export default function Header({ activePage, onMenuToggle, setActivePage, darkMode = false, toggleDarkMode }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: 'Al Rakeb Boshunia',
    email: 'user@taskflow.ai',
    phone: '+880-1234-567890',
    role: 'Member',
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'English',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  useEffect(() => {
    // Sync auth details from local storage
    const savedRole = localStorage.getItem('taskflow-role');
    if (savedRole) {
      const formattedRole = savedRole.charAt(0).toUpperCase() + savedRole.slice(1);
      setSettingsForm(prev => ({ 
        ...prev, 
        role: formattedRole,
        email: `demo.${savedRole}@taskflow.ai`
      }));
    }
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Task Assigned', desc: 'You have been assigned to "Design review"', time: '5m ago', read: false },
    { id: 2, title: 'Project Updated', desc: 'AI Dashboard status changed to Review', time: '1h ago', read: false },
    { id: 3, title: 'New Comment', desc: 'Tanvir commented on your task', time: '2h ago', read: false },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;
  const pageInfo = pageTitles[activePage];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const emoji = hour < 12 ? '👋' : hour < 17 ? '☀️' : '🌙';

  return (
    <>
    <header style={{
      background: 'var(--bg-sidebar)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Menu Toggle */}
      <button
        className="mobile-nav"
        onClick={onMenuToggle}
        style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: 'var(--text-secondary)', padding: 6, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        <Menu size={20} />
      </button>

      {/* Page Title - hide subtitle on mobile */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {activePage === 'dashboard' ? (
          <>
            <h1 style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {greeting}, Al Rakeb! {emoji}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'none' }} className="title-sub">
              {pageInfo.sub}
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pageInfo.title}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'none' }} className="title-sub">
              {pageInfo.sub}
            </p>
          </>
        )}
      </div>

      {/* Search - hidden on small screens */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--input-bg)',
        border: `1px solid ${searchFocused ? 'var(--primary-light)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '8px 14px',
        width: 'clamp(180px, 22vw, 280px)',
        transition: 'all 0.2s ease',
        boxShadow: searchFocused ? '0 0 0 3px var(--primary-glow)' : 'none',
        flexShrink: 0
      }} className="search-bar">
        <Search size={15} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, color: 'var(--text-primary)', flex: 1,
            fontFamily: 'inherit', minWidth: 0
          }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'var(--border-light)', borderRadius: 6, padding: '2px 6px',
          fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap'
        }}>
          <Command size={10} />K
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          width: 38, height: 38, borderRadius: 10,
          border: '1px solid var(--border)',
          background: darkMode ? 'rgba(167,139,250,0.15)' : 'var(--bg-main)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: darkMode ? 'var(--primary)' : 'var(--text-secondary)',
          transition: 'all 0.25s', flexShrink: 0
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary-light)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = darkMode ? 'var(--primary)' : 'var(--text-secondary)'; }}
      >
        {darkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* New Project Button */}
      <button className="btn-primary" onClick={() => setActivePage && setActivePage('projects')}>
        <Plus size={15} />
        New Project
      </button>

      {/* Notifications */}
      <div ref={notificationsRef} style={{ position: 'relative' }}>
        <button 
          onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
          style={{
            position: 'relative', background: showNotifications ? 'var(--input-bg)' : 'var(--bg-main)',
            cursor: 'pointer', padding: 9, borderRadius: 10,
            color: showNotifications ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', border: `1px solid ${showNotifications ? 'var(--primary-light)' : 'var(--border)'}`,
            boxShadow: showNotifications ? '0 0 0 3px var(--primary-glow)' : 'none'
          }}>
          <Bell size={17} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 16, height: 16, borderRadius: '50%',
              background: '#ef4444', color: 'white',
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white'
            }}>{unreadCount}</span>
          )}
        </button>

        {showNotifications && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
            width: 320, maxWidth: 'calc(100vw - 32px)', background: 'white', borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid var(--border)',
            zIndex: 100, overflow: 'hidden', animation: 'fadeInUp 0.2s ease'
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</h3>
              <button 
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                Mark all read
              </button>
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.length > 0 ? notifications.map(n => (
                <div key={n.id} style={{ 
                  padding: '12px 16px', borderBottom: '1px solid var(--border-light)',
                  background: n.read ? 'white' : '#faf5ff', cursor: 'pointer', transition: 'background 0.2s'
                }} onClick={() => setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</p>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.desc}</p>
                </div>
              )) : (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Bell size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  <p style={{ fontSize: 13 }}>No notifications right now.</p>
                </div>
              )}
            </div>
            <div style={{ padding: '10px', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
              <button style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                View all settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Account */}
      <div ref={profileRef} style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: showProfile ? '#faf5ff' : 'transparent',
            border: `1px solid ${showProfile ? 'var(--primary-light)' : 'transparent'}`,
            borderRadius: 12, padding: '4px 8px 4px 4px',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: showProfile ? '0 0 0 3px var(--primary-glow)' : 'none'
          }}
          onMouseEnter={e => { if (!showProfile) { (e.currentTarget as HTMLButtonElement).style.background = '#f5f3ff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; } }}
          onMouseLeave={e => { if (!showProfile) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; } }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(124,58,237,0.3)'
          }}>AR</div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{settingsForm.name.split(' ')[0]}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2 }}>{settingsForm.role}</p>
          </div>
          <ChevronDown size={13} color="var(--text-muted)" style={{ transform: showProfile ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {showProfile && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
            width: 240, maxWidth: 'calc(100vw - 32px)', background: 'white', borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.14)', border: '1px solid var(--border)',
            zIndex: 200, overflow: 'hidden', animation: 'fadeInUp 0.2s ease'
          }}>
            {/* Profile Info */}
            <div style={{
              padding: '16px', borderBottom: '1px solid var(--border-light)',
              background: 'linear-gradient(135deg, #faf5ff, #fff)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 16, fontWeight: 700, flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
                }}>AR</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{settingsForm.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{settingsForm.email}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, background: '#ede9fe', color: '#7c3aed', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                    <Shield size={9} /> {settingsForm.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '6px' }}>
              <button onClick={() => { setShowProfileModal(true); setShowProfile(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', border: 'none', background: 'transparent',
                  cursor: 'pointer', borderRadius: 10, transition: 'all 0.15s',
                  textAlign: 'left', fontFamily: 'inherit'
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#faf5ff'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={14} color="#7c3aed" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>View Profile</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>See your public profile</p>
                </div>
              </button>
              <button onClick={() => { setShowSettingsModal(true); setShowProfile(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', border: 'none', background: 'transparent',
                  cursor: 'pointer', borderRadius: 10, transition: 'all 0.15s',
                  textAlign: 'left', fontFamily: 'inherit'
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#faf5ff'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Settings size={14} color="#7c3aed" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Account Settings</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Manage your preferences</p>
                </div>
              </button>
            </div>

            {/* Logout */}
            <div style={{ padding: '6px', borderTop: '1px solid var(--border-light)' }}>
              <button onClick={() => { setShowLogoutConfirm(true); setShowProfile(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', border: 'none', background: 'transparent',
                  cursor: 'pointer', borderRadius: 10, transition: 'all 0.15s',
                  textAlign: 'left', fontFamily: 'inherit'
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LogOut size={14} color="#ef4444" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>Log Out</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: 28,
            width: 360, boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            animation: 'fadeInUp 0.25s ease', textAlign: 'center'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fee2e2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <LogOut size={24} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Log Out?</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
              Are you sure you want to log out of your TaskFlow AI account?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button onClick={() => {
                  localStorage.removeItem('taskflow-auth');
                  localStorage.removeItem('taskflow-role');
                  window.location.href = '/login';
                }} style={{
                flex: 1, padding: '9px 16px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowProfileModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: 24, width: '90%', maxWidth: 480,
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease', overflow: 'hidden'
          }}>
            {/* Cover */}
            <div style={{ height: 100, background: 'linear-gradient(135deg, #7c3aed, #a855f7, #6366f1)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <button onClick={() => setShowProfileModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                  ✕
                </button>
              </div>
              {/* Avatar */}
              <div style={{
                position: 'absolute', bottom: -32, left: 24,
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: '4px solid white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 800,
                boxShadow: '0 8px 24px rgba(124,58,237,0.4)'
              }}>AR</div>
            </div>

            {/* Info */}
            <div style={{ padding: '44px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{settingsForm.name}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{settingsForm.email}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <span style={{ background: '#ede9fe', color: '#7c3aed', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Shield size={10} /> {settingsForm.role}
                    </span>
                    <span style={{ background: '#d1fae5', color: '#065f46', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>Active</span>
                  </div>
                </div>
                <button onClick={() => { setShowProfileModal(false); setShowSettingsModal(true); }} className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
                  <Settings size={13} /> Edit
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Projects', value: '8', color: '#7c3aed' },
                  { label: 'Tasks Done', value: '156', color: '#10b981' },
                  { label: 'Team Lead', value: '4', color: '#3b82f6' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'var(--bg-main)', borderRadius: 12, padding: '14px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Role', value: `${settingsForm.role} / Project Manager` },
                  { label: 'Phone', value: settingsForm.phone },
                  { label: 'Member since', value: 'January 2025' },
                  { label: 'Location', value: 'Dhaka, Bangladesh' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings Modal */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowSettingsModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: 24, width: '90%', maxWidth: 520,
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.25s ease',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            {/* Header */}
            <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #faf5ff, #fff)', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={18} color="#7c3aed" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>Account Settings</h2>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Manage your personal info & preferences</p>
                </div>
              </div>
              <button onClick={() => setShowSettingsModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Personal Info */}
              <section>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={14} color="#7c3aed" /> Personal Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Full Name', key: 'name', placeholder: 'Your full name' },
                    { label: 'Email', key: 'email', placeholder: 'your@email.com' },
                    { label: 'Phone', key: 'phone', placeholder: '+880-...' },
                    { label: 'Role', key: 'role', placeholder: 'Your role' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                      <input
                        type="text"
                        value={(settingsForm as any)[f.key]}
                        onChange={e => setSettingsForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="input-field"
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Preferences */}
              <section style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Settings size={14} color="#7c3aed" /> Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Push Notifications', sub: 'Get notified about task updates', key: 'notifications' },
                    { label: 'Email Alerts', sub: 'Receive important emails', key: 'emailAlerts' },
                    { label: 'Dark Mode', sub: 'Switch to dark theme', key: 'darkMode' },
                  ].map(toggle => (
                    <div key={toggle.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-main)', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{toggle.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{toggle.sub}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (toggle.key === 'darkMode' && toggleDarkMode) {
                            toggleDarkMode();
                          } else {
                            setSettingsForm(p => ({ ...p, [toggle.key]: !(p as any)[toggle.key] }));
                          }
                        }}
                        style={{
                          width: 44, height: 24, borderRadius: 12, border: 'none',
                          background: (toggle.key === 'darkMode' ? darkMode : (settingsForm as any)[toggle.key]) ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e2e8f0',
                          cursor: 'pointer', position: 'relative', transition: 'all 0.25s', flexShrink: 0
                        }}>
                        <span style={{
                          position: 'absolute', top: 3, left: (toggle.key === 'darkMode' ? darkMode : (settingsForm as any)[toggle.key]) ? 22 : 3,
                          width: 18, height: 18, borderRadius: '50%', background: 'white',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.25s'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Language */}
              <section style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Language</h3>
                <select
                  value={settingsForm.language}
                  onChange={e => setSettingsForm(p => ({ ...p, language: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', color: 'var(--text-primary)' }}
                  onFocus={e => (e.target.style.borderColor = '#a855f7')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                  {['English', 'বাংলা', 'Arabic', 'French', 'Spanish'].map(l => <option key={l}>{l}</option>)}
                </select>
              </section>

              {/* Save Button */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button className="btn-secondary" onClick={() => setShowSettingsModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                  setSettingsSaved(true);
                  setTimeout(() => { setSettingsSaved(false); setShowSettingsModal(false); }, 1500);
                }}>
                  {settingsSaved ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
