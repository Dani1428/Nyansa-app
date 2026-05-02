import { Helmet } from 'react-helmet-async';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

const Services = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Data Annotation Services for African Dialects | nyansa</title>
        <meta name="description" content="Expert text, audio, and image annotation for low-resource African languages. High-fidelity data sourcing and curation for specialized AI models." />
        <meta property="og:title" content="Data Annotation Services for African Dialects | nyansa" />
        <meta property="og:description" content="Scaling AI for African markets with high-precision annotation services." />
      </Helmet>

      <div style={{ marginTop: '5rem' }}>
        <header className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(31, 122, 99, 0.1)', padding: '0.5rem 1.5rem', borderRadius: '9999px', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('services.header.badge')}</span>
          </div>
          <h1 style={{ fontSize: '3.75rem', fontWeight: 900, maxWidth: '900px', margin: '0 auto 2rem', lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--color-on-surface)' }}>
            {t('services.header.title')}
          </h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.625, color: 'var(--color-on-surface-variant)' }}>
            {t('services.header.desc')}
          </p>
        </header>

        {/* Text Annotation */}
        <section style={{ backgroundColor: '#fff', padding: '6rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="flex items-center gap-8" style={{ marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>translate</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('services.text.title')}</h2>
              </div>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.625, color: 'var(--color-on-surface-variant)', marginBottom: '2rem' }}>
                {t('services.text.desc')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'block', letterSpacing: '0.1em' }}>{t('services.text.entity')}</span>
                  <div style={{ backgroundColor: 'rgba(31, 122, 99, 0.05)', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    <Trans
                      i18nKey="services.text.entity_example"
                      components={[
                        <span key="0" style={{ backgroundColor: 'rgba(31, 122, 99, 0.2)', padding: '0 0.25rem', borderRadius: '0.25rem' }} />,
                        <span key="1" style={{ backgroundColor: 'rgba(133, 64, 54, 0.2)', padding: '0 0.25rem', borderRadius: '0.25rem' }} />,
                        <span key="2" style={{ backgroundColor: 'rgba(0, 109, 55, 0.2)', padding: '0 0.25rem', borderRadius: '0.25rem' }} />
                      ]}
                    />
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'block', letterSpacing: '0.1em' }}>{t('services.text.translation')}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Swahili (Input)</span>
                      <p style={{ fontStyle: 'italic' }}>Magonjwa ya mimea...</p>
                    </div>
                    <span className="material-symbols-outlined" style={{ color: '#64748b' }}>arrow_forward</span>
                    <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>English (Output)</span>
                      <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Plant pathology...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1EcJUtshP5vmeha6wPYInuAIYYFjME-Ysy6Of2kfYFJfvfigGc9g60Fki8FOojjGZn57dq3PhGFMXSrwNHm0uG4UfMu0E6ZgoWrRkFhl-nbqwJM1UOuiB8nK5XwW3P6a4gD9lON6S7dt8_Wtxam-aWxh7pDTmc90rmmrSH8wWpGPeOwlmjIv04BzPDrjdyU41Ay4ac0y6dBdTKSFlFBD1dGYCtNEVRJtsH5GZmauqf2vHP9SoPT2NZMlfh23W2GwnCEi-QyG4WcRg" alt="Field data" style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
              <div style={{ position: 'absolute', bottom: '-1.5rem', left: '-1.5rem', backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid var(--color-border)', maxWidth: '280px' }}>
                <div className="flex items-center gap-8" style={{ marginBottom: '1rem' }}>
                  <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Accuracy Matrix</span>
                </div>
                <div style={{ width: '100%', height: '0.5rem', backgroundColor: 'var(--color-surface)', borderRadius: '999px', marginBottom: '0.5rem' }}>
                  <div style={{ width: '98%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '999px' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--color-on-surface-variant)' }}>{t('services.text.accuracy')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Annotation */}
        <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0' }}>
          <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#002018', color: '#fff', padding: '2.5rem', borderRadius: '1.5rem', height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: '#82d6bb', letterSpacing: '0.2em' }}>{t('services.audio.stream')}</span>
                <span className="material-symbols-outlined" style={{ color: '#6bfe9c' }}>equalizer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem', height: '8rem' }}>
                {[20, 40, 80, 100, 60, 40, 90, 10, 45, 70].map((h, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: i % 4 === 0 ? '#6bfe9c' : '#82d6bb', height: `${h}%`, borderRadius: '999px', opacity: 0.8 }}></div>
                ))}
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 300, fontStyle: 'italic', marginBottom: '0.75rem', color: '#eef2ee' }}>"The rains have come late this year, affecting the maize flowering stage..."</p>
                <div className="flex gap-8">
                  <span style={{ backgroundColor: '#6bfe9c', color: '#00210c', fontSize: '0.625rem', padding: '0.125rem 0.5rem', borderRadius: '999px', fontWeight: 800, textTransform: 'uppercase' }}>Language: Zulu</span>
                  <span style={{ backgroundColor: '#82d6bb', color: '#002018', fontSize: '0.625rem', padding: '0.125rem 0.5rem', borderRadius: '999px', fontWeight: 800, textTransform: 'uppercase' }}>Topic: Climate</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-8" style={{ marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>mic</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('services.audio.title')}</h2>
              </div>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.625, color: 'var(--color-on-surface-variant)', marginBottom: '2rem' }}>
                {t('services.audio.desc')}
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  t('services.audio.f1'),
                  t('services.audio.f2'),
                  t('services.audio.f3')
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-8">
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '1.5rem' }}>check_circle</span>
                    <span style={{ fontSize: '1rem', color: 'var(--color-on-surface-variant)' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Image Annotation */}
        <section style={{ backgroundColor: '#fff', padding: '6rem 0' }}>
          <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="flex items-center gap-8" style={{ marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>filter_center_focus</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('services.image.title')}</h2>
              </div>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.625, color: 'var(--color-on-surface-variant)', marginBottom: '2rem' }}>
                {t('services.image.desc')}
              </p>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>rectangle</span>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t('services.image.box')}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('services.image.box_desc')}</p>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>polyline</span>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t('services.image.seg')}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('services.image.seg_desc')}</p>
                </div>
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', border: '4px solid #fff' }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzqMppYg1fjhxxqM8FIxc6bZeyxfRyc3PgqvlgWz3P2EFJagYweT5btWb1J6G1SpgXn9diYFMGRBspn96WUKb19zcY0o58URy9gMvmXB0uQ0YI3NKIkSIg1YSdzHoBU3bTEoYLMlYayNbJ9ukikI5SwXvLXsSIiQbAh9Wf5_np5y6Hv5iEAcm5xpcAlEjIzz1x4vR6h-spNOCxGXgywuZxPGabDgDxAjjgXacAm2hGOTzEk_pu5zNAFaSf-9HKn2mhqovsk_VQ0452" alt="Leaf pathology" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
              {/* Overlays */}
              <div style={{ position: 'absolute', top: '25%', left: '25%', width: '120px', height: '120px', border: '2px solid var(--color-primary-container)', backgroundColor: 'rgba(31, 122, 99, 0.2)', borderRadius: '0.5rem', pointerEvents: 'none' }}>
                <span style={{ position: 'absolute', top: '-1.5rem', left: 0, backgroundColor: 'var(--color-primary-container)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>Pest: Aphid</span>
              </div>
              <div style={{ position: 'absolute', bottom: '33%', right: '25%', width: '160px', height: '90px', border: '2px solid var(--color-tertiary-container)', backgroundColor: 'rgba(163, 87, 76, 0.2)', borderRadius: '0.5rem', pointerEvents: 'none' }}>
                <span style={{ position: 'absolute', top: '-1.5rem', left: 0, backgroundColor: 'var(--color-tertiary-container)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>Condition: Chlorosis</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section style={{ backgroundColor: 'var(--color-on-surface)', color: '#fff', padding: '8rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1rem' }}>{t('services.pipeline.title')}</h2>
              <p style={{ color: 'var(--color-outline-variant)', maxWidth: '600px', margin: '0 auto' }}>{t('services.pipeline.desc')}</p>
            </div>
            <div className="pipeline-grid">
              <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-tertiary))', opacity: 0.2, transform: 'translateY(-50%)', zIndex: 1 }} className="hidden md:block"></div>
              {[
                { icon: 'cloud_download', title: t('services.pipeline.s1_t'), desc: t('services.pipeline.s1_d'), color: 'var(--color-primary)' },
                { icon: 'edit_note', title: t('services.pipeline.s2_t'), desc: t('services.pipeline.s2_d'), color: 'var(--color-secondary)' },
                { icon: 'verified', title: t('services.pipeline.s3_t'), desc: t('services.pipeline.s3_d'), color: 'var(--color-tertiary)' },
                { icon: 'local_shipping', title: t('services.pipeline.s4_t'), desc: t('services.pipeline.s4_d'), color: 'var(--color-primary-container)' }
              ].map((step, i) => (
                <div key={i} className="pipeline-step" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ width: '3rem', height: '3rem', backgroundColor: step.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}>
                    <span className="material-symbols-outlined" style={{ color: i === 3 ? 'var(--color-on-primary-container)' : '#fff' }}>{step.icon}</span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-outline-variant)' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: 'var(--color-primary-container)', color: '#fff', padding: '6rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '2.5rem', opacity: '-0.025em' }}>{t('services.cta.title')}</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/contact"><button className="btn-primary" style={{ backgroundColor: '#fff', color: 'var(--color-primary)', padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>{t('services.cta.btn1')}</button></Link>
              <Link to="/datasets"><button className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '0.75rem', background: 'none', cursor: 'pointer' }}>{t('services.cta.btn2')}</button></Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;
