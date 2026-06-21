import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminSettings = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Real state for preferences
  const [language, setLanguage] = useState(i18n.language || 'fr');
  const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'light');
  const [notifications, setNotifications] = useState({
    email: true,
    fraud: true
  });
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@nyansa@ai.com'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  // Apply theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    alert(t('admin.settings.preferences.save_success') || 'Settings saved successfully!');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const fetchApiKeys = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/apikeys/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching API keys:', err);
    }
  };

  const generateKey = async () => {
    setIsGeneratingKey(true);
    const token = localStorage.getItem('token');
    const name = prompt(t('admin.settings.api.name_prompt') || 'Enter a name for this key:');
    if (!name) {
      setIsGeneratingKey(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/apikeys/', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const data = await res.json();
        setNewlyGeneratedKey(data.secret_key);
        fetchApiKeys();
      }
    } catch (err) {
      console.error('Error generating key:', err);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const revokeKey = async (id: number) => {
    if (!window.confirm(t('admin.settings.api.revoke_confirm') || 'Are you sure you want to revoke this key?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/v1/apikeys/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchApiKeys();
      }
    } catch (err) {
      console.error('Error revoking key:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'api') {
      fetchApiKeys();
    }
  }, [activeTab]);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.sidebar.settings')}</h1>
          <p className="admin-page-desc">{t('admin.settings.desc') || 'Manage your admin profile, security preferences, and system configurations.'}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="admin-login-btn" 
          style={{ width: 'auto', padding: '0.5rem 1.5rem', height: '2.5rem', opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? t('admin.settings.preferences.saving') || 'Saving...' : t('admin.settings.preferences.save')}
        </button>
      </div>

      <div className="admin-grid-12">
        {/* Settings Navigation */}
        <div className="admin-col-4">
          <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                onClick={() => setActiveTab('profile')}
                style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: activeTab === 'profile' ? 'var(--color-surface-container-high)' : 'none', border: 'none', borderLeft: activeTab === 'profile' ? '4px solid var(--color-primary)' : '4px solid transparent', textAlign: 'left', cursor: 'pointer', color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-on-surface)', transition: 'all 0.2s' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>person</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('admin.settings.tabs.general')}</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('security')}
                style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: activeTab === 'security' ? 'var(--color-surface-container-high)' : 'none', border: 'none', borderLeft: activeTab === 'security' ? '4px solid var(--color-primary)' : '4px solid transparent', textAlign: 'left', cursor: 'pointer', color: activeTab === 'security' ? 'var(--color-primary)' : 'var(--color-on-surface)', transition: 'all 0.2s' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>security</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('admin.settings.tabs.security')}</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('preferences')}
                style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: activeTab === 'preferences' ? 'var(--color-surface-container-high)' : 'none', border: 'none', borderLeft: activeTab === 'preferences' ? '4px solid var(--color-primary)' : '4px solid transparent', textAlign: 'left', cursor: 'pointer', color: activeTab === 'preferences' ? 'var(--color-primary)' : 'var(--color-on-surface)', transition: 'all 0.2s' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>tune</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('admin.settings.tabs.preferences')}</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('api')}
                style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: activeTab === 'api' ? 'var(--color-surface-container-high)' : 'none', border: 'none', borderLeft: activeTab === 'api' ? '4px solid var(--color-primary)' : '4px solid transparent', textAlign: 'left', cursor: 'pointer', color: activeTab === 'api' ? 'var(--color-primary)' : 'var(--color-on-surface)', transition: 'all 0.2s' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>api</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>API Keys</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="admin-col-8">
          <div className="admin-card" style={{ minHeight: '400px' }}>
            {activeTab === 'profile' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Profile Information</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-uImxVou6Jqa3fvzk9C2Rhkc5oD6a4znOmyXvMn7-XmsAGBk7FpmX6xE6M7KsjKM5uLiOV2a9ERsEhaudDsv2hgIoYvgxgEMB12phlB3aQtMIC6TQrGCuwQpT8AE_bdwsU08amIAKEnNwHEO1dU52hQkJhle8UGDkFXNMNWyAfFvluXfaZgKgkEqJZT3CkMhPpMzFET6wLsFJl_JuL-snU2Wag1j86h5eX3PoS_4BhXhubakTM2bAYtUuzL97K5byYeCGAMnDGuEV" 
                    alt="Profile" 
                    style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <button style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--color-surface-container-high)', border: '1px solid var(--color-border)', borderRadius: '0.5rem', cursor: 'pointer', marginRight: '0.5rem', color: 'var(--color-on-surface)' }}>Change Avatar</button>
                    <button style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'transparent', color: 'var(--color-error)', border: 'none', cursor: 'pointer' }}>Remove</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>First Name</label>
                    <input 
                      type="text" 
                      value={profileData.firstName} 
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="admin-login-input" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Last Name</label>
                    <input 
                      type="text" 
                      value={profileData.lastName} 
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="admin-login-input" 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="admin-login-input" 
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Role</label>
                  <input type="text" defaultValue="Super Administrator" disabled className="admin-login-input" style={{ backgroundColor: 'var(--color-surface-container-low)', cursor: 'not-allowed', opacity: 0.7 }} />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Security & Passwords</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Current Password</label>
                  <input type="password" placeholder="••••••••" className="admin-login-input" />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>New Password</label>
                  <input type="password" placeholder="••••••••" className="admin-login-input" />
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="admin-login-input" />
                </div>

                <div style={{ borderTop: '1px solid var(--color-surface-container-high)', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-on-surface)' }}>Two-Factor Authentication (2FA)</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', marginBottom: '1rem' }}>Add an extra layer of security to your account.</p>
                  <button style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Enable 2FA</button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>{t('admin.settings.preferences.title')}</h3>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-on-surface)' }}>{t('admin.settings.preferences.theme')}</h4>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div 
                      onClick={() => handleThemeChange('light')}
                      style={{ flex: 1, border: theme === 'light' ? '2px solid var(--color-primary)' : '2px solid transparent', borderRadius: '0.75rem', padding: '1rem', cursor: 'pointer', backgroundColor: 'var(--color-surface-container-high)', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '100%', height: '40px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '0.5rem', border: '1px solid var(--color-border)' }}></div>
                      <span style={{ fontSize: '0.75rem', fontWeight: theme === 'light' ? 800 : 600, color: theme === 'light' ? 'var(--color-primary)' : 'inherit' }}>{t('admin.settings.preferences.light')}</span>
                    </div>
                    <div 
                      onClick={() => handleThemeChange('dark')}
                      style={{ flex: 1, border: theme === 'dark' ? '2px solid var(--color-primary)' : '2px solid transparent', borderRadius: '0.75rem', padding: '1rem', cursor: 'pointer', backgroundColor: 'var(--color-surface-container-low)', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '100%', height: '40px', backgroundColor: '#1a1a1a', borderRadius: '4px', marginBottom: '0.5rem', border: '1px solid #333' }}></div>
                      <span style={{ fontSize: '0.75rem', fontWeight: theme === 'dark' ? 800 : 600, color: theme === 'dark' ? 'var(--color-primary)' : 'inherit' }}>{t('admin.settings.preferences.dark')}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>{t('admin.settings.preferences.language')}</label>
                  <select 
                    value={language}
                    onChange={handleLanguageChange}
                    className="admin-login-input" 
                    style={{ appearance: 'none' }}
                  >
                    <option value="en">English (GB)</option>
                    <option value="fr">Français (FR)</option>
                  </select>
                </div>

                <div style={{ borderTop: '1px solid var(--color-surface-container-high)', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-on-surface)' }}>System Notifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Alerts</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>Receive daily summaries of dataset quality.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.email} 
                        onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                        style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Fraud Alerts</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>Instant notification on high-risk submissions.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.fraud} 
                        onChange={(e) => setNotifications({...notifications, fraud: e.target.checked})}
                        style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)' }}>API Keys</h3>
                  <button 
                    onClick={generateKey}
                    disabled={isGeneratingKey}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', opacity: isGeneratingKey ? 0.7 : 1 }}
                  >
                    {isGeneratingKey ? t('admin.common.loading') : t('admin.settings.api.generate')}
                  </button>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', marginBottom: '1.5rem' }}>
                  {t('admin.settings.api.desc')}
                </p>

                {apiKeys.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '0.75rem', border: '1px dashed var(--color-border)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>{t('admin.settings.api.no_keys')}</p>
                  </div>
                ) : (
                  <div className="admin-card" style={{ padding: '0', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid var(--color-surface-container-highest)' }}>
                    {apiKeys.map((key, idx) => (
                      <div key={key.id} style={{ padding: '1rem', borderBottom: idx === apiKeys.length - 1 ? 'none' : '1px solid var(--color-surface-container-highest)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>{key.name}</p>
                          <code style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>ny_{key.prefix}_••••••••</code>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--color-on-surface-variant)' }}>{t('admin.settings.api.created')}: {new Date(key.created_at).toLocaleDateString()}</p>
                          <button 
                            onClick={() => revokeKey(key.id)}
                            style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
                          >
                            {t('admin.settings.api.revoke')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(231, 76, 60, 0.05)', borderRadius: '0.75rem', border: '1px dashed var(--color-error)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-error)', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>warning</span>
                    {t('admin.settings.api.security_note')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {newlyGeneratedKey && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(31, 122, 99, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>key</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>{t('admin.settings.api.success_title')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', marginBottom: '1.5rem' }}>
              {t('admin.settings.api.success_desc')}
            </p>
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '0.5rem', border: '1px solid var(--color-border)', marginBottom: '1.5rem', position: 'relative' }}>
              <code style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', wordBreak: 'break-all' }}>{newlyGeneratedKey}</code>
              <button 
                onClick={() => { navigator.clipboard.writeText(newlyGeneratedKey); alert('Copied!'); }}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>content_copy</span>
              </button>
            </div>

            <button 
              onClick={() => setNewlyGeneratedKey(null)}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {t('admin.common.close') || 'I have saved it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
