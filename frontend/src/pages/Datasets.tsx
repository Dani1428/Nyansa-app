import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DatasetExplorer from '../components/DatasetExplorer';

interface Dataset {
  id: number;
  title: string;
  dataset_type: string;
  language: string;
  size_info: string;
  sector: string;
  icon: string;
}

const Datasets = () => {
  const { t } = useTranslation();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for initial UI dev
  const mockDatasets: Dataset[] = [
    { id: 1, title: 'East African Maize Pest Dialogue', dataset_type: 'Text Corpus', language: 'Swahili', size_info: '4.2M Tokens', sector: 'Crop Pathology', icon: 'article' },
    { id: 2, title: 'Amharic Agronomy Extension Speech', dataset_type: 'Audio', language: 'Amharic', size_info: '850 Hours', sector: 'Extension Services', icon: 'mic' },
    { id: 3, title: 'Cassava Disease Visual Catalog', dataset_type: 'Image + Metadata', language: 'Multilingual', size_info: '12k Images', sector: 'Root Crops', icon: 'photo_library' },
    { id: 4, title: 'Hausa Soil Fertility Transactions', dataset_type: 'Text Corpus', language: 'Hausa', size_info: '1.8M Tokens', sector: 'Soil Nutrition', icon: 'history_edu' }
  ];

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/datasets/')
      .then(res => res.json())
      .then(data => {
        // Handle DRF pagination results
        const datasetList = data.results || (Array.isArray(data) ? data : []);
        
        if (datasetList.length > 0) {
          setDatasets(datasetList);
        } else {
          setDatasets(mockDatasets);
        }
        setLoading(false);
      })
      .catch(() => {
        setDatasets(mockDatasets);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>African Linguistic & Agricultural Dataset Catalog | nyansa</title>
        <meta name="description" content="Browse curated datasets for African languages (Swahili, Wolof, Akan, etc.) and crop health monitoring. Ready-to-use ground truth for precision AI training." />
        <meta property="og:title" content="African Linguistic & Agricultural Dataset Catalog | nyansa" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "Dataset",
              "name": "Nyansa African Agricultural & Linguistic Datasets",
              "description": "Curated high-precision datasets for African languages (Swahili, Wolof, etc.) and crop pathology monitoring.",
              "url": "https://nyansa.ai/datasets",
              "keywords": ["AI", "Africa", "Agriculture", "NLP", "Swahili", "Computer Vision"],
              "license": "https://nyansa.ai/license",
              "isAccessibleForFree": false,
              "creator": {
                "@type": "Organization",
                "name": "Nyansa AI"
              }
            }
          `}
        </script>
      </Helmet>

      <div style={{ marginTop: '5rem' }}>
        <header style={{ 
          background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-container-low) 100%)', 
          padding: '8rem 0 6rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(31, 122, 99, 0.1)', padding: '0.5rem 1.5rem', borderRadius: '9999px', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('datasets.badge') || 'Data Intelligence'}</span>
            </div>
            <h1 style={{ fontSize: '3.75rem', fontWeight: 900, maxWidth: '900px', margin: '0 auto 1.5rem', lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--color-on-surface)' }}>
              {t('datasets.title')}
            </h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.625, color: 'var(--color-on-surface-variant)' }}>
              {t('datasets.desc')}
            </p>
          </div>
        </header>

        <main>
          {/* Section: Interactive Preview */}
          <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-surface)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '1rem' }}>
                  Aperçu Interactif des Datasets
                </h2>
                <div style={{ width: '4rem', height: '4px', backgroundColor: 'var(--color-primary)', margin: '0 auto', borderRadius: '2px' }}></div>
                <p style={{ marginTop: '1.5rem', color: 'var(--color-on-surface-variant)', fontSize: '1.125rem' }}>
                  Testez nos capacités d'annotation et de vision par ordinateur en temps réel.
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: 'var(--color-white)', 
                borderRadius: '2rem', 
                padding: '2rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                border: '1px solid var(--color-border)'
              }}>
                <DatasetExplorer />
              </div>
            </div>
          </section>

          {/* Section: Catalog */}
          <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '1rem' }}>
                  Catalogue de Datasets
                </h2>
                <div style={{ width: '4rem', height: '4px', backgroundColor: 'var(--color-primary)', margin: '0 auto', borderRadius: '2px' }}></div>
              </div>

              <div className="catalog-layout">
                {/* Sidebar Filters */}
                <aside className="sidebar">
                  <div style={{ 
                    position: 'sticky', 
                    top: '7rem', 
                    backgroundColor: 'var(--color-white)', 
                    padding: '2rem', 
                    borderRadius: '1.5rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                  }}>
                    <div className="filter-group">
                      <h3 className="filter-title">{t('datasets.filters.lang')}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['Swahili', 'Amharic', 'Hausa', 'Wolof', 'Akan', 'Dioula'].map(lang => (
                          <label key={lang} className="filter-option">
                            <input type="checkbox" defaultChecked={true} />
                            <span>{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="filter-group">
                      <h3 className="filter-title">{t('datasets.filters.type')}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['Text Corpus', 'Audio', 'Image', 'Tabular'].map(type => (
                          <label key={type} className="filter-option">
                            <input type="checkbox" defaultChecked={true} />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Grid */}
                <div style={{ flexGrow: 1 }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-on-surface-variant)' }}>
                      <div className="pulse-dot" style={{ margin: '0 auto 1rem' }}></div>
                      {t('datasets.loading')}
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {datasets.map(ds => (
                          <div key={ds.id} className="dataset-card" style={{ 
                            padding: '2rem', 
                            borderRadius: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                          }}>
                            <div className="flex justify-between items-start" style={{ marginBottom: '1.5rem' }}>
                              <span style={{ 
                                backgroundColor: ds.dataset_type.includes('Audio') ? 'rgba(163, 87, 76, 0.1)' : 'rgba(31, 122, 99, 0.1)', 
                                color: ds.dataset_type.includes('Audio') ? 'var(--color-tertiary)' : 'var(--color-primary)', 
                                fontSize: '0.7rem', fontWeight: 800, padding: '0.4rem 1rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' 
                              }}>
                                {ds.dataset_type}
                              </span>
                              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '1.75rem', opacity: 0.3 }}>{ds.icon || 'database'}</span>
                            </div>
                            
                            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-on-surface)', lineHeight: 1.3 }}>{ds.title}</h2>
                            
                            <div style={{ marginBottom: '2rem', color: 'var(--color-on-surface-variant)', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>language</span>
                                <span style={{ fontWeight: 500 }}>{ds.language}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{ds.dataset_type.includes('Audio') ? 'schedule' : 'database'}</span>
                                <span style={{ fontWeight: 500 }}>{ds.size_info}</span>
                              </div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-outline-variant)', fontWeight: 700, marginBottom: '0.25rem' }}>Sector</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>{ds.sector}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-outline" style={{ height: '2.5rem', padding: '0 1rem', fontSize: '0.75rem', borderRadius: '0.75rem' }}>Sample</button>
                                <Link to="/contact">
                                  <button className="btn-primary" style={{ height: '2.5rem', padding: '0 1rem', fontSize: '0.75rem', borderRadius: '0.75rem' }}>{t('datasets.card.request')}</button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Banner */}
                      <div className="dataset-banner" style={{ marginTop: '4rem', height: '16rem' }}>
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWyBdJ_bNMn_ezo1bu32GcavTPXfO5kFwZeCHJjy9Qv0kSEc4Scfgihubwvo0xUtDY2sIx3cKcUSX4eZWD5V1QL_PXQ_pj3AB3Rc3Yrk6xN4HGAqQhri2l8p_st4eIH8g3dYSXLuG-CFz1zZGETk8QfDSGFKxTCqA_VKWB8MMhvAqM7fdfSRiuImdJra8ifRqAav0ja82RtSOddOZ-aAnYCIKQYp85nEj68x3iqjuIHMR0aCRfW8JHbAv2Tlu15T6AuRVVUmq0dLF6" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Banner" />
                        <div className="dataset-banner-overlay" style={{ background: 'linear-gradient(to right, rgba(0, 96, 76, 0.95), rgba(0, 96, 76, 0.4))' }}>
                          <h4 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>{t('datasets.banner.title')}</h4>
                          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.5 }}>{t('datasets.banner.desc')}</p>
                          <Link to="/contact"><button className="btn-primary" style={{ backgroundColor: '#fff', color: 'var(--color-primary)', fontWeight: 800 }}>{t('datasets.banner.btn')}</button></Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Datasets;
