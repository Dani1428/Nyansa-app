import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="container grid hero-grid">
        <div>
          <h1 className="hero-title">
            {t('home.hero.title_main')}<br/>
            <span style={{ color: 'var(--color-primary)' }}>{t('home.hero.title_highlight')}</span>
          </h1>
          <p className="hero-desc">
            {t('home.hero.desc')}
          </p>
          <div className="hero-actions">
            <Link to="/contact">
              <button className="btn-primary">{t('nav.get_quote')}</button>
            </Link>
            <Link to="/datasets">
              <button className="btn-outline">{t('home.hero.view_datasets')}</button>
            </Link>
          </div>
        </div>
        
        <div className="hero-image-wrapper">
          <div className="hero-image-blur-bg"></div>
          <div className="hero-image-inner">
            <img 
              className="hero-image" 
              alt="African farmer" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd_HigH7O7bLEBqh_YASsdS3SeVGfBbO65YynU8C4QcHge1kyzWelw9mcrh9hSEotMfyffHG63mPDRbem94kdWGgs89EqBAJDPJjB9vWHfxMBhftAa4ij7p-z9ItvbyJVEazZz-MASFkItfsO6w2eDRpeu3_HADLsBygv_tfm05NorXuz-2N4KjEcitVkGeNDpHTzolnp6OnuiK8jr-_G2wCMSv-nCzRu6HYehGLseRGYpOChOrXT-FMA0fqIglwgCMQ7xTCHPJyHN" 
            />
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{t('home.hero.live_badge').toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
