import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ProjectRequest {
  id: string;
  name: string;
  email: string;
  project_type: string;
  status: 'New' | 'In Review' | 'Approved' | 'Rejected';
  created_at: string;
  ai_suggestion?: string;
}

const ProjectRequests = () => {
  const location = useLocation();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'New' | 'Pending'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    email: '', 
    project_type: 'Language Request',
    region: '',
    language: '',
    description: '',
    priority: 'Medium'
  });

  // Check for create query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      setIsModalOpen(true);
      // Clean up the URL without reloading to avoid re-opening on refresh
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/contact/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        // Handle paginated or direct array results defensively
        const list = (data && data.results) ? data.results : (Array.isArray(data) ? data : []);
        setRequests(list);
      })
      .catch(err => console.error('Error fetching project requests:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/v1/contact/${id}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus as any } : req));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Construct message including region/language details if provided
    const messageContent = `${newProject.description}${newProject.region ? ` \nRegion: ${newProject.region}` : ''}${newProject.language ? ` \nLanguage: ${newProject.language}` : ''}`;

    const payload = {
      name: newProject.name,
      email: newProject.email,
      project_type: newProject.project_type,
      message: messageContent,
      status: 'New'
    };

    try {
      const response = await fetch('/api/v1/contact/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedProject = await response.json();
        setRequests([savedProject, ...requests]);
        setIsModalOpen(false);
        setNewProject({ 
          name: '', email: '', project_type: 'Language Request', 
          region: '', language: '', description: '', priority: 'Medium' 
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const safeRequests = Array.isArray(requests) ? requests : [];
  const filteredRequests = safeRequests.filter(req => {
    if (filter === 'All') return true;
    if (filter === 'New') return req.status === 'New';
    if (filter === 'Pending') return req.status === 'In Review';
    return true;
  });

  const newRequests = safeRequests.filter(r => r.status === 'New');

  const getProjectTypeStyles = (type: string) => {
    switch(type) {
      case 'Language Request':
        return { backgroundColor: 'rgba(98, 0, 238, 0.1)', color: '#6200EE' };
      case 'Expert Application':
        return { backgroundColor: 'rgba(3, 218, 198, 0.1)', color: '#018786' };
      case 'Dataset Inquiry':
        return { backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#EF6C00' };
      default:
        return { backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary)' };
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.625rem' }}>Data Management</span>
          </div>
          <h2 className="admin-page-title">Project Requests</h2>
          <p className="admin-page-desc">Review and manage incoming agricultural linguistic inquiries.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface-container-low)', padding: '0.375rem', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => setFilter('All')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: filter === 'All' ? 800 : 600, backgroundColor: filter === 'All' ? 'var(--color-white)' : 'transparent', color: filter === 'All' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', border: 'none', boxShadow: filter === 'All' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
          >All</button>
          <button 
            onClick={() => setFilter('New')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: filter === 'New' ? 800 : 600, backgroundColor: filter === 'New' ? 'var(--color-white)' : 'transparent', color: filter === 'New' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', border: 'none', boxShadow: filter === 'New' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
          >New</button>
          <button 
            onClick={() => setFilter('Pending')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: filter === 'Pending' ? 800 : 600, backgroundColor: filter === 'Pending' ? 'var(--color-white)' : 'transparent', color: filter === 'Pending' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', border: 'none', boxShadow: filter === 'Pending' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
          >Pending</button>
        </div>
      </div>

      {/* Modal for New Project - Harmonized with Datasets style */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '600px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>Nouveau Projet</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-on-surface-variant)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-on-surface)' }}>Client / Demandeur *</label>
                  <input 
                    required 
                    type="text" 
                    value={newProject.name} 
                    onChange={e => setNewProject({...newProject, name: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} 
                    placeholder="Nom complet" 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-on-surface)' }}>Email de Contact *</label>
                  <input 
                    required 
                    type="email" 
                    value={newProject.email} 
                    onChange={e => setNewProject({...newProject, email: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} 
                    placeholder="exemple@nyansa.ai" 
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-on-surface)' }}>Région Cible</label>
                  <input 
                    type="text" 
                    value={newProject.region} 
                    onChange={e => setNewProject({...newProject, region: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} 
                    placeholder="ex: Vallée du Rift, Kenya" 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-on-surface)' }}>Langue / Dialecte</label>
                  <input 
                    type="text" 
                    value={newProject.language} 
                    onChange={e => setNewProject({...newProject, language: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }} 
                    placeholder="ex: Swahili, Wolof..." 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-on-surface)' }}>Type de Mission</label>
                  <select 
                    value={newProject.project_type} 
                    onChange={e => setNewProject({...newProject, project_type: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}
                  >
                    <option>Language Request</option>
                    <option>Expert Application</option>
                    <option>Dataset Inquiry</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-on-surface)' }}>Priorité</label>
                  <select 
                    value={newProject.priority} 
                    onChange={e => setNewProject({...newProject, priority: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-on-surface)' }}>Description du Projet</label>
                <textarea 
                  value={newProject.description} 
                  onChange={e => setNewProject({...newProject, description: e.target.value})} 
                  rows={3} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', resize: 'none' }} 
                  placeholder="Objectifs de la collecte..." 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, backgroundColor: 'transparent', color: 'var(--color-on-surface)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                >
                  Lancer le Projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-grid admin-grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Total Requests</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{safeRequests.length}</h3>
          <div style={{ marginTop: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', marginRight: '0.25rem' }}>trending_up</span> All time
          </div>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>New Inquiries</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary-container)' }}>{newRequests.length}</h3>
          <div style={{ marginTop: '0.5rem', color: 'var(--color-primary-container)', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', marginRight: '0.25rem' }}>schedule</span> Awaiting review
          </div>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Avg. Response Time</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>4.2h</h3>
          <div style={{ marginTop: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', marginRight: '0.25rem' }}>bolt</span> Exceeding target
          </div>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Completion Rate</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>94.8%</h3>
          <div style={{ marginTop: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', marginRight: '0.25rem' }}>check_circle</span> Consistent quality
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Project Type</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading requests...</td></tr>
            ) : filteredRequests.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No requests found.</td></tr>
            ) : filteredRequests.map((req) => (
              <tr key={req.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'rgba(107, 254, 156, 0.2)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      {getInitials(req.name)}
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--color-on-surface)' }}>{req.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>{req.email}</td>
                <td>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', ...getProjectTypeStyles(req.project_type) }}>
                    {req.project_type}
                  </span>
                </td>
                <td>
                  <span style={{ padding: '0.25rem 0.75rem', backgroundColor: req.status === 'New' ? 'var(--color-primary-container)' : req.status === 'In Review' ? 'var(--color-tertiary)' : 'var(--color-secondary)', color: 'white', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    {req.status}
                  </span>
                </td>
                <td style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>{formatDate(req.created_at)}</td>
                <td style={{ textAlign: 'right', position: 'relative' }}>
                  <button 
                    className="admin-icon-btn" 
                    style={{ marginLeft: 'auto' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === req.id ? null : req.id);
                    }}
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                  {openDropdownId === req.id && (
                    <div style={{ position: 'absolute', right: '2rem', top: '2rem', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50, overflow: 'hidden', minWidth: '140px', border: '1px solid var(--color-border)', textAlign: 'left' }}>
                      <button onClick={() => updateStatus(req.id, 'In Review')} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>Mark In Review</button>
                      <button onClick={() => updateStatus(req.id, 'Approved')} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)' }}>Approve</button>
                      <button onClick={() => updateStatus(req.id, 'Rejected')} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-error)' }}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-surface-container-low)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
            Showing <span style={{ color: 'var(--color-on-surface)', fontWeight: 800 }}>1-5</span> of <span style={{ color: 'var(--color-on-surface)', fontWeight: 800 }}>42</span> new requests
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', background: 'none', cursor: 'not-allowed', opacity: 0.5, display: 'flex' }} disabled>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>chevron_left</span>
            </button>
            <button style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', display: 'flex' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-grid admin-grid-cols-3" style={{ marginTop: '3rem' }}>
        <div style={{ gridColumn: 'span 2', position: 'relative', height: '320px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaSp7j-8B3d9TsxAhRD8iNIsm3OLIiCUBM6TQx_WHSgr60M4eURJB1yypw_GKcXzEbUq601MWXiDfE4Rtvm2w1X_9pO9Fr1W_0x2McGddjVFjpFAA-rVqkXgKpXE94un9vb6Ro_TxlFrLkwRJ4VyjwbLgA6RBzVkvpYGcxa9XEql5q40SgvIhcEE8QZc5ugfnnziFw6Q7xl29FtaecdAnwZ8ctFeT2k8YbSUl6JUnKfXmZ-vTvJHgX84pVernht9ZyZdLir-j7xCGq" alt="Nodes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3), transparent)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2rem' }}>
            <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block', marginBottom: '1rem' }}>Admin Spotlight</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>High Impact Language Datasets</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', maxWidth: '28rem' }}>We've seen a 40% increase in requests for Sub-Saharan agricultural dialect mapping this quarter.</p>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--color-primary-container)', padding: '2rem', borderRadius: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block' }}>auto_awesome</span>
              <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>AI Recommended</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Priorité Suggérée</h3>
            {newRequests.length > 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Priorisez la demande de <strong>"{newRequests[0].name}"</strong> concernant le projet <strong>"{newRequests[0].project_type}"</strong>. 
                Disponibilité d'experts détectée pour les dialectes locaux.
              </p>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Toutes les demandes ont été traitées. Le pipeline de collecte de données est optimisé pour les régions actuelles.
              </p>
            )}
          </div>
          <button 
            onClick={() => {
              if (newRequests.length > 0) updateStatus(newRequests[0].id, 'In Review');
            }}
            disabled={newRequests.length === 0}
            style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', backgroundColor: 'white', color: 'var(--color-primary)', fontWeight: 800, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', opacity: newRequests.length === 0 ? 0.7 : 1 }}
          >
            {newRequests.length > 0 ? 'Review Now' : 'System Optimized'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectRequests;
