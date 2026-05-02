import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DatasetExplorer.css';

const DatasetExplorer = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'audio' | 'vision'>('vision');
  const [showAI, setShowAI] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="dataset-explorer-section">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interactive Demo
          </div>
          <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-on-surface)' }}>
            {t('datasets.explorer.title')}
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-on-surface-variant)', maxWidth: '42rem', margin: '0 auto' }}>
            {t('datasets.explorer.desc')}
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button 
            className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
            onClick={() => setActiveTab('vision')}
          >
            <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>filter_center_focus</span>
            {t('datasets.explorer.tabs.vision')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>graphic_eq</span>
            {t('datasets.explorer.tabs.audio')}
          </button>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          {activeTab === 'vision' && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0 }}>
              <div style={{ position: 'relative', backgroundColor: '#000', minHeight: '400px' }}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzqMppYg1fjhxxqM8FIxc6bZeyxfRyc3PgqvlgWz3P2EFJagYweT5btWb1J6G1SpgXn9diYFMGRBspn96WUKb19zcY0o58URy9gMvmXB0uQ0YI3NKIkSIg1YSdzHoBU3bTEoYLMlYayNbJ9ukikI5SwXvLXsSIiQbAh9Wf5_np5y6Hv5iEAcm5xpcAlEjIzz1x4vR6h-spNOCxGXgywuZxPGabDgDxAjjgXacAm2hGOTzEk_pu5zNAFaSf-9HKn2mhqovsk_VQ0452" 
                  alt="Crop Disease"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {showAI && (
                  <>
                    <div className="ai-box pulse-border" style={{ position: 'absolute', top: '25%', left: '25%', width: '120px', height: '120px', border: '2px solid var(--color-primary)', backgroundColor: 'rgba(31, 122, 99, 0.2)', borderRadius: '0.5rem', transition: 'all 0.5s' }}>
                      <div style={{ position: 'absolute', top: '-1.5rem', left: 0, backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                        Pest: Aphid (98%)
                      </div>
                    </div>
                    <div className="ai-box pulse-border-error" style={{ position: 'absolute', bottom: '33%', right: '25%', width: '160px', height: '90px', border: '2px solid #BA1A1A', backgroundColor: 'rgba(186, 26, 26, 0.2)', borderRadius: '0.5rem', transition: 'all 0.5s', animationDelay: '0.1s' }}>
                      <div style={{ position: 'absolute', top: '-1.5rem', left: 0, backgroundColor: '#BA1A1A', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                        Disease: Black Pod (92%)
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--color-surface-container)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-on-surface)' }}>Data Metadata</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>eco</span>
                    <span style={{ fontWeight: 500 }}>{t('datasets.explorer.vision_panel.crop')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#BA1A1A' }}>coronavirus</span>
                    <span style={{ fontWeight: 500, color: '#BA1A1A' }}>{t('datasets.explorer.vision_panel.disease')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowAI(!showAI)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, transition: 'all 0.3s', cursor: 'pointer',
                    backgroundColor: showAI ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: showAI ? '#fff' : 'var(--color-primary)',
                    border: `2px solid var(--color-primary)`,
                    boxShadow: showAI ? '0 10px 15px -3px rgba(31, 122, 99, 0.3)' : 'none'
                  }}
                >
                  <span className="material-symbols-outlined">
                    {showAI ? 'visibility_off' : 'visibility'}
                  </span>
                  {t('datasets.explorer.vision_panel.toggle_ai')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div style={{ padding: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                
                <div style={{ flex: 1, backgroundColor: 'var(--color-surface-container-high)', borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <audio 
                    ref={audioRef} 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Sw-Habari.ogg" 
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '8rem', height: '8rem', backgroundColor: 'rgba(31, 122, 99, 0.1)', borderRadius: '50%', filter: 'blur(40px)', marginRight: '-2.5rem', marginTop: '-2.5rem' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', backgroundColor: 'rgba(31, 122, 99, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{t('datasets.explorer.audio_panel.lang')}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-secondary)', backgroundColor: 'rgba(85, 122, 102, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{t('datasets.explorer.audio_panel.topic')}</span>
                  </div>

                  <div style={{ height: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                    {[...Array(40)].map((_, i) => (
                      <div 
                        key={i} 
                        className={isPlaying ? 'audio-bar-anim' : ''}
                        style={{ 
                          width: '6px',
                          borderRadius: '9999px',
                          transition: 'all 0.15s',
                          backgroundColor: isPlaying ? 'var(--color-primary)' : 'var(--color-outline-variant)',
                          height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '8px',
                          animationDelay: `${i * 0.05}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                    <button 
                      onClick={togglePlay}
                      style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', transition: 'transform 0.2s', boxShadow: '0 10px 15px -3px rgba(31, 122, 99, 0.3)' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-outline-variant)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>record_voice_over</span>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-outline)' }}>{t('datasets.explorer.audio_panel.transcript')}</h4>
                    </div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-on-surface)', fontStyle: 'italic' }}>
                      "{t('datasets.explorer.audio_panel.transcript_text')}"
                    </p>
                  </div>
                  
                  <div style={{ backgroundColor: 'rgba(31, 122, 99, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(31, 122, 99, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>translate</span>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>{t('datasets.explorer.audio_panel.translation')}</h4>
                    </div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {t('datasets.explorer.audio_panel.translation_text')}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DatasetExplorer;
