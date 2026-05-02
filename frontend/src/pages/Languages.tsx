import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Languages = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', language: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const allLanguages = [
    { name: 'Dioula', region: 'West Africa', countries: ['Côte d\'Ivoire', 'Burkina Faso'], tags: ['Text Corpus', 'Audio Speech', 'Annotated Images'], status: 'Active' },
    { name: 'Baoulé', region: 'West Africa', countries: ['Côte d\'Ivoire'], tags: ['Text Corpus', 'Audio Speech'], status: 'Active' },
    { name: 'Wolof', region: 'West Africa', countries: ['Senegal', 'Gambia'], tags: ['Text Corpus', 'Audio Speech', 'Annotated Images'], status: 'Active' },
    { name: 'Akan', region: 'West Africa', countries: ['Ghana', 'Ivory Coast'], tags: ['Text Corpus', 'Annotated Images'], status: 'Active' },
    { name: 'Bété', region: 'West Africa', countries: ['Côte d\'Ivoire'], tags: ['Text Corpus', 'Audio Speech'], status: 'Early Access' },
    { name: 'Swahili', region: 'East Africa', countries: ['Kenya', 'Tanzania'], tags: ['Text Corpus', 'Audio Speech'], status: 'Active' },
    { name: 'Hausa', region: 'West Africa', countries: ['Nigeria', 'Niger'], tags: ['Text Corpus', 'Audio Speech'], status: 'Active' },
  ];

  const regions = ['All', 'West Africa', 'East Africa'];

  const filteredLanguages = activeFilter === 'All' 
    ? allLanguages 
    : allLanguages.filter(lang => lang.region === activeFilter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          project_type: 'Language Request',
          message: `Request for language: ${formData.language}. Details: ${formData.details}`
        })
      });
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSuccess(false);
          setFormData({ name: '', email: '', language: '', details: '' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting language request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Supported African Languages & Dialect Mapping | nyansa</title>
        <meta name="description" content="Explore our support for low-resource African languages. We digitize regional dialects like Dioula, Bété, and Hausa to power global AI inclusivity." />
        <meta property="og:title" content="Supported African Languages & Dialect Mapping | nyansa" />
      </Helmet>

      <div style={{ marginTop: '5rem' }}>
        {/* Hero */}
        <section className="hero-landscape">
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlGFGOZ_FzBut6FX_XEw6ddnvWgMbh5J0gYTvBuKMJS0iNrKzlbWbg-l8CC2HyZBpv_4To_CgVuTOca9p5zN4LxH403jJST4IQil2pkb3hNnL5UTzEb8hHUQLod-MCnPpRCC4_6rCjqOEdn3A4iPLs1S5OrB9bwvbq0IixqtGp-JRH4CNEYZVR9SBdVBbS6y9wioN6juhij9KdYWH6SfZeaN9wOOLsC0nwAaR-JsBaurwMLpY9_D2a0fb0fwYMupY1YEzgyqa8rq3f" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Landscape" />
          </div>
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '800px' }}>
              <span style={{ display: 'inline-block', backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', borderRadius: '999px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', padding: '0.25rem 0.75rem' }}>{t('languages.hero.badge')}</span>
              <h1 style={{ color: '#fff', fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.5rem' }}>{t('languages.hero.title')}</h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '600px', fontWeight: 300 }}>
                {t('languages.hero.desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Value Section: Bento Grid */}
        <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-surface)' }}>
          <div className="container">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '1rem', border: '1px solid var(--color-outline-variant)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem', lineHeight: 1.2 }}>{t('languages.value.title')}</h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.625, marginBottom: '1.5rem' }}>{t('languages.value.desc')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(107, 254, 156, 0.2)', border: '1px solid rgba(107, 254, 156, 0.3)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '1rem' }}>precision_manufacturing</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-secondary-container)' }}>{t('languages.value.p1')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(107, 254, 156, 0.2)', border: '1px solid rgba(107, 254, 156, 0.3)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '1rem' }}>agriculture</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-secondary-container)' }}>{t('languages.value.p2')}</span>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', minHeight: '300px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5jPtwfJDuAk1wJpmXy821L-IWT00Z1i2Xuorvgln-qfWB7RyNZISTiqyn0Eh27EwGdCppdi65v7jqotYddWseUEbAIxfPB5BTjcvc5RdOr8xf5IpICX4RgwwyaK2ebjIrPG1r6UGNFrQZbOYfvZr98BvqVIcZ4HzWKQ3fR49NX2W7o9amTta7eq_gs1Xpi5wrPHESTNIKqeKgapGQ1ojO2pkAllYLRGWgU-OeKNQTew_kuH9b2JkoSX8Qq8t0CduXdVAjOnP0v_15" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="Agri Tech" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
                  <p style={{ color: '#fff', fontWeight: 500, fontStyle: 'italic', fontSize: '1.125rem' }}>{t('languages.value.quote')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Language Grid Section with Filter */}
        <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-surface)' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', gap: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-0.025em', marginBottom: '1rem' }}>{t('languages.grid.title')}</h2>
                <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '600px', fontWeight: 500 }}>{t('languages.grid.desc')}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>filter_list</span>
                <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--color-surface-container-low)', padding: '0.4rem', borderRadius: '0.75rem' }}>
                  {regions.map(region => (
                    <button
                      key={region}
                      onClick={() => setActiveFilter(region)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: activeFilter === region ? 'var(--color-primary)' : 'transparent',
                        color: activeFilter === region ? 'white' : 'var(--color-on-surface-variant)'
                      }}
                    >
                      {region === 'All' ? 'Toutes les régions' : region}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {filteredLanguages.map((lang, i) => (
                <div key={i} className="language-card">
                  <div className="language-card-accent"></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 10 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary)' }}>{lang.name}</h3>
                    <span style={{ 
                      backgroundColor: lang.status === 'Active' ? 'var(--color-secondary-container)' : 'var(--color-tertiary-container)', 
                      color: lang.status === 'Active' ? 'var(--color-on-secondary-container)' : 'var(--color-on-tertiary-container)', 
                      fontSize: '10px', fontWeight: 900, padding: '0.25rem 0.75rem', borderRadius: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' 
                    }}>
                      {lang.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>location_on</span>
                    <span style={{ fontWeight: 600 }}>{lang.countries.join(', ')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-outline)', letterSpacing: '0.15em' }}>{t('languages.grid.available')}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {lang.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '11px', fontWeight: 700, padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-on-surface-variant)', borderRadius: '999px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Request Card */}
              <div className="request-card" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>add_circle</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{t('languages.grid.request.title')}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', marginBottom: '1.5rem', maxWidth: '240px' }}>{t('languages.grid.request.desc')}</p>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px', cursor: 'pointer' }}>{t('languages.grid.request.button')}</button>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for Request Language */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1.25rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--color-outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary)' }}>{t('languages.grid.request.title')}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span>
                </button>
              </div>
              
              {isSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>check_circle</span>
                  <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.875rem' }}>{t('contact.form.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', color: 'var(--color-outline)' }}>{t('contact.form.name')}</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: '#F8F9FA', fontSize: '0.875rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', color: 'var(--color-outline)' }}>{t('contact.form.email')}</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: '#F8F9FA', fontSize: '0.875rem' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', color: 'var(--color-outline)' }}>Langue Demandée</label>
                    <input type="text" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: '#F8F9FA', fontSize: '0.875rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', color: 'var(--color-outline)' }}>{t('contact.form.message')}</label>
                    <textarea value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: '#F8F9FA', fontSize: '0.875rem', height: '80px', resize: 'none' }} />
                  </div>
                  <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '0.875rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Envoi...' : t('contact.form.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Technical Section */}
        <section style={{ padding: '8rem 0', borderTop: '1px solid var(--color-outline-variant)' }}>
          <div className="container">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center' }}>
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdWTifKnv9D4cERkMM8_72u_IB5qUrO4zimV3HsCDgRX2XiBOO8CpxMs28h54FQWzOWLBGPXsGRUcVd8TWlNFkYuRrENL659ZZUgNTyODHMHg_mUUF4Xpx-vw7sCCcGIpNpxJ3560UirmYmVcSECdIwIs5WRAfOfjCtVxxTbRqSCFEPc-dMVj-bYRu5-2ZV9HOvc597t0WzNxmpyjW7Nd6FwEaBWZefzeUPt6RgmuhR1W07I8kKhqn3G9EuAeiKMUWzhx82wXq_jsz" style={{ width: '100%', height: '400px', objectFit: 'cover' }} alt="Tech" />
              </div>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '1.5rem', lineHeight: 1.1 }}>{t('languages.tech.title')}</h2>
                <p style={{ fontSize: '1.125rem', lineHeight: 1.625, color: 'var(--color-on-surface-variant)', marginBottom: '2.5rem' }}>
                  {t('languages.tech.desc')}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <div>
                      <h4 style={{ fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{t('languages.tech.accuracy.title')}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>{t('languages.tech.accuracy.desc')}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <div>
                      <h4 style={{ fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{t('languages.tech.audio.title')}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>{t('languages.tech.audio.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Languages;
