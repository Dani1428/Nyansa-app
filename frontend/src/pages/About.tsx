import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('nav.about')} | nyansa</title>
        <meta name="description" content="Our mission is to bridge the gap between agriculture and linguistics through high-quality AI data." />
      </Helmet>

      <div style={{ marginTop: '5rem' }}>
        <header className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center' }}>
          <h1 className="hero-title" style={{ maxWidth: '900px', margin: '0 auto 2rem' }}>
            {t('about.header.title')}
          </h1>
          <p className="hero-desc" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {t('about.header.desc')}
          </p>
        </header>

        <section style={{ backgroundColor: '#fff', padding: '8rem 0', borderTop: '1px solid var(--color-border)' }}>
          <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnu2s3lMc6vd849rEHptJALfY2qJ4CaUXSkIlY5a2cAY_nom0tWdPCu0TRsvuUjWL-_JE0Ja0ryGBMbgLfk6QA6kveJOnKwj7ElpNUzUlGne9QJKEj8_nFu5bJ6skGi0qzaSfOV4fhQJrkhdezfzN4TEwlgcbqLNZXmt44pBvqPpiwjfF_gEV9SZ-YeEkStFVuAUUWen1pI0gSiNkEad-ol6UQrFK85O49OT_RLRikYdKiIt9lls7pmeXQll13e6Sax25OEtDICuC2" alt="Our Office" style={{ width: '100%', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
              <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', backgroundColor: 'var(--color-primary)', color: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, display: 'block' }}>{t('about.ground_truth_val')}</span>
                <span className="text-xs font-bold uppercase tracking-widest">{t('about.ground_truth_lbl')}</span>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-4xl" style={{ marginBottom: '1.5rem' }}>{t('about.mission.title')}</h2>
                <p className="hero-desc">
                  {t('about.mission.desc')}
                </p>
              </div>
              <div>
                <h2 className="text-4xl" style={{ marginBottom: '1.5rem' }}>{t('about.vision.title')}</h2>
                <p className="hero-desc">
                  {t('about.vision.desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-surface)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>{t('about.stats.badge')}</h2>
            <h3 className="text-4xl" style={{ marginBottom: '4rem' }}>{t('about.stats.title')}</h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                { title: t('about.stats.s1_t'), value: t('about.stats.s1_v'), desc: t('about.stats.s1_d') },
                { title: t('about.stats.s2_t'), value: t('about.stats.s2_v'), desc: t('about.stats.s2_d') },
                { title: t('about.stats.s3_t'), value: t('about.stats.s3_v'), desc: t('about.stats.s3_d') }
              ].map((stat, i) => (
                <div key={i} style={{ padding: '2.5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>{stat.value}</span>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{stat.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
