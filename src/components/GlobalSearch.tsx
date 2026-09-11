'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, FolderOpen, CheckSquare, Users, Clock, ArrowRight, Command } from 'lucide-react';
import { Page } from '@/app/page';

interface SearchResult {
  id: string;
  type: 'project' | 'task' | 'member';
  title: string;
  subtitle: string;
  page: Page;
  icon?: string;
}

const allResults: SearchResult[] = [
  // Projects
  { id: 'p1', type: 'project', title: 'AI SaaS Dashboard', subtitle: 'In Progress · 75%', page: 'projects' },
  { id: 'p2', type: 'project', title: 'E-commerce Platform', subtitle: 'In Progress · 60%', page: 'projects' },
  { id: 'p3', type: 'project', title: 'Mobile Banking App', subtitle: 'Review · 90%', page: 'projects' },
  { id: 'p4', type: 'project', title: 'Marketing Website', subtitle: 'Planning · 40%', page: 'projects' },
  { id: 'p5', type: 'project', title: 'Analytics Platform', subtitle: 'In Progress · 55%', page: 'projects' },
  { id: 'p6', type: 'project', title: 'HR Management System', subtitle: 'Planning · 25%', page: 'projects' },
  // Tasks
  { id: 't1', type: 'task', title: 'Design new onboarding flow', subtitle: 'AI SaaS Dashboard · High priority', page: 'tasks' },
  { id: 't2', type: 'task', title: 'Implement user authentication', subtitle: 'Mobile Banking App · Completed', page: 'tasks' },
  { id: 't3', type: 'task', title: 'Write API documentation', subtitle: 'E-commerce Platform · Todo', page: 'tasks' },
  { id: 't4', type: 'task', title: 'Fix payment gateway bug', subtitle: 'E-commerce Platform · Critical', page: 'tasks' },
  { id: 't5', type: 'task', title: 'Setup CI/CD pipeline', subtitle: 'AI SaaS Dashboard · Todo', page: 'tasks' },
  { id: 't6', type: 'task', title: 'Database schema optimization', subtitle: 'Analytics Platform · Review', page: 'tasks' },
  // Members
  { id: 'm1', type: 'member', title: 'Rasel Ahmed', subtitle: 'UI/UX Designer · Online', page: 'team', icon: 'RA' },
  { id: 'm2', type: 'member', title: 'Sadia Islam', subtitle: 'Frontend Developer · Online', page: 'team', icon: 'SI' },
  { id: 'm3', type: 'member', title: 'Tanvir Hasan', subtitle: 'Backend Developer · Away', page: 'team', icon: 'TH' },
  { id: 'm4', type: 'member', title: 'Jannatul Ferdaus', subtitle: 'QA Engineer · Online', page: 'team', icon: 'JF' },
];

const typeConfig = {
  project: { label: 'Projects', icon: FolderOpen, color: '#7c3aed', bg: '#ede9fe' },
  task: { label: 'Tasks', icon: CheckSquare, color: '#3b82f6', bg: '#dbeafe' },
  member: { label: 'Members', icon: Users, color: '#10b981', bg: '#d1fae5' },
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

export default function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('taskflow-recent-searches') || '[]');
    }
    return [];
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredResults = query.trim()
    ? allResults.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Group results by type
  const grouped: Record<string, SearchResult[]> = {};
  filteredResults.forEach(r => {
    if (!grouped[r.type]) grouped[r.type] = [];
    grouped[r.type].push(r);
  });

  const flatResults = Object.values(grouped).flat();

  const handleSelect = useCallback((result: SearchResult) => {
    // Save to recent searches
    const updated = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('taskflow-recent-searches', JSON.stringify(updated));
    onNavigate(result.page);
    onClose();
    setQuery('');
  }, [recentSearches, onNavigate, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && flatResults[selectedIndex]) {
        handleSelect(flatResults[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, flatResults, selectedIndex, handleSelect, onClose]);

  if (!isOpen) return null;

  let globalIndex = 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      backdropFilter: 'blur(8px)', paddingTop: '10vh'
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', borderRadius: 20, width: '90%', maxWidth: 560,
          boxShadow: '0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,58,237,0.15)',
          animation: 'fadeInUp 0.2s ease', overflow: 'hidden',
        }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, tasks, team members..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 15, color: 'var(--text-primary)', fontFamily: 'inherit'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ border: 'none', background: 'var(--bg-main)', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex' }}>
              <X size={14} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
            ESC
          </div>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: 420, overflowY: 'auto' }}>
          {query.trim() === '' ? (
            <div style={{ padding: '16px 20px' }}>
              {recentSearches.length > 0 ? (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Recent Searches</p>
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => setQuery(s)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '9px 10px', border: 'none', background: 'transparent', cursor: 'pointer',
                      borderRadius: 10, fontFamily: 'inherit', fontSize: 13, color: 'var(--text-secondary)',
                      transition: 'background 0.15s', textAlign: 'left'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Clock size={14} color="var(--text-muted)" />
                      {s}
                    </button>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Search size={28} color="var(--text-muted)" style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Start typing to search…</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
                    {['Projects', 'Tasks', 'Team', 'AI SaaS'].map(hint => (
                      <button key={hint} onClick={() => setQuery(hint)} style={{
                        padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border)',
                        background: 'var(--bg-main)', color: 'var(--text-secondary)',
                        fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
                      }}>{hint}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : filteredResults.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <Search size={28} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>No results found</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Try searching for a project, task, or team member</p>
            </div>
          ) : (
            <div style={{ padding: '10px 12px' }}>
              {Object.entries(grouped).map(([type, results]) => {
                const cfg = typeConfig[type as keyof typeof typeConfig];
                const Icon = cfg.icon;
                return (
                  <div key={type} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', marginBottom: 4 }}>
                      <Icon size={12} color={cfg.color} />
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</p>
                    </div>
                    {results.map(result => {
                      const currentIndex = globalIndex++;
                      const isSelected = selectedIndex === currentIndex;
                      return (
                        <button key={result.id} onClick={() => handleSelect(result)} style={{
                          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                          padding: '10px 12px', border: 'none', borderRadius: 10, cursor: 'pointer',
                          background: isSelected ? 'rgba(124,58,237,0.1)' : 'transparent',
                          transition: 'background 0.15s', fontFamily: 'inherit', textAlign: 'left',
                          outline: isSelected ? '1px solid rgba(124,58,237,0.3)' : 'none',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.07)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'rgba(124,58,237,0.1)' : 'transparent'; }}
                        >
                          {result.icon ? (
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{result.icon}</div>
                          ) : (
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon size={15} color={cfg.color} />
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.title}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.subtitle}</p>
                          </div>
                          <ArrowRight size={13} color="var(--text-muted)" />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontFamily: 'inherit' }}>↑↓</kbd> Navigate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontFamily: 'inherit' }}>↵</kbd> Select
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontFamily: 'inherit' }}>ESC</kbd> Close
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Command size={10} />K to open
          </span>
        </div>
      </div>
    </div>
  );
}
