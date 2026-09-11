'use client';

import { useState, useCallback } from 'react';
import {
  Upload, Search, Folder, File, Image, FileText, Archive,
  MoreHorizontal, Download, Trash2, Share2, Edit2, Eye,
  Plus, ChevronRight, Grid, List, X, FolderPlus
} from 'lucide-react';

type FileType = 'image' | 'pdf' | 'doc' | 'zip' | 'video' | 'other';

interface FileItem {
  id: number;
  name: string;
  type: FileType;
  size: string;
  modified: string;
  folder: string;
  shared?: boolean;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  color: string;
}

const folders: Folder[] = [
  { id: 'all', name: 'All Files', count: 24, color: '#7c3aed' },
  { id: 'design', name: 'Design', count: 8, color: '#a855f7' },
  { id: 'development', name: 'Development', count: 6, color: '#3b82f6' },
  { id: 'docs', name: 'Documents', count: 5, color: '#10b981' },
  { id: 'assets', name: 'Assets', count: 5, color: '#f59e0b' },
];

const initialFiles: FileItem[] = [
  { id: 1, name: 'Dashboard Mockup v3.fig', type: 'image', size: '4.2 MB', modified: '2h ago', folder: 'design', shared: true },
  { id: 2, name: 'Brand Guidelines.pdf', type: 'pdf', size: '2.1 MB', modified: '1d ago', folder: 'design' },
  { id: 3, name: 'App Icons Pack.zip', type: 'zip', size: '12.5 MB', modified: '3d ago', folder: 'assets' },
  { id: 4, name: 'Project Proposal.docx', type: 'doc', size: '856 KB', modified: '1d ago', folder: 'docs', shared: true },
  { id: 5, name: 'API Documentation.pdf', type: 'pdf', size: '1.3 MB', modified: '2d ago', folder: 'docs' },
  { id: 6, name: 'database-schema.sql', type: 'other', size: '45 KB', modified: '4h ago', folder: 'development' },
  { id: 7, name: 'Hero Banner.png', type: 'image', size: '3.8 MB', modified: '5d ago', folder: 'assets' },
  { id: 8, name: 'Meeting Notes.docx', type: 'doc', size: '234 KB', modified: '1w ago', folder: 'docs' },
  { id: 9, name: 'components.zip', type: 'zip', size: '8.7 MB', modified: '2d ago', folder: 'development' },
  { id: 10, name: 'Logo Variations.png', type: 'image', size: '2.4 MB', modified: '3d ago', folder: 'assets', shared: true },
  { id: 11, name: 'Sprint Planning.pdf', type: 'pdf', size: '675 KB', modified: '1w ago', folder: 'docs' },
  { id: 12, name: 'app-config.json', type: 'other', size: '12 KB', modified: '6h ago', folder: 'development' },
];

const fileTypeColors: Record<FileType, { bg: string; color: string; label: string }> = {
  image: { bg: '#ede9fe', color: '#7c3aed', label: 'IMG' },
  pdf: { bg: '#fee2e2', color: '#dc2626', label: 'PDF' },
  doc: { bg: '#dbeafe', color: '#1d4ed8', label: 'DOC' },
  zip: { bg: '#fef3c7', color: '#d97706', label: 'ZIP' },
  video: { bg: '#ecfdf5', color: '#059669', label: 'VID' },
  other: { bg: '#f1f5f9', color: '#475569', label: 'FILE' },
};

const FileIcon = ({ type, size = 20 }: { type: FileType; size?: number }) => {
  const icons: Record<FileType, React.ElementType> = {
    image: Image, pdf: FileText, doc: FileText,
    zip: Archive, video: File, other: File,
  };
  const Icon = icons[type];
  const cfg = fileTypeColors[type];
  return (
    <div style={{ width: size * 2, height: size * 2, borderRadius: 8, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={size} color={cfg.color} />
    </div>
  );
};

export default function Files() {
  const [activeFolder, setActiveFolder] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);

  const filtered = files.filter(f => {
    const inFolder = activeFolder === 'all' || f.folder === activeFolder;
    const inSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return inFolder && inSearch;
  });

  const deleteFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMenuOpen(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: FileItem[] = droppedFiles.map((f, i) => ({
      id: Date.now() + i, name: f.name, type: 'other',
      size: `${(f.size / 1024).toFixed(0)} KB`,
      modified: 'Just now', folder: activeFolder === 'all' ? 'design' : activeFolder,
    }));
    setFiles(prev => [...newFiles, ...prev]);
  }, [activeFolder]);

  const totalSize = '38.4 MB';
  const used = 38.4;
  const total = 1024;

  return (
    <div className="animate-fadeInUp">
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '9px 14px', minWidth: 200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text" placeholder="Search files..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', flex: 1, fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {[{ v: 'grid', Icon: Grid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
            <button key={v} onClick={() => setViewMode(v as any)} style={{
              padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: viewMode === v ? 'var(--primary)' : 'transparent',
              color: viewMode === v ? 'white' : 'var(--text-muted)', transition: 'all 0.2s'
            }}>
              <Icon size={15} />
            </button>
          ))}
        </div>
        <button className="btn-primary" style={{ fontSize: 13, gap: 6 }}>
          <Upload size={14} /> Upload
        </button>
        <button className="btn-secondary" style={{ fontSize: 13, gap: 6 }}>
          <FolderPlus size={14} /> New Folder
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 10, marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 8px', marginBottom: 6 }}>Folders</p>
            {folders.map(f => (
              <button key={f.id} onClick={() => setActiveFolder(f.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                marginBottom: 2, fontFamily: 'inherit', fontSize: 13, fontWeight: activeFolder === f.id ? 700 : 500,
                background: activeFolder === f.id ? 'linear-gradient(135deg, var(--primary), var(--primary-light))' : 'transparent',
                color: activeFolder === f.id ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s', textAlign: 'left',
              }}
                onMouseEnter={e => { if (activeFolder !== f.id) { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (activeFolder !== f.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <Folder size={15} color={activeFolder === f.id ? 'white' : f.color} />
                <span style={{ flex: 1 }}>{f.name}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                  background: activeFolder === f.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-main)',
                  color: activeFolder === f.id ? 'white' : 'var(--text-muted)'
                }}>{f.count}</span>
              </button>
            ))}
          </div>

          {/* Storage */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Storage</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>{used} MB of {total} MB used</p>
            <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${(used / total) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: 10 }} />
            </div>
            <button style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #ddd6fe', background: 'transparent', color: '#7c3aed', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Upgrade Storage
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>Files</span>
            {activeFolder !== 'all' && (
              <>
                <ChevronRight size={12} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {folders.find(f => f.id === activeFolder)?.name}
                </span>
              </>
            )}
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{filtered.length} files · {totalSize}</span>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? '#7c3aed' : 'var(--border)'}`,
              borderRadius: 16, padding: '20px',
              background: dragOver ? 'rgba(124,58,237,0.06)' : 'transparent',
              textAlign: 'center', marginBottom: 20, transition: 'all 0.2s',
              cursor: 'pointer', display: filtered.length === 0 ? 'block' : dragOver ? 'block' : 'none'
            }}
          >
            <Upload size={28} color={dragOver ? '#7c3aed' : 'var(--text-muted)'} style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: dragOver ? '#7c3aed' : 'var(--text-primary)' }}>
              {dragOver ? 'Drop files here!' : 'Drag & drop files here'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>or click Upload button above</p>
          </div>

          {/* Files */}
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {filtered.map(file => (
                <div key={file.id}
                  onDoubleClick={() => setPreviewFile(file)}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
                    padding: 14, cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#a855f7'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(124,58,237,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <FileIcon type={file.type} size={18} />
                    <div style={{ position: 'relative' }}>
                      <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === file.id ? null : file.id); }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex' }}>
                        <MoreHorizontal size={14} />
                      </button>
                      {menuOpen === file.id && (
                        <div style={{
                          position: 'absolute', top: '100%', right: 0, background: 'var(--bg-card)',
                          borderRadius: 10, border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          zIndex: 50, padding: 6, minWidth: 140, animation: 'fadeInUp 0.15s ease'
                        }}>
                          {[
                            { label: 'Preview', icon: Eye, action: () => { setPreviewFile(file); setMenuOpen(null); } },
                            { label: 'Download', icon: Download, action: () => setMenuOpen(null) },
                            { label: 'Share', icon: Share2, action: () => setMenuOpen(null) },
                            { label: 'Rename', icon: Edit2, action: () => setMenuOpen(null) },
                            { label: 'Delete', icon: Trash2, action: () => deleteFile(file.id), danger: true },
                          ].map(action => (
                            <button key={action.label} onClick={action.action} style={{
                              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                              padding: '8px 10px', border: 'none', background: 'transparent',
                              cursor: 'pointer', fontSize: 12, fontWeight: 500, borderRadius: 7,
                              color: (action as any).danger ? '#ef4444' : 'var(--text-primary)',
                              fontFamily: 'inherit', transition: 'background 0.15s', textAlign: 'left'
                            }}
                              onMouseEnter={e => e.currentTarget.style.background = (action as any).danger ? '#fee2e2' : 'var(--bg-card-hover)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <action.icon size={13} />
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{file.size} · {file.modified}</p>
                  {file.shared && <span style={{ fontSize: 9, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, padding: '2px 6px', borderRadius: 6, marginTop: 6, display: 'inline-block' }}>Shared</span>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>Name</span><span>Type</span><span>Size</span><span>Modified</span><span></span>
              </div>
              {filtered.map(file => (
                <div key={file.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-main)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  onDoubleClick={() => setPreviewFile(file)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileIcon type={file.type} size={14} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</span>
                    {file.shared && <span style={{ fontSize: 9, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>Shared</span>}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{fileTypeColors[file.type].label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{file.size}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{file.modified}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setPreviewFile(file)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex' }}><Eye size={14} /></button>
                    <button onClick={() => deleteFile(file.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', padding: 4, borderRadius: 6, display: 'flex' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <File size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No files found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
          onClick={() => setPreviewFile(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-card)', borderRadius: 20, width: '90%', maxWidth: 500,
            padding: 28, boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.25s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <FileIcon type={previewFile.type} size={22} />
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{previewFile.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{previewFile.size} · Modified {previewFile.modified}</p>
                </div>
              </div>
              <button onClick={() => setPreviewFile(null)} style={{ border: 'none', background: 'var(--bg-main)', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ height: 200, background: 'var(--bg-main)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid var(--border-light)' }}>
              <div style={{ textAlign: 'center' }}>
                <FileIcon type={previewFile.type} size={30} />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>Preview not available</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Click Download to view this file</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setPreviewFile(null)} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>Close</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13, gap: 6 }}><Download size={14} />Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for menu */}
      {menuOpen !== null && <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(null)} />}
    </div>
  );
}
