import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import founderImg from '../assets/founder.png';
import aboutMissionImg from '../assets/about_mission.png';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('nav.about')} | nyansa</title>
        <meta name="description" content="Our mission is to bridge the gap between agriculture and linguistics through high-quality AI data." />
      </Helmet>

      <div style={{ marginTop: '5rem' }}>
        {/* Hero Header Section */}
        <header className="about-hero">
          <div className="about-hero__orb about-hero__orb--1"></div>
          <div className="about-hero__orb about-hero__orb--2"></div>
          <div className="container">
            <div className="about-hero__badge">
              <span className="about-hero__badge-dot"></span>
              {t('nav.about')}
            </div>
            <h1 className="about-hero__title">
              {t('about.header.title')}
            </h1>
            <p className="about-hero__desc">
              {t('about.header.desc')}
            </p>
          </div>
        </header>

        {/* Mission & Vision — Bento Layout */}
        <section className="about-mv">
          <div className="container">
            <div className="about-mv__grid">
              {/* Image block spanning full height */}
              <div className="about-mv__image-block">
                <img
                  src={aboutMissionImg}
                  alt={t('about.mission.img_alt')}
                  className="about-mv__image"
                />
                <div className="about-mv__image-overlay"></div>
                <div className="about-mv__image-stat">
                  <span className="about-mv__image-stat-val">{t('about.ground_truth_val')}</span>
                  <span className="about-mv__image-stat-lbl">{t('about.ground_truth_lbl')}</span>
                </div>
              </div>

              {/* Mission Card */}
              <div className="about-mv__card about-mv__card--mission">
                <div className="about-mv__card-header">
                  <div className="about-mv__card-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>track_changes</span>
                  </div>
                  <h2 className="about-mv__card-title">{t('about.mission.title')}</h2>
                </div>
                <p className="about-mv__card-desc">
                  {t('about.mission.desc')}
                </p>
              </div>

              {/* Vision Card */}
              <div className="about-mv__card about-mv__card--vision">
                <div className="about-mv__card-header">
                  <div className="about-mv__card-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>visibility</span>
                  </div>
                  <h2 className="about-mv__card-title">{t('about.vision.title')}</h2>
                </div>
                <p className="about-mv__card-desc">
                  {t('about.vision.desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder & CEO — Glassmorphism Quote Card */}
        <section className="about-founder">
          <div className="container">
            <div className="about-founder__inner">
              <div className="about-founder__card">
                <div className="about-founder__avatar-wrap">
                  <div className="about-founder__avatar-ring">
                    <img
                      src={founderImg}
                      alt="GOHI BI ZAH DANIEL | Fondateur & PDG"
                      className="about-founder__avatar"
                    />
                  </div>
                  <div>
                    <p className="about-founder__name">GOHI BI ZAH DANIEL</p>
                    <span className="about-founder__role">{t('about.founder.role')}</span>
                  </div>
                </div>

                <div className="about-founder__quote-wrap">
                  <span className="about-founder__quote-icon">"</span>
                  <blockquote style={{ margin: 0, padding: 0, border: 'none' }}>
                    <p className="about-founder__quote-text">
                      {t('about.founder.mention')}
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-stats">
          <div className="container">
            <div className="about-stats__header">
              <div className="about-stats__badge">
                {t('about.stats.badge')}
              </div>
              <h2 className="about-stats__title">{t('about.stats.title')}</h2>
            </div>

            <div className="about-stats__grid">
              {[
                { title: t('about.stats.s1_t'), value: t('about.stats.s1_v'), desc: t('about.stats.s1_d'), icon: 'analytics' },
                { title: t('about.stats.s2_t'), value: t('about.stats.s2_v'), desc: t('about.stats.s2_d'), icon: 'translate' },
                { title: t('about.stats.s3_t'), value: t('about.stats.s3_v'), desc: t('about.stats.s3_d'), icon: 'groups' }
              ].map((stat, i) => (
                <div key={i} className="about-stats__card">
                  <div className="about-stats__card-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stat.icon}</span>
                  </div>
                  <span className="about-stats__card-value">{stat.value}</span>
                  <h4 className="about-stats__card-title">{stat.title}</h4>
                  <p className="about-stats__card-desc">{stat.desc}</p>
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
