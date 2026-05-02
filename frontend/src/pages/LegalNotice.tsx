import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const LegalNotice = () => {
  const { t } = useTranslation();
  const sectionStyle: React.CSSProperties = { marginBottom: '3.5rem' };
  const h2Style: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary)', paddingBottom: '0.5rem', borderBottom: '2px solid var(--color-outline-variant)' };
  const pStyle: React.CSSProperties = { color: 'var(--color-on-surface-variant)', lineHeight: 1.8, marginBottom: '0.75rem' };

  return (
    <>
      <Helmet>
        <title>{t('legal.meta_title')}</title>
        <meta name="description" content={t('legal.meta_desc')} />
      </Helmet>
      <div style={{ marginTop: '5rem', backgroundColor: 'var(--color-surface)' }}>
        <section style={{ padding: '6rem 0 4rem 0', borderBottom: '1px solid var(--color-outline-variant)', background: 'linear-gradient(135deg, rgba(31,122,99,0.04) 0%, transparent 60%)' }}>
          <div className="container">
            <span style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.2em', marginBottom: '1rem', display: 'block' }}>{t('legal.badge')}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-0.025em', marginBottom: '1.5rem' }}>
              {t('legal.title')}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-on-surface-variant)', maxWidth: '640px', lineHeight: 1.7 }}>
              {t('legal.intro')}
            </p>
          </div>
        </section>

        <section style={{ padding: '5rem 0' }}>
          <div className="container">
            <div style={{ maxWidth: '820px' }}>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('legal.s1_title')}</h2>
                <p style={pStyle}>{t('legal.s1_p')}</p>
                <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '1rem', padding: '1.5rem 2rem', border: '1px solid var(--color-outline-variant)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {[
                    [t('legal.s1_name'), 'Nyansa AI'],
                    [t('legal.s1_legal'), t('legal.s1_legal_v')],
                    [t('legal.s1_hq'), t('legal.s1_hq_v')],
                    [t('legal.s1_director'), 'Elie Daniel'],
                    [t('legal.s1_email'), 'eliedaniel2013@gmail.com'],
                    [t('legal.s1_phone'), '+225 07 69 98 91 78'],
                  ].map(([label, value]) => (
                    <div key={label as string} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-on-surface)', minWidth: '220px', fontSize: '0.875rem' }}>{label} :</span>
                      <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('legal.s2_title')}</h2>
                <p style={pStyle}>
                  {t('legal.s2_p1')}
                </p>
                <p style={pStyle}>
                  {t('legal.s2_p2')} <a href="mailto:eliedaniel2013@gmail.com" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>eliedaniel2013@gmail.com</a>
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('legal.s3_title')}</h2>
                <p style={pStyle}>
                  {t('legal.s3_p1')}
                </p>
                <p style={pStyle}>
                  {t('legal.s3_p2')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('legal.s4_title')}</h2>
                <p style={pStyle}>
                  {t('legal.s4_p')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('legal.s5_title')}</h2>
                <p style={pStyle}>
                  {t('legal.s5_p')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('legal.s6_title')}</h2>
                <p style={pStyle}>
                  {t('legal.s6_p1')}
                </p>
                <p style={pStyle}>
                  {t('legal.s6_p2')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('legal.s7_title')}</h2>
                <p style={pStyle}>
                  {t('legal.s7_p')}
                </p>
              </div>

              <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(31,122,99,0.07) 0%, rgba(107,254,156,0.05) 100%)', borderRadius: '1.25rem', border: '1px solid var(--color-outline-variant)' }}>
                <h2 style={{ ...h2Style, border: 'none', paddingBottom: 0, marginBottom: '0.75rem' }}>{t('legal.contact_section')}</h2>
                <p style={pStyle}>{t('legal.contact_desc')}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.75rem' }}>
                  <a href="mailto:eliedaniel2013@gmail.com" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined">mail</span> eliedaniel2013@gmail.com
                  </a>
                  <a href="tel:+2250769989178" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined">phone</span> +225 07 69 98 91 78
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LegalNotice;