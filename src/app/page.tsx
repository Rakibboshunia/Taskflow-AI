'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import Projects from '@/components/Projects';
import Tasks from '@/components/Tasks';
import Team from '@/components/Team';
import Analytics from '@/components/Analytics';
import AIAssistantPage from '@/components/AIAssistantPage';
import Calendar from '@/components/Calendar';

export type Page = 'dashboard' | 'projects' | 'tasks' | 'ai-assistant' | 'calendar' | 'team' | 'analytics' | 'files' | 'integrations' | 'settings';

export default function Home() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Auth check
    const isAuthenticated = localStorage.getItem('taskflow-auth');
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setIsCheckingAuth(false);

    // Theme
    const saved = localStorage.getItem('taskflow-theme');
    if (saved === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Responsive: open sidebar by default only on desktop
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
      </div>
    );
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('taskflow-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('taskflow-theme', 'light');
      }
      return next;
    });
  };

  const handlePageChange = (page: Page) => {
    setActivePage(page);
    if (isMobile) setSidebarOpen(false);
  };

  const PlaceholderPage = ({ title, icon, desc }: { title: string; icon: string; desc: string }) => (
    <div className="animate-fadeInUp" style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', marginTop: 20 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{icon}</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      <div style={{ marginTop: 24, display: 'inline-block', padding: '8px 16px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
        Coming Soon
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard setActivePage={handlePageChange} />;
      case 'projects':     return <Projects />;
      case 'tasks':        return <Tasks />;
      case 'team':         return <Team />;
      case 'analytics':    return <Analytics />;
      case 'ai-assistant': return <AIAssistantPage />;
      case 'calendar':     return <Calendar />;
      case 'files':        return <PlaceholderPage title="Files" icon="📁" desc="Manage all your project files and assets here." />;
      case 'integrations': return <PlaceholderPage title="Integrations" icon="🔌" desc="Connect your favorite tools and apps." />;
      case 'settings':     return <PlaceholderPage title="Settings" icon="⚙️" desc="Configure your workspace preferences." />;
      default:             return <Dashboard setActivePage={handlePageChange} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-main)', position: 'relative' }}>
      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        marginLeft: (!isMobile && sidebarOpen) ? 'var(--sidebar-width)' : '0',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Header
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          setActivePage={handlePageChange}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main style={{ flex: 1, overflow: 'auto', overflowX: 'hidden', padding: 'clamp(12px, 3vw, 24px)' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
