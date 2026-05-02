import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/LOGOIA2.png';

const Header = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center" style={{ height: '100%' }}>
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="nyansa Logo" style={{ height: '75px', objectFit: 'contain' }} />
        </Link>
        <div className="nav-links">
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>{t('nav.services')}</Link>
          <Link to="/datasets" className={`nav-link ${location.pathname === '/datasets' ? 'active' : ''}`}>{t('nav.datasets')}</Link>
          <Link to="/languages" className={`nav-link ${location.pathname === '/languages' ? 'active' : ''}`}>{t('nav.languages')}</Link>
          <Link to="/agriculture" className={`nav-link ${location.pathname === '/agriculture' ? 'active' : ''}`}>{t('nav.agriculture')}</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>{t('nav.about')}</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>{t('nav.contact')}</Link>
        </div>
        <div className="flex items-center gap-16">
          <button 
            onClick={toggleLanguage}
            style={{ 
              background: 'none', 
              border: '1px solid var(--color-border)', 
              borderRadius: '0.5rem', 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              color: 'var(--color-primary)'
            }}
          >
            {i18n.language.toUpperCase().split('-')[0]}
          </button>
          <Link to="/contact">
            <button className="btn-primary" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-white)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>{t('nav.get_quote')}</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
