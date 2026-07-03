'use client';

import { useState } from 'react';
import { Mail, Lock, Sparkles, Shield, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'manager' | 'member'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login based on role
    setTimeout(() => {
      // Set some local storage to simulate auth
      localStorage.setItem('taskflow-role', role);
      localStorage.setItem('taskflow-auth', 'true');
      window.location.href = '/'; // Redirect to dashboard
    }, 1200);
  };

  return (
    <div className="auth-layout">
      
      {/* Left Branding Panel */}
      <div className="auth-brand" style={{ 
        background: 'linear-gradient(160deg, #0f0c29, #302b63, #24243e)',
        color: 'white', padding: '40px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Radial glow blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.5) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', top: '55%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ zIndex: 10, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.6), rgba(124,58,237,0.6))',
            backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 30px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}>
            <img src="/logo.png" alt="TaskFlow AI" style={{ width: 60, height: 60, objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.15, letterSpacing: '-0.5px' }}>Welcome to<br />TaskFlow AI</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40 }}>
            The intelligent project management platform that adapts to your workflow.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            {[{ val: '10x', label: 'Faster Delivery' }, { val: '99%', label: 'Task Completion' }, { val: '50+', label: 'Integrations' }].map(s => (
              <div key={s.val} style={{ background: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: 16, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{s.val}</h3>
                <p style={{ fontSize: 11, opacity: 0.7 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="auth-form-panel">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Sign In</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Role Selector */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                Select Your Role (Demo)
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { id: 'admin', label: 'Admin', icon: Shield },
                  { id: 'manager', label: 'Manager', icon: User },
                  { id: 'member', label: 'Member', icon: User },
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 12, border: `1px solid ${role === r.id ? 'var(--primary)' : 'var(--border)'}`,
                      background: role === r.id ? 'var(--primary-glow)' : 'var(--bg-card)',
                      color: role === r.id ? 'var(--primary)' : 'var(--text-muted)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <r.icon size={18} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</span>
                  </button>
                ))}
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
                  placeholder={`demo.${role}@taskflow.ai`}
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none'
                  }} 
                  onFocus={e => e.target.style.borderColor = 'var(--primary-light)'}
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
                  placeholder="••••••••"
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none'
                  }} 
                  onFocus={e => e.target.style.borderColor = 'var(--primary-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Remember me</span>
              </label>
              <a href="#" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: 10, width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 24px var(--primary-glow)', transition: 'all 0.2s', opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text-secondary)' }}>
            Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
