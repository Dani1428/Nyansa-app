import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  id: string;
  code: string;
  name: string;
  group: string;
  samples_count: string;
  active: boolean;
  archived?: boolean;
}

interface Dialect {
  id: string;
  name: string;
  code: string;
  region: string;
  priority: number;
}

interface Expert {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  specialization: string;
  languages: string[];
  status: 'Active' | 'Idle';
}

const LanguagesExperts = () => {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [activeExpertMenu, setActiveExpertMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [newLanguage, setNewLanguage] = useState({ code: '', name: '', group: 'General', samples_count: '0 Samples' });
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [dialects, setDialects] = useState<Dialect[]>([]);
  const [isDialectLoading, setIsDialectLoading] = useState(false);
  const [newExpert, setNewExpert] = useState({ name: '', email: '', specialization: '', status: 'Active' as const, languages: [] as string[] });

  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveExpertMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [langRes, expRes] = await Promise.all([
          fetch('/api/v1/languages/', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/v1/experts/', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (langRes.ok) {
          const data = await langRes.json();
          setLanguages(data.results || (Array.isArray(data) ? data : []));
        }
        if (expRes.ok) {
          const data = await expRes.json();
          setExperts(data.results || (Array.isArray(data) ? data : []));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/v1/languages/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newLanguage, active: true })
      });
      if (response.ok) {
        const savedLang = await response.json();
        setLanguages([...languages, savedLang]);
        setIsModalOpen(false);
        setNewLanguage({ code: '', name: '', group: 'General', samples_count: '0 Samples' });
      }
    } catch (error) {
      console.error('Error adding language:', error);
    }
  };

  const handleInviteExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/v1/experts/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newExpert, avatar_url: '' })
      });
      if (response.ok) {
        const savedExpert = await response.json();
        setExperts([...experts, savedExpert]);
        setIsExpertModalOpen(false);
        setNewExpert({ name: '', email: '', specialization: '', status: 'Active', languages: [] });
      }
    } catch (error) {
      console.error('Error inviting expert:', error);
    }
  };

  const fetchDialects = async (langId: string) => {
    const token = localStorage.getItem('token');
    setIsDialectLoading(true);
    try {
      const response = await fetch(`/api/v1/languages/${langId}/dialects/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDialects(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (error) {
      console.error('Error fetching dialects:', error);
    } finally {
      setIsDialectLoading(false);
    }
  };

  const handleLanguageClick = (lang: Language) => {
    if (selectedLanguage?.id === lang.id) {
      setSelectedLanguage(null);
      setDialects([]);
    } else {
      setSelectedLanguage(lang);
      fetchDialects(lang.id);
    }
  };

  const toggleLanguage = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/v1/languages/${id}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: !currentStatus })
      });
      if (response.ok) {
        setLanguages(languages.map(lang => lang.id === id ? { ...lang, active: !currentStatus } : lang));
      }
    } catch (error) {
      console.error('Error toggling language:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.languages.title')}</h1>
          <p className="admin-page-desc">{t('admin.languages.desc')}</p>
        </div>
      </div>

      <div className="admin-grid-12">
        {/* Left Section: Language Management */}
        <div className="admin-col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <section className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>language</span>
                {t('admin.languages.active_dialects')}
              </h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {t('admin.common.add_new')}
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Array.isArray(languages) && languages.map((lang) => (
                <div key={lang.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div 
                    onClick={() => handleLanguageClick(lang)}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      padding: '0.75rem', borderRadius: '0.5rem', 
                      backgroundColor: selectedLanguage?.id === lang.id ? 'rgba(31, 122, 99, 0.05)' : 'var(--color-surface-container-low)', 
                      border: selectedLanguage?.id === lang.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                      cursor: 'pointer',
                      opacity: lang.archived ? 0.6 : 1 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '2rem', height: '2rem', borderRadius: '0.25rem', backgroundColor: lang.archived ? 'var(--color-surface-variant)' : 'rgba(31, 122, 99, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: lang.archived ? 'var(--color-on-surface-variant)' : 'var(--color-primary)', fontWeight: 800, fontSize: '0.75rem' }}>
                        {lang.code}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{lang.name}</p>
                        <p style={{ fontSize: '0.625rem', color: 'var(--color-on-surface-variant)', margin: 0 }}>{lang.group} • {lang.samples_count}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={e => e.stopPropagation()}>
                      <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: lang.archived ? 'not-allowed' : 'pointer' }}>
                        <input type="checkbox" className="sr-only" checked={lang.active} onChange={() => toggleLanguage(lang.id, lang.active)} disabled={lang.archived} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                        <div style={{ width: '2.25rem', height: '1.25rem', backgroundColor: lang.active ? 'var(--color-primary)' : 'var(--color-outline-variant)', borderRadius: '9999px', transition: 'background-color 0.2s', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '2px', left: lang.active ? 'calc(100% - 18px)' : '2px', width: '1rem', height: '1rem', backgroundColor: 'white', borderRadius: '50%', transition: 'all 0.2s' }}></div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {selectedLanguage?.id === lang.id && (
                    <div style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--color-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {isDialectLoading ? (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', padding: '0.5rem' }}>Loading dialects...</p>
                      ) : (Array.isArray(dialects) && dialects.length === 0) ? (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', padding: '0.5rem' }}>No dialects defined.</p>
                      ) : Array.isArray(dialects) && dialects.map(dialect => (
                        <div key={dialect.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '0.375rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{dialect.name}</span>
                          <span style={{ fontSize: '0.625rem', color: 'var(--color-on-surface-variant)' }}>{dialect.region}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div style={{ 
            background: 'linear-gradient(135deg, #00604c 0%, #004d3d 100%)', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            color: 'white', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h4 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.5rem', color: 'white' }}>{t('admin.languages.pipeline.title')}</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginBottom: '1rem' }}>{t('admin.languages.pipeline.desc')}</p>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem', marginBottom: '0.5rem', height: '3rem' }}>
                <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', height: '2rem', borderRadius: '0.25rem 0.25rem 0 0' }}></div>
                <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', height: '3rem', borderRadius: '0.25rem 0.25rem 0 0' }}></div>
                <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', height: '1.5rem', borderRadius: '0.25rem 0.25rem 0 0' }}></div>
                <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', height: '2.5rem', borderRadius: '0.25rem 0.25rem 0 0' }}></div>
                <div style={{ width: '100%', backgroundColor: 'white', height: '2.25rem', borderRadius: '0.25rem 0.25rem 0 0' }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span>
              </div>
            </div>
            <div style={{ position: 'absolute', right: '-1rem', bottom: '-1rem', width: '6rem', height: '6rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(24px)' }}></div>
          </div>
        </div>

        {/* Right Section: Experts Table */}
        <div className="admin-col-8">
          <div className="admin-table-container">
            <div className="admin-table-header" style={{ padding: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.125rem' }}>{t('admin.languages.experts.title')}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>{t('admin.languages.experts.desc')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--color-border)', borderRadius: '0.5rem', background: 'none', cursor: 'pointer' }}>{t('admin.common.export')}</button>
                <button 
                  onClick={() => setIsExpertModalOpen(true)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                >
                  {t('admin.languages.experts.invite')}
                </button>
              </div>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.languages.experts.table.expert')}</th>
                  <th>{t('admin.languages.experts.table.specialization')}</th>
                  <th>{t('admin.languages.experts.table.languages')}</th>
                  <th>{t('admin.languages.experts.table.status')}</th>
                  <th style={{ textAlign: 'right' }}>{t('admin.common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading experts...</td></tr>
                ) : (Array.isArray(experts) && experts.length === 0) ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No experts found.</td></tr>
                ) : Array.isArray(experts) && experts.map(expert => (
                  <tr key={expert.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={expert.avatar_url || 'https://via.placeholder.com/150'} alt={expert.name} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>{expert.name}</p>
                          <p style={{ fontSize: '0.625rem', color: 'var(--color-on-surface-variant)', margin: 0 }}>{expert.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary)', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 800 }}>
                        {expert.specialization}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {Array.isArray(expert.languages) && expert.languages.map(lang => (
                          <span key={lang} style={{ padding: '0 0.5rem', height: '1.5rem', borderRadius: '9999px', backgroundColor: 'var(--color-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 800 }}>
                            {lang.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: expert.status === 'Active' ? 'var(--color-secondary)' : 'var(--color-outline-variant)' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: expert.status === 'Active' ? 'var(--color-secondary)' : 'var(--color-outline-variant)' }}>
                          {expert.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', position: 'relative' }}>
                      <button 
                        className="admin-icon-btn" 
                        style={{ marginLeft: 'auto' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveExpertMenu(activeExpertMenu === expert.id ? null : expert.id);
                        }}
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                      
                      {activeExpertMenu === expert.id && (
                        <div 
                          ref={menuRef}
                          style={{ 
                            position: 'absolute', right: '1rem', top: '3rem', zIndex: 50,
                            backgroundColor: 'white', borderRadius: '0.75rem', padding: '0.5rem',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            border: '1px solid var(--color-border)', minWidth: '160px'
                          }}
                        >
                          <button style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>edit</span>
                            {t('admin.common.edit')}
                          </button>
                          <button style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>sync_alt</span>
                            {t('admin.languages.experts.change_status')}
                          </button>
                          <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.25rem 0' }} />
                          <button style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>delete</span>
                            {t('admin.common.delete')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-surface-container-high)' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Showing 4 of 28 experts</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="admin-icon-btn"><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="admin-icon-btn"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
          </div>

          {/* Expert Activity Summary Section */}
          <div className="admin-grid admin-grid-cols-3" style={{ marginTop: '2rem' }}>
            <div className="admin-card">
              <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Total Annotations</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>42.8K</h4>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.625rem', color: 'var(--color-secondary)', fontWeight: 800 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>trending_up</span>
                12% from last week
              </div>
            </div>
            
            <div className="admin-card">
              <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Verification Rate</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>98.2%</h4>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.625rem', color: 'var(--color-secondary)', fontWeight: 800 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>check_circle</span>
                Above benchmark
              </div>
            </div>
            
            <div className="admin-card">
              <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Active Experts</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>14</h4>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.625rem', color: 'var(--color-on-surface-variant)', fontWeight: 800 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>schedule</span>
                2 pending invites
              </div>
            </div>
          </div>

        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Add New Language</h3>
            <form onSubmit={handleAddLanguage}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Language Code (e.g., SW, YO)</label>
                <input 
                  type="text" 
                  className="admin-login-input" 
                  value={newLanguage.code}
                  onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Language Name</label>
                <input 
                  type="text" 
                  className="admin-login-input" 
                  value={newLanguage.name}
                  onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isExpertModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Invite New Expert</h3>
            <form onSubmit={handleInviteExpert}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  type="text" 
                  className="admin-login-input" 
                  value={newExpert.name}
                  onChange={(e) => setNewExpert({ ...newExpert, name: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Email Address</label>
                <input 
                  type="email" 
                  className="admin-login-input" 
                  value={newExpert.email}
                  onChange={(e) => setNewExpert({ ...newExpert, email: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '0.5rem' }}>Specialization</label>
                <input 
                  type="text" 
                  className="admin-login-input" 
                  placeholder="e.g. Soil Science, Morphology"
                  value={newExpert.specialization}
                  onChange={(e) => setNewExpert({ ...newExpert, specialization: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsExpertModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                >
                  Invite Expert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagesExperts;
