'use client';

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
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(79,70,229,0.4)',
            flexShrink: 0
          }}>
            <Sparkles size={18} color="white" strokeWidth={2.5} />
          </div>
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
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '7px 12px' }}>
            Upgrade Plan
          </button>
        </div>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px',
          cursor: 'pointer', borderRadius: 10, transition: 'background 0.2s'
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
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>
    </aside>
  );
}
