'use client';

import { useState } from 'react';
import {
  Github, Slack, Chrome, Zap, CheckCircle, Search,
  X, ExternalLink, RefreshCw, ChevronRight, Star
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

// SVG icon components for integrations without Lucide equivalents
const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26">
    <path d="M6.56 2l5.44 9.42L6.56 2zM2 18l3.88-6.72L2 18zm15.44-6.58L12 2 6.56 2l5.44 9.42h5.44zM2 18h20l-2-3.46H4L2 18z" fill="#4285f4"/>
    <path d="M22 18l-3.88-6.72L22 18z" fill="#34a853"/>
    <path d="M6 18l5.44-9.42L6.56 2 2 18h4z" fill="#ea4335"/>
    <path d="M18 18H6l5.44-9.42L18 18z" fill="#fbbc05"/>
  </svg>
);

const NotionIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.06 2.207c-.42-.326-.981-.7-2.055-.607L3.01 2.686c-.467.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.539 1.447-1.632z" fill="#000"/>
  </svg>
);

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26">
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 10.021c-1.665 0-3.019 1.354-3.019 3.019s1.354 3.019 3.019 3.019h3.117v-6.038H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.026-4.49 4.515-4.49c2.489 0 4.515 2.014 4.515 4.49S10.661 24 8.172 24zm0-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.355 3.019-3.019S9.837 16.491 8.172 16.491z" fill="#F24E1E"/>
    <path d="M15.852 16.491c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019S18.871 21.175 18.871 19.51s-1.354-3.019-3.019-3.019z" fill="#A259FF"/>
  </svg>
);

const TrelloIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26">
    <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.645-1.44-1.44V5.82c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v12.36zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.794 0-1.44-.646-1.44-1.44V5.82c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v6.36z" fill="#0079BF"/>
  </svg>
);

const JiraIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26">
    <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.004-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24.018 12.49V1.005A1.001 1.001 0 0 0 23.013 0z" fill="#2684FF"/>
  </svg>
);

const ZapierIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.664 9.09l-4.518 3.07 1.728 5.296-4.56-3.306-4.56 3.306 1.728-5.295-4.518-3.07h5.586L12 3.794l1.45 5.296h5.214z" fill="#FF4A00"/>
  </svg>
);

const allIntegrations: Integration[] = [
  {
    id: 'github', name: 'GitHub', category: 'Development',
    description: 'Sync repos, link commits to tasks, and track pull requests automatically.',
    connected: true, popular: true, color: '#24292e',
    icon: <Github size={26} />,
    features: ['Link PRs to tasks', 'Auto-close on merge', 'Commit activity feed'],
  },
  {
    id: 'slack', name: 'Slack', category: 'Communication',
    description: 'Send task updates, deadline reminders, and notifications to Slack channels.',
    connected: true, popular: true, color: '#4A154B',
    icon: <Slack size={26} />,
    features: ['Task notifications', 'Channel alerts', 'Daily digest'],
  },
  {
    id: 'google-drive', name: 'Google Drive', category: 'Storage',
    description: 'Attach Google Docs, Sheets, and Drive files directly to your tasks.',
    connected: false, popular: true, color: '#4285F4',
    icon: <GoogleDriveIcon />,
    features: ['Attach Drive files', 'Auto-save documents', 'Folder sync'],
  },
  {
    id: 'notion', name: 'Notion', category: 'Productivity',
    description: 'Sync your Notion databases with TaskFlow projects and tasks.',
    connected: false, color: '#000000',
    icon: <NotionIcon />,
    features: ['Database sync', 'Page embedding', 'Two-way updates'],
  },
  {
    id: 'figma', name: 'Figma', category: 'Design',
    description: 'Embed Figma designs in tasks and get notified when files are updated.',
    connected: false, popular: true, color: '#F24E1E',
    icon: <FigmaIcon />,
    features: ['Design previews', 'Comment sync', 'Version tracking'],
  },
  {
    id: 'trello', name: 'Trello', category: 'Project Management',
    description: 'Import Trello boards and cards as TaskFlow projects and tasks.',
    connected: false, color: '#0079BF',
    icon: <TrelloIcon />,
    features: ['Board import', 'Card migration', 'Label mapping'],
  },
  {
    id: 'jira', name: 'Jira', category: 'Development',
    description: 'Sync Jira issues with TaskFlow tasks for a unified workflow view.',
    connected: false, color: '#2684FF',
    icon: <JiraIcon />,
    features: ['Issue sync', 'Sprint mapping', 'Status updates'],
  },
  {
    id: 'zapier', name: 'Zapier', category: 'Automation',
    description: 'Automate workflows by connecting TaskFlow with 5000+ apps via Zapier.',
    connected: false, color: '#FF4A00',
    icon: <ZapierIcon />,
    features: ['Custom triggers', '5000+ apps', 'No-code automation'],
  },
];

const categories = ['All', 'Development', 'Communication', 'Storage', 'Design', 'Productivity', 'Automation', 'Project Management'];

export default function Integrations() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [integrations, setIntegrations] = useState(allIntegrations);
  const [detailModal, setDetailModal] = useState<Integration | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const filtered = integrations.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || i.category === category;
    return matchSearch && matchCat;
  });

  const connected = filtered.filter(i => i.connected);
  const available = filtered.filter(i => !i.connected);

  const toggleConnection = (id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
      setConnectingId(null);
      if (detailModal?.id === id) {
        setDetailModal(prev => prev ? { ...prev, connected: !prev.connected } : null);
      }
    }, 1500);
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 16, border: `1px solid ${integration.connected ? '#a78bfa50' : 'var(--border)'}`,
      padding: 20, transition: 'all 0.25s', cursor: 'pointer', position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#a855f7'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(124,58,237,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = integration.connected ? '#a78bfa50' : 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
      onClick={() => setDetailModal(integration)}
    >
      {integration.popular && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 3, background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10 }}>
          <Star size={9} fill="#d97706" /> Popular
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {integration.icon}
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{integration.name}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{integration.category}</p>
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16, minHeight: 36 }}>{integration.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {integration.connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#10b981', fontWeight: 600 }}>
            <CheckCircle size={14} /> Connected
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Not connected</div>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggleConnection(integration.id); }}
          style={{
            padding: '7px 14px', borderRadius: 9, border: integration.connected ? '1px solid #fecaca' : '1px solid #ddd6fe',
            background: integration.connected ? 'transparent' : '#ede9fe',
            color: integration.connected ? '#ef4444' : '#7c3aed',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s'
          }}
        >
          {connectingId === integration.id ? (
            <><RefreshCw size={12} style={{ animation: 'spin-slow 0.8s linear infinite' }} /> Connecting…</>
          ) : integration.connected ? (
            <><X size={12} /> Disconnect</>
          ) : (
            <><Zap size={12} /> Connect</>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeInUp">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '9px 14px', minWidth: 200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text" placeholder="Search integrations..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', flex: 1, fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          <span style={{ color: '#10b981', fontWeight: 700 }}>{integrations.filter(i => i.connected).length}</span> connected · {integrations.length} total
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '6px 14px', borderRadius: 20, border: `1px solid ${category === cat ? '#7c3aed' : 'var(--border)'}`,
            background: category === cat ? '#ede9fe' : 'transparent',
            color: category === cat ? '#7c3aed' : 'var(--text-secondary)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
          }}>{cat}</button>
        ))}
      </div>

      {/* Connected */}
      {connected.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Connected</h3>
            <span style={{ fontSize: 12, background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{connected.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {connected.map(i => <IntegrationCard key={i.id} integration={i} />)}
          </div>
        </div>
      )}

      {/* Available */}
      {available.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Available Integrations</h3>
            <span style={{ fontSize: 12, background: 'var(--bg-main)', color: 'var(--text-muted)', fontWeight: 700, padding: '2px 8px', borderRadius: 10, border: '1px solid var(--border)' }}>{available.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {available.map(i => <IntegrationCard key={i.id} integration={i} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Zap size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>No integrations found</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Try a different search term or category</p>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
          onClick={() => setDetailModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-card)', borderRadius: 24, width: '90%', maxWidth: 480,
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.25s ease', overflow: 'hidden'
          }}>
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {detailModal.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{detailModal.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{detailModal.category}</p>
                  </div>
                </div>
                <button onClick={() => setDetailModal(null)} style={{ border: 'none', background: 'var(--bg-main)', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, borderRadius: 8, display: 'flex' }}><X size={16} /></button>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{detailModal.description}</p>

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Features</p>
                {detailModal.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <CheckCircle size={13} color="#10b981" />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDetailModal(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>Close</button>
                <button onClick={() => toggleConnection(detailModal.id)} style={{
                  flex: 2, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: detailModal.connected ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: 'white', fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: detailModal.connected ? '0 4px 12px rgba(239,68,68,0.25)' : '0 4px 12px rgba(124,58,237,0.25)',
                  transition: 'all 0.2s'
                }}>
                  {connectingId === detailModal.id ? (
                    <><RefreshCw size={14} style={{ animation: 'spin-slow 0.8s linear infinite' }} /> Connecting…</>
                  ) : detailModal.connected ? (
                    <><X size={14} /> Disconnect</>
                  ) : (
                    <><ExternalLink size={14} /> Connect with OAuth</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
