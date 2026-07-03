'use client';

import { useState } from 'react';
import { Mail, Lock, User, Sparkles, Building, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState<'admin' | 'manager' | 'member'>('member');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
      localStorage.setItem('taskflow-role', role);
      localStorage.setItem('taskflow-auth', 'true');
      window.location.href = '/'; // Redirect to dashboard
    }, 1500);
  };

  return (
    <div className="auth-layout">
      
      {/* Right Branding Panel (Hidden on small screens) */}
      <div className="auth-brand" style={{ 
        background: 'linear-gradient(160deg, #0a1628, #0d2137, #0f3460)',
        color: 'white', padding: '40px', position: 'relative', overflow: 'hidden', order: 2
      }}>
        {/* Radial glow blobs */}
        <div style={{ position: 'absolute', top: '5%', right: '-5%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        
        <div style={{ zIndex: 10, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.5), rgba(59,130,246,0.5))',
            backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 30px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}>
            <img src="/logo.png" alt="TaskFlow AI" style={{ width: 60, height: 60, objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.15, letterSpacing: '-0.5px' }}>Join TaskFlow AI</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40 }}>
            Start collaborating with your team, managing projects efficiently, and letting AI handle the heavy lifting.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            {[{ val: '500+', label: 'Teams' }, { val: '4.9★', label: 'Rating' }, { val: 'Free', label: 'to Start' }].map(s => (
              <div key={s.val} style={{ background: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: 16, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{s.val}</h3>
                <p style={{ fontSize: 11, opacity: 0.7 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left Register Panel */}
      <div className="auth-form-panel" style={{ order: 1 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Create an Account</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Sign up to get started with TaskFlow AI.</p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Role Selection */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                I am signing up as a:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { id: 'admin', label: 'Admin' },
                  { id: 'manager', label: 'Manager' },
                  { id: 'member', label: 'Member' },
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    style={{
                      padding: '10px 0', borderRadius: 10, border: `1px solid ${role === r.id ? '#10b981' : 'var(--border)'}`,
                      background: role === r.id ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)',
                      color: role === r.id ? '#10b981' : 'var(--text-muted)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none'
                  }} 
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none'
                  }} 
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password (min 8 chars)"
                  required
                  minLength={8}
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none'
                  }} 
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: 10, width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)', transition: 'all 0.2s', opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
              ) : (
                <>Sign Up <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text-secondary)' }}>
            Already have an account? <a href="/login" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none' }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
