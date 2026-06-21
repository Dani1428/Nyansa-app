import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: t('contact.form.projectTypes', { returnObjects: true })[0] as string,
    message: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://localhost:8000/api/v1/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          company: formData.company,
          project_type: formData.projectType,
          message: formData.message
        }),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: t('contact.form.success') });
        setFormData({ name: '', email: '', company: '', projectType: t('contact.form.projectTypes', { returnObjects: true })[0] as string, message: '' });
      } else {
        setStatus({ type: 'error', message: t('contact.form.error') });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatus({ type: 'error', message: t('contact.form.server_error') });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('nav.contact')} | nyansa</title>
        <meta name="description" content="Get in touch with AgriLingua AI for custom dataset curation and AI consulting." />
      </Helmet>

      <div style={{ marginTop: '5rem' }}>
        {/* Hero Header */}
        <header className="contact-hero">
          <div className="container">
            <div className="contact-hero__badge">
              {t('contact.header.badge')}
            </div>
            <h1 className="contact-hero__title">
              {t('contact.header.title')}
            </h1>
            <p className="contact-hero__desc">
              {t('contact.header.desc')}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="contact-main">
          <div className="container">
            <div className="contact-layout">
              {/* Form Card */}
              <div className="contact-form-card">
                <div className="contact-form-card__header">
                  <div className="contact-form-card__icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>edit_note</span>
                  </div>
                  <h2 className="contact-form-card__title">{t('contact.form.title')}</h2>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  {/* Row 1: Name & Email */}
                  <div className="contact-form__row">
                    <div className="contact-field">
                      <label className="contact-field__label">
                        <span className="material-symbols-outlined contact-field__label-icon">person</span>
                        {t('contact.form.name')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="contact-field__input"
                      />
                    </div>
                    <div className="contact-field">
                      <label className="contact-field__label">
                        <span className="material-symbols-outlined contact-field__label-icon">mail</span>
                        {t('contact.form.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@company.com"
                        className="contact-field__input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Company & Project Type */}
                  <div className="contact-form__row">
                    <div className="contact-field">
                      <label className="contact-field__label">
                        <span className="material-symbols-outlined contact-field__label-icon">business</span>
                        {t('contact.form.company')}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="AgriTech Solutions"
                        className="contact-field__input"
                      />
                    </div>
                    <div className="contact-field">
                      <label className="contact-field__label">
                        <span className="material-symbols-outlined contact-field__label-icon">category</span>
                        {t('contact.form.type')}
                      </label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="contact-field__select"
                        >
                          {(t('contact.form.projectTypes', { returnObjects: true }) as string[]).map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="contact-field">
                    <label className="contact-field__label">
                      <span className="material-symbols-outlined contact-field__label-icon">chat_bubble</span>
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your objectives..."
                      rows={5}
                      className="contact-field__textarea"
                    ></textarea>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="contact-form__submit">
                    {t('contact.form.submit')}
                    <span className="material-symbols-outlined contact-form__submit-icon">arrow_forward</span>
                  </button>

                  {/* Status Message */}
                  {status.type && (
                    <div className={`contact-status contact-status--${status.type}`}>
                      <span className="material-symbols-outlined contact-status__icon">
                        {status.type === 'success' ? 'check_circle' : 'error'}
                      </span>
                      {status.message}
                    </div>
                  )}
                </form>
              </div>

              {/* Contact Info Sidebar */}
              <div className="contact-info">
                {/* WhatsApp CTA */}
                <div className="contact-info__cta">
                  <div className="contact-info__cta-content">
                    <div className="contact-info__cta-icon">
                      <span className="material-symbols-outlined">chat</span>
                    </div>
                    <div>
                      <h3 className="contact-info__cta-title">{t('contact.info.whatsapp')}</h3>
                      <p className="contact-info__cta-desc">{t('contact.info.whatsapp_d')}</p>
                    </div>
                  </div>
                  <button className="contact-info__cta-btn">Message</button>
                </div>

                {/* Email */}
                <div className="contact-info__card">
                  <div className="contact-info__card-icon">
                    <span className="material-symbols-outlined">alternate_email</span>
                  </div>
                  <div>
                    <h3 className="contact-info__card-title">{t('contact.info.email_t')}</h3>
                    <p className="contact-info__card-desc">hello@agrilingua-ai.com</p>
                  </div>
                </div>

                {/* Location */}
                <div className="contact-info__card">
                  <div className="contact-info__card-icon">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h3 className="contact-info__card-title">{t('contact.info.hq_t')}</h3>
                    <p className="contact-info__card-desc">{t('contact.info.hq_desc')}</p>
                  </div>
                </div>

                {/* Map Image */}
                <div className="contact-info__map">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnu2s3lMc6vd849rEHptJALfY2qJ4CaUXSkIlY5a2cAY_nom0tWdPCu0TRsvuUjWL-_JE0Ja0ryGBMbgLfk6QA6kveJOnKwj7ElpNUzUlGne9QJKEj8_nFu5bJ6skGi0qzaSfOV4fhQJrkhdezfzN4TEwlgcbqLNZXmt44pBvqPpiwjfF_gEV9SZ-YeEkStFVuAUUWen1pI0gSiNkEad-ol6UQrFK85O49OT_RLRikYdKiIt9lls7pmeXQll13e6Sax25OEtDICuC2"
                    alt="HQ"
                    className="contact-info__map-img"
                  />
                  <div className="contact-info__map-overlay"></div>
                  <div className="contact-info__map-content">
                    <span className="contact-info__map-badge">Office</span>
                    <h4 className="contact-info__map-title">{t('contact.info.hub_t')}</h4>
                    <p className="contact-info__map-desc">{t('contact.info.hub_d')}</p>
                  </div>
                  <div className="contact-info__map-action">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Contact;
