import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const Specialization: FC = () => {
  const { t } = useTranslation();

  return (
    <section style={{ padding: '6rem 0', backgroundColor: '#fff' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5rem', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                {t('home.specialization.title')}
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.6, marginBottom: '2rem' }}>
                {t('home.specialization.desc')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)' }}>50+</span>
                  <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-on-surface-variant)', marginTop: '0.5rem' }}>{t('home.specialization.dialects')}</p>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)' }}>10k+</span>
                  <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-on-surface-variant)', marginTop: '0.5rem' }}>{t('home.specialization.fields')}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-surface-container-highest)', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ color: 'var(--color-primary)' }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '2rem' }}>translate</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('home.specialization.regional')}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Dioula', 'Baoulé', 'Bété'].map(tag => (
                      <span key={tag} style={{ fontSize: '10px', fontWeight: 800, padding: '0.25rem 0.75rem', backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary)', borderRadius: '999px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-surface-container-highest)', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ color: 'var(--color-primary)' }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '2rem' }}>eco</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('home.specialization.value_chains')}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Cacao', 'Hévéa', 'Palmier'].map(tag => (
                      <span key={tag} style={{ fontSize: '10px', fontWeight: 800, padding: '0.25rem 0.75rem', backgroundColor: 'rgba(133, 64, 54, 0.1)', color: 'var(--color-tertiary)', borderRadius: '999px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-surface-container-highest)', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ color: 'var(--color-primary)' }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '2rem' }}>analytics</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('home.specialization.field_data')}</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>{t('home.specialization.field_data_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialization;
