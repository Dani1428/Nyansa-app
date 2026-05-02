import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const TermsOfUse = () => {
  const { t } = useTranslation();
  const sectionStyle: React.CSSProperties = { marginBottom: '3.5rem' };
  const h2Style: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary)', paddingBottom: '0.5rem', borderBottom: '2px solid var(--color-outline-variant)' };
  const pStyle: React.CSSProperties = { color: 'var(--color-on-surface-variant)', lineHeight: 1.8, marginBottom: '0.75rem' };
  const liStyle: React.CSSProperties = { display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' };

  const CheckItem = ({ children }: { children: React.ReactNode }) => (
    <li style={liStyle}>
      <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '1.25rem', flexShrink: 0 }}>check_circle</span>
      <span style={{ color: 'var(--color-on-surface-variant)', fontWeight: 500, lineHeight: 1.7 }}>{children}</span>
    </li>
  );

  const CrossItem = ({ children }: { children: React.ReactNode }) => (
    <li style={liStyle}>
      <span className="material-symbols-outlined" style={{ color: 'var(--color-error)', fontSize: '1.25rem', flexShrink: 0 }}>cancel</span>
      <span style={{ color: 'var(--color-on-surface-variant)', fontWeight: 500, lineHeight: 1.7 }}>{children}</span>
    </li>
  );

  return (
    <>
      <Helmet>
        <title>{t('terms.meta_title')}</title>
        <meta name="description" content={t('terms.meta_desc')} />
      </Helmet>
      <div style={{ marginTop: '5rem', backgroundColor: 'var(--color-surface)' }}>
        <section style={{ padding: '6rem 0 4rem 0', borderBottom: '1px solid var(--color-outline-variant)', background: 'linear-gradient(135deg, rgba(31,122,99,0.04) 0%, transparent 60%)' }}>
          <div className="container">
            <span style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.2em', marginBottom: '1rem', display: 'block' }}>{t('terms.badge')}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-0.025em', marginBottom: '1.5rem' }}>
              {t('terms.title')}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-on-surface-variant)', maxWidth: '640px', lineHeight: 1.7 }}>
              {t('terms.intro')}
            </p>
          </div>
        </section>

        <section style={{ padding: '5rem 0' }}>
          <div className="container">
            <div style={{ maxWidth: '820px' }}>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s1_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s1_p1')}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <CheckItem>{t('terms.s1_i1')}</CheckItem>
                  <CheckItem>{t('terms.s1_i2')}</CheckItem>
                  <CheckItem>{t('terms.s1_i3')}</CheckItem>
                  <CheckItem>{t('terms.s1_i4')}</CheckItem>
                </ul>
                <p style={pStyle}>
                  {t('terms.s1_p2')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s2_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s2_p')}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <CheckItem>{t('terms.s2_i1')}</CheckItem>
                  <CheckItem>{t('terms.s2_i2')}</CheckItem>
                  <CheckItem>{t('terms.s2_i3')}</CheckItem>
                  <CheckItem>{t('terms.s2_i4')}</CheckItem>
                </ul>
                <p style={pStyle}>
                  {t('terms.s2_p2')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s3_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s3_p')}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <CheckItem>{t('terms.s3_i1')}</CheckItem>
                  <CheckItem>{t('terms.s3_i2')}</CheckItem>
                  <CheckItem>{t('terms.s3_i3')}</CheckItem>
                  <CheckItem>{t('terms.s3_i4')}</CheckItem>
                </ul>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s4_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s4_p1')}
                </p>
                <p style={pStyle}>
                  {t('terms.s4_p2')}
                </p>
                <p style={pStyle}>
                  {t('terms.s4_p3')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s5_title')}</h2>
                <p style={pStyle}>{t('terms.s5_p')}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <CrossItem>{t('terms.s5_i1')}</CrossItem>
                  <CrossItem>{t('terms.s5_i2')}</CrossItem>
                  <CrossItem>{t('terms.s5_i3')}</CrossItem>
                  <CrossItem>{t('terms.s5_i4')}</CrossItem>
                  <CrossItem>{t('terms.s5_i5')}</CrossItem>
                  <CrossItem>{t('terms.s5_i6')}</CrossItem>
                  <CrossItem>{t('terms.s5_i7')}</CrossItem>
                </ul>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s6_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s6_p1')}
                </p>
                <p style={pStyle}>
                  {t('terms.s6_p2')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s7_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s7_p')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s8_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s8_p1')}
                </p>
                <p style={pStyle}>
                  {t('terms.s8_p2')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s9_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s9_p1')}
                </p>
                <p style={pStyle}>
                  {t('terms.s9_p2')}
                </p>
              </div>

              <div style={sectionStyle}>
                <h2 style={h2Style}>{t('terms.s10_title')}</h2>
                <p style={pStyle}>
                  {t('terms.s10_p')}
                </p>
              </div>

              <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(31,122,99,0.07) 0%, rgba(107,254,156,0.05) 100%)', borderRadius: '1.25rem', border: '1px solid var(--color-outline-variant)' }}>
                <h2 style={{ ...h2Style, border: 'none', paddingBottom: 0, marginBottom: '0.75rem' }}>{t('terms.contact_section')}</h2>
                <p style={pStyle}>{t('terms.contact_desc')}</p>
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

export default TermsOfUse;