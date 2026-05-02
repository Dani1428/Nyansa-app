import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  id: number;
  name: string;
}

interface Mission {
  id: number;
  title: string;
  description: string;
  task_type: 'audio' | 'image' | 'text';
  language_name: string;
  language_id: number;
  dialect_id?: number;
  prompt_id?: number;
  reward_per_entry: number;
  target_count: number;
  is_active: boolean;
  completion_count?: number;
}

interface Dialect {
  id: number;
  name: string;
  language: number;
}

interface Prompt {
  id: number;
  text_fr: string;
  category: string;
}

const MissionsManagement = () => {
  const { t } = useTranslation();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [dialects, setDialects] = useState<Dialect[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const [generateData, setGenerateData] = useState({
    category: 'agriculture',
    difficulty: '1',
    count: '10',
    create_tasks: true,
    language_id: '',
    reward: '50'
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'audio',
    language: '',
    dialect: '',
    prompt: '',
    reward_per_entry: '50',
    target_count: '100',
    is_active: true
  });

  const handleTypeChange = (type: string) => {
    let reward = formData.reward_per_entry;
    if (!isEditing) {
      if (type === 'audio') reward = '50';
      else if (type === 'image') reward = '30';
      else if (type === 'text') reward = '20';
    }
    setFormData({ ...formData, task_type: type as any, reward_per_entry: reward });
  };

  const fetchMissions = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/tasks/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMissions(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching missions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLanguages = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/languages/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLanguages(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  };

  const fetchDialects = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/dialects/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDialects(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching dialects:', err);
    }
  };

  const fetchPrompts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/prompts/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrompts(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching prompts:', err);
    }
  };

  const handleGeneratePrompts = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/v1/prompts/generate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: generateData.category,
          difficulty: parseInt(generateData.difficulty),
          count: parseInt(generateData.count),
          create_tasks: generateData.create_tasks,
          language_id: generateData.language_id || null,
          reward: parseFloat(generateData.reward)
        })
      });

      if (response.ok) {
        setIsGenerateModalOpen(false);
        fetchPrompts();
        fetchMissions();
        alert('Prompts et Missions générés avec succès !');
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
    }
  };

  useEffect(() => {
    fetchMissions();
    fetchLanguages();
    fetchDialects();
    fetchPrompts();
  }, []);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = isEditing ? 'PATCH' : 'POST';
    const url = isEditing ? `/api/v1/tasks/${currentId}/` : '/api/v1/tasks/';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          reward_per_entry: parseFloat(formData.reward_per_entry),
          target_count: parseInt(formData.target_count),
          language: formData.language || null,
          dialect: formData.dialect || null,
          prompt: formData.prompt || null
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchMissions();
      }
    } catch (error) {
      console.error('Error saving mission:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentId) return;
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible.')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/v1/tasks/${currentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchMissions();
      }
    } catch (error) {
      console.error('Error deleting mission:', error);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      task_type: 'audio',
      language: '',
      dialect: '',
      prompt: '',
      reward_per_entry: '50',
      target_count: '100',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mission: Mission) => {
    setIsEditing(true);
    setCurrentId(mission.id);
    setFormData({
      title: mission.title,
      description: mission.description,
      task_type: mission.task_type,
      language: mission.language_id?.toString() || '',
      dialect: mission.dialect_id?.toString() || '',
      prompt: mission.prompt_id?.toString() || '',
      reward_per_entry: mission.reward_per_entry.toString(),
      target_count: mission.target_count.toString(),
      is_active: mission.is_active
    });
    setIsModalOpen(true);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.missions.title')}</h1>
          <p className="admin-page-desc">{t('admin.missions.desc')}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setIsGenerateModalOpen(true)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.625rem', 
              height: '3rem',
              padding: '0 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #1F7A63 0%, #6BFE9C 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(31, 122, 99, 0.25)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(31, 122, 99, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 122, 99, 0.25)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', animation: 'sparkle 2s infinite' }}>auto_awesome</span>
            Générer Prompts IA
          </button>
          <button className="btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '3rem' }}>
            <span className="material-symbols-outlined">add_task</span>
            Nouvelle Mission
          </button>
        </div>
      </div>

      {!isLoading && missions.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', backgroundColor: 'var(--color-surface)', borderRadius: '1rem', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
          <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', backgroundColor: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--color-on-surface-variant)' }}>explore_off</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Aucune mission active</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '400px', marginBottom: '2rem' }}>
            Vous n'avez pas encore créé de mission pour les agents de terrain. Les missions créées apparaîtront ici et sur l'application mobile.
          </p>
          <button className="btn-primary" onClick={openAddModal} style={{ height: '3rem' }}>
            Créer ma première mission
          </button>
        </div>
      ) : (
        <div className="admin-grid admin-grid-cols-3">
          {missions.map((mission) => (
            <div key={mission.id} className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '3rem', height: '3rem', borderRadius: '0.75rem', 
                  backgroundColor: mission.task_type === 'audio' ? 'rgba(31, 122, 99, 0.1)' : mission.task_type === 'image' ? 'rgba(107, 254, 156, 0.2)' : 'rgba(133, 64, 54, 0.1)',
                  color: mission.task_type === 'audio' ? 'var(--color-primary)' : mission.task_type === 'image' ? 'var(--color-secondary)' : 'var(--color-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <span className="material-symbols-outlined">
                    {mission.task_type === 'audio' ? 'mic' : mission.task_type === 'image' ? 'photo_camera' : 'edit_note'}
                  </span>
                </div>
                <span className={`admin-badge ${mission.is_active ? 'approved' : ''}`} style={{ backgroundColor: mission.is_active ? 'var(--color-secondary-container)' : 'var(--color-surface-container-high)' }}>
                  {mission.is_active ? 'Active' : 'Paused'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>{mission.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
                {mission.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-on-surface-variant)' }}>Récompense:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{mission.reward_per_entry} FCFA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-on-surface-variant)' }}>Langue:</span>
                  <span style={{ fontWeight: 600 }}>{mission.language_name || 'Toutes'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-on-surface-variant)' }}>Progression:</span>
                  <span style={{ fontWeight: 600 }}>{mission.completion_count || 0} / {mission.target_count}</span>
                </div>
                <div style={{ width: '100%', height: '0.5rem', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '1rem', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min(100, ((mission.completion_count || 0) / mission.target_count) * 100)}%`, 
                    height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.5s ease' 
                  }}></div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => openEditModal(mission)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  Gérer <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>settings</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '550px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{isEditing ? 'Modifier la Mission' : 'Nouvelle Mission Terrain'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Titre de la Mission *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }} placeholder="ex: Collecte de voix en Bambara" />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Type</label>
                  <select value={formData.task_type} onChange={e => handleTypeChange(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }}>
                    <option value="audio">Audio Collection</option>
                    <option value="image">Image Collection</option>
                    <option value="text">Text Entry</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Langue</label>
                  <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value, dialect: ''})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }}>
                    <option value="">Toutes les langues</option>
                    {languages.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Dialecte (Optionnel)</label>
                  <select 
                    value={formData.dialect} 
                    onChange={e => setFormData({...formData, dialect: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }}
                    disabled={!formData.language}
                  >
                    <option value="">Tous les dialectes</option>
                    {dialects.filter(d => d.language.toString() === formData.language).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Phrase / Prompt (Audio)</label>
                  <select 
                    value={formData.prompt} 
                    onChange={e => {
                      const selectedPrompt = prompts.find(p => p.id.toString() === e.target.value);
                      setFormData({
                        ...formData, 
                        prompt: e.target.value,
                        title: selectedPrompt ? `Traduction : ${selectedPrompt.text_fr}` : formData.title
                      })
                    }} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }}
                    disabled={formData.task_type !== 'audio'}
                  >
                    <option value="">Sélectionner une phrase</option>
                    {prompts.map(p => (
                      <option key={p.id} value={p.id}>{p.text_fr.substring(0, 40)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Récompense (FCFA) *</label>
                  <input required type="number" value={formData.reward_per_entry} onChange={e => setFormData({...formData, reward_per_entry: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Objectif (Nb entrées) *</label>
                  <input required type="number" value={formData.target_count} onChange={e => setFormData({...formData, target_count: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Consignes pour l'agent</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', resize: 'none' }} placeholder="Décrivez ce que l'agent doit faire précisément..." />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--color-surface-container-low)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }} 
                />
                <label htmlFor="is_active" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  Disponible pour les agents (Mission Active)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                {isEditing ? (
                  <button type="button" onClick={handleDelete} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 600, color: 'var(--color-error)', border: '1px solid var(--color-error)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delete</span>
                    Supprimer la mission
                  </button>
                ) : <div />}
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer' }}>Annuler</button>
                  <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {isEditing ? 'Sauvegarder les modifications' : 'Créer la Mission'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGenerateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '450px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Générateur de Prompts IA</h2>
              <button onClick={() => setIsGenerateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleGeneratePrompts} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Catégorie</label>
                <select value={generateData.category} onChange={e => setGenerateData({...generateData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }}>
                  <option value="agriculture">Agriculture 🌱</option>
                  <option value="daily_life">Vie quotidienne 🏠</option>
                  <option value="instructions">Instructions 🛠️</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Niveau de difficulté</label>
                <select value={generateData.difficulty} onChange={e => setGenerateData({...generateData, difficulty: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }}>
                  <option value="1">Niveau 1 (Simple)</option>
                  <option value="2">Niveau 2 (Moyen)</option>
                  <option value="3">Niveau 3 (Complexe)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Nombre de phrases à générer</label>
                <input type="number" min="1" max="50" value={generateData.count} onChange={e => setGenerateData({...generateData, count: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)' }} />
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '0.5rem', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input 
                    type="checkbox" 
                    id="gen_create_tasks"
                    checked={generateData.create_tasks} 
                    onChange={e => setGenerateData({...generateData, create_tasks: e.target.checked})} 
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }} 
                  />
                  <label htmlFor="gen_create_tasks" style={{ fontSize: '0.875rem', fontWeight: 800, cursor: 'pointer', color: 'var(--color-primary)' }}>
                    Créer automatiquement des Missions (Mobile)
                  </label>
                </div>

                {generateData.create_tasks && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Langue cible</label>
                      <select value={generateData.language_id} onChange={e => setGenerateData({...generateData, language_id: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }}>
                        <option value="">Toutes</option>
                        {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Prix (FCFA)</label>
                      <input type="number" value={generateData.reward} onChange={e => setGenerateData({...generateData, reward: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsGenerateModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer' }}>Annuler</button>
                <button type="submit" style={{ flex: 2, padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>auto_awesome</span>
                  Générer maintenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionsManagement;
