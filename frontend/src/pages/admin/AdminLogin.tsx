import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../../components/SplashScreen';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showSuccessSplash, setShowSuccessSplash] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send credentials to Django REST Framework obtain_auth_token view
      const response = await fetch('/api/v1/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We pass the email to the username field since Django defaults to username
        body: JSON.stringify({ username: email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      if (response.ok && data.access) {
        // Save the tokens to localStorage
        localStorage.setItem('token', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        // Show success animation instead of immediate redirect
        setShowSuccessSplash(true);
      } else {
        // Handle incorrect credentials
        setError(data.detail || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred while trying to log in.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {showSuccessSplash && <SplashScreen onComplete={() => navigate('/admin/dashboard')} />}
      <div className="admin-login-layout">
        {/* Simplified Top Nav */}
      <nav className="admin-login-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontVariationSettings: "'FILL' 1" }}>eco</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.025em' }}>NYANSA AI</span>
        </div>
        <div>
          <a href="#" style={{ color: 'var(--color-on-surface-variant)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Support</a>
        </div>
      </nav>

      <main className="admin-login-main">
        {/* Visual Side */}
        <div className="admin-login-visual">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWgJT91PZGOXjB-fIIGOJV29glwV76m6VGZy9bZy9KS77ciwEXv3r8ThHRmQyksmfj9zqWIGeHS1cFicJ3LSLV_AHebWMzLbgFErvNSeujQIRCPUDNL3VVOgZNXa5VrK_71ullaruYxdfMGl_4GApoef_A4uMRKoAQzAdbij8AoNqy-uJaJHXzeOilTfk4FcRLkevEd6dFFzIGeoLZN3yFWgNrB-0cywGH_iPMPtnRMveFbOi8r5532z6I1hes1kNVbM4wjPuqHM6a" 
            alt="Agricultural Technology" 
          />
          <div className="admin-login-overlay">
            <div style={{ maxWidth: '28rem' }}>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Global Precision
              </span>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Powering the Future of Agri-Linguistics.
              </h1>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, lineHeight: 1.6, fontWeight: 300 }}>
                Bridging linguistic data science with raw agricultural vitality to secure global food systems.
              </p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="admin-login-form-side">
          <div className="admin-login-form-container">
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>Admin Login</h2>
              <p style={{ color: 'var(--color-on-surface-variant)' }}>Welcome back to the Agricultural Data Hub</p>
            </div>

            <form onSubmit={handleLogin}>
              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-error-container)', color: 'var(--color-error)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  {error}
                </div>
              )}
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Username or Email</label>
                <input 
                  type="text" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin" 
                  required 
                  className="admin-login-input"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Password</label>
                  <a href="#" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  className="admin-login-input"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <input type="checkbox" id="remember" style={{ width: '1rem', height: '1rem', accentColor: 'var(--color-primary)' }} />
                <label htmlFor="remember" style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>Remember me</label>
              </div>

              <button type="submit" className="admin-login-btn" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? 'Logging in...' : 'Login to Console'}
              </button>

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-surface-container-highest)', marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
                  Need access? <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Contact System Administrator</a>
                </p>
              </div>
            </form>

            <div style={{ marginTop: '3rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', marginRight: '0.25rem' }}>language</span> EN-GB
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}>
                v2.4.0-Stable
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="admin-login-footer">
        <div>
          <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>NYANSA AI</span>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-outline)', marginTop: '0.25rem' }}>© 2024 NYANSA AI Solutions. Precision in every grain.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" className="admin-footer-link">Privacy Policy</a>
          <a href="#" className="admin-footer-link">Terms of Service</a>
          <a href="#" className="admin-footer-link">Security</a>
          <a href="#" className="admin-footer-link">Global Standards</a>
        </div>
      </footer>
    </div>
    </>
  );
};

export default AdminLogin;
