'use client';


import { useState, useRef, useEffect } from 'react';
import { Page } from '@/app/page';
import {
  LayoutDashboard, FolderOpen, CheckSquare, Bot, Calendar,
  Users, BarChart3, FileText, Zap, Settings, ChevronDown,
  Sparkles, Crown
} from 'lucide-react';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'New' },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'integrations', label: 'Integrations', icon: Zap },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, setActivePage, isOpen, onClose }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('taskflow-auth');
    window.location.href = '/login';
  };

  return (
    <aside style={{
      position: 'fixed',
      left: isOpen ? 0 : 'calc(-1 * var(--sidebar-width))',
      top: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--bg-sidebar)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="TaskFlow AI" style={{
            width: 38, height: 38, borderRadius: 10, objectFit: 'contain', flexShrink: 0
          }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
              TaskFlow<span style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em', marginTop: 1 }}>
              PROJECT MANAGEMENT
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 2,
                  background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-light))' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? '0 4px 12px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#ede9fe',
                    color: isActive ? 'white' : '#7c3aed',
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 10,
                    letterSpacing: '0.05em'
                  }}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: 'var(--border-light)', margin: '8px 0' }} />

        <div>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 2,
                  background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-light))' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? '0 4px 12px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Pro Plan */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
          borderRadius: 12,
          padding: '12px',
          marginBottom: 12,
          border: '1px solid #ddd6fe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Crown size={14} color="#7c3aed" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#5b21b6' }}>Pro Plan</span>
          </div>
          <p style={{ fontSize: 11, color: '#7c3aed', marginBottom: 8, lineHeight: 1.4 }}>
            You have 23 days left
          </p>
          <div style={{ height: 4, background: '#c4b5fd', borderRadius: 10, marginBottom: 10 }}>
            <div style={{ height: '100%', width: '67%', background: 'linear-gradient(90deg,#7c3aed,#a855f7)', borderRadius: 10 }} />
          </div>
          <button onClick={() => setShowUpgradeModal(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '7px 12px' }}>
            Upgrade Plan
          </button>
        </div>

        {/* User */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <div onClick={() => setShowUserMenu(!showUserMenu)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px',
            cursor: 'pointer', borderRadius: 10, transition: 'background 0.2s',
            background: showUserMenu ? 'var(--bg-card-hover)' : 'transparent'
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0
            }}>AR</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                Al Rakeb Rasel
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>admin@taskflow.ai</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, right: 0,
              background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 200, padding: 8,
              animation: 'fadeInUp 0.2s ease'
            }}>
              <button onClick={() => { setActivePage('settings'); setShowUserMenu(false); }} style={{
                display: 'block', width: '100%', padding: '10px 12px', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-primary)', borderRadius: 8, transition: 'background 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Account Settings
              </button>
              <button onClick={handleLogout} style={{
                display: 'block', width: '100%', padding: '10px 12px', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer', marginTop: 4,
                fontSize: 13, color: '#ef4444', borderRadius: 8, transition: 'background 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {showUpgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--overlay-bg)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--bg-card)', width: 400, maxWidth: '90%', borderRadius: 24, padding: 32, textAlign: 'center', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={32} color="white" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Upgrade to Pro</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>Get unlimited projects, advanced AI features, and priority support.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => { setShowUpgradeModal(false); setActivePage('settings'); }} className="btn-primary" style={{ padding: 14, justifyContent: 'center' }}>Upgrade Now - $12/mo</button>
              <button onClick={() => setShowUpgradeModal(false)} style={{ padding: 14, background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Maybe Later</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
