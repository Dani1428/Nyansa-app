import React, { useState, useEffect } from 'react';

interface Dataset {
  id: string;
  title: string;
  language: string;
  size_info: string;
  sector: string;
  is_available: boolean;
  dataset_type: string;
  description: string;
}

const DatasetsManagement = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    language: '',
    size_info: '',
    sector: '',
    dataset_type: 'Text Corpus',
    description: ''
  });

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: '', language: '', size_info: '', sector: '', dataset_type: 'Text Corpus', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dataset: Dataset) => {
    setIsEditing(true);
    setCurrentId(dataset.id);
    setFormData({
      title: dataset.title,
      language: dataset.language,
      size_info: dataset.size_info,
      sector: dataset.sector,
      dataset_type: dataset.dataset_type,
      description: dataset.description
    });
    setIsModalOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/datasets/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('API not ready');
        return res.json();
      })
      .then(data => {
        const list = data.results || (Array.isArray(data) ? data : []);
        setDatasets(list);
      })
      .catch(err => console.log('Error fetching datasets:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const updateDatasetStatus = async (id: string, is_available: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/datasets/${id}/`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ is_available })
      });
      if (response.ok) {
        setDatasets(datasets.map(ds => ds.id === id ? { ...ds, is_available } : ds));
      }
    } catch (error) {
      console.error('Error updating dataset:', error);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentId) {
      try {
        const response = await fetch(`/api/v1/datasets/${currentId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const updated = await response.json();
          setDatasets(datasets.map(ds => ds.id === currentId ? updated : ds));
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error editing dataset:', error);
      }
    } else {
      try {
        const response = await fetch('/api/v1/datasets/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, is_available: false })
        });
        if (response.ok) {
          const newDs = await response.json();
          setDatasets([...datasets, newDs]);
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error adding dataset:', error);
      }
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Datasets Management</h1>
          <p className="admin-page-desc">Curate and oversee high-precision linguistic datasets for agricultural advancement across the Global South.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '3rem' }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          Add New Dataset
        </button>
      </div>

      <div className="admin-grid admin-grid-cols-3">
        {/* Featured Dataset Card */}
        {datasets.length > 0 && !isLoading && (
          <div className="admin-card" style={{ gridColumn: 'span 2', padding: 0, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '33.333%', position: 'relative', overflow: 'hidden' }}>
              <img 
                src={'https://lh3.googleusercontent.com/aida-public/AB6AXuB9qZfHQUH63kNcX6ndFxXuWypAsUsS51mmFZuHr7qjvSZi0KrOZOzxZ4E9oPgXCucz-VnwRhw48ilOecFjMr2iSKuRucSyMf7xiGjlekmabkMP1j2KDz2ql58YJ1tZ_4TUKIj8F620nogRxP0Z2uhUGBtczFTT1kk_-VdptAxSzYu1d_M10lVebceno7TsC-Xo91RyOHy4U1uUQUrU0EjkD9loAL_qfYCGKq4NNpELM-reioZs3am-aISAf8ZIDi8qdtRUYwjIAATS'} 
                alt={datasets[0].title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            <div style={{ width: '66.666%', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative' }}>
                  <span className="admin-badge" style={{ backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary-container)' }}>High Priority</span>
                  <button 
                    className="admin-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === datasets[0].id ? null : datasets[0].id);
                    }}
                  >
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                  {openDropdownId === datasets[0].id && (
                    <div style={{ position: 'absolute', right: '0', top: '2.5rem', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50, overflow: 'hidden', minWidth: '160px', border: '1px solid var(--color-border)', textAlign: 'left' }}>
                      <button onClick={() => updateDatasetStatus(datasets[0].id, !datasets[0].is_available)} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                        {datasets[0].is_available ? 'Mark as Processing' : 'Mark as Available'}
                      </button>
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{datasets[0].title}</h3>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '0.25rem' }}>translate</span> {datasets[0].language}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '0.25rem' }}>database</span> {datasets[0].size_info}
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', marginBottom: '1rem' }}>
                  {datasets[0].description}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container-low)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: datasets[0].is_available ? 'var(--color-secondary)' : 'var(--color-tertiary)' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: datasets[0].is_available ? 'var(--color-secondary)' : 'var(--color-tertiary)' }}>{datasets[0].is_available ? 'AVAILABLE' : 'PROCESSING'}</span>
                </div>
                <button onClick={() => openEditModal(datasets[0])} style={{ background: 'none', border: 'none', color: 'var(--color-primary-container)', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                  Edit Details <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular Dataset Cards */}
        {!isLoading && datasets.slice(1).map((ds) => (
          <div key={ds.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: !ds.is_available ? 'rgba(255, 152, 0, 0.1)' : 'rgba(107, 254, 156, 0.2)', color: !ds.is_available ? '#ff9800' : 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">{ds.dataset_type.includes('Image') ? 'image' : ds.dataset_type.includes('Audio') ? 'audio_file' : 'description'}</span>
              </div>
              <span className="admin-badge" style={{ backgroundColor: !ds.is_available ? 'rgba(255, 218, 213, 1)' : 'var(--color-secondary-container)', color: !ds.is_available ? 'var(--color-on-tertiary-fixed-variant)' : 'var(--color-on-secondary-container)' }}>
                {!ds.is_available ? 'Processing' : 'Available'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>{ds.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-on-surface-variant)' }}>Language:</span>
                <span style={{ fontWeight: 500 }}>{ds.language}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-on-surface-variant)' }}>Sector:</span>
                <span style={{ fontWeight: 500 }}>{ds.sector}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-on-surface-variant)' }}>Size:</span>
                <span style={{ fontWeight: 500 }}>{ds.size_info}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: !ds.is_available ? 'var(--color-tertiary)' : 'var(--color-secondary)' }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: !ds.is_available ? 'var(--color-tertiary)' : 'var(--color-secondary)' }}>
                  {!ds.is_available ? 'PENDING' : 'ACTIVE'}
                </span>
              </div>
              <button 
                className="admin-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdownId(openDropdownId === ds.id ? null : ds.id);
                }}
              >
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
              {openDropdownId === ds.id && (
                <div style={{ position: 'absolute', right: '0', bottom: '2.5rem', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50, overflow: 'hidden', minWidth: '160px', border: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <button onClick={() => updateDatasetStatus(ds.id, !ds.is_available)} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {ds.is_available ? 'Mark as Processing' : 'Mark as Available'}
                  </button>
                  <button onClick={() => { setOpenDropdownId(null); openEditModal(ds); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', borderTop: '1px solid var(--color-border)' }}>
                    Edit Details
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '500px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>{isEditing ? 'Edit Dataset' : 'Add New Dataset'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-on-surface-variant)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-on-surface)' }}>Dataset Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} placeholder="e.g. Swahili Maize Pathology" />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-on-surface)' }}>Language</label>
                  <input type="text" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} placeholder="e.g. Swahili" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-on-surface)' }}>Type</label>
                  <select value={formData.dataset_type} onChange={e => setFormData({...formData, dataset_type: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
                    <option value="Text Corpus">Text Corpus</option>
                    <option value="Audio Data">Audio Data</option>
                    <option value="Image + Metadata">Image + Metadata</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-on-surface)' }}>Sector</label>
                  <input type="text" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} placeholder="e.g. Crop Pathology" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-on-surface)' }}>Size / Samples</label>
                  <input type="text" value={formData.size_info} onChange={e => setFormData({...formData, size_info: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} placeholder="e.g. 1.2 GB" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-on-surface)' }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', resize: 'none' }} placeholder="Brief overview of the dataset..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, backgroundColor: 'transparent', color: 'var(--color-on-surface)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer' }}>{isEditing ? 'Save Changes' : 'Create Dataset'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetsManagement;
