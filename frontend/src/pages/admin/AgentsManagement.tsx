import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AgentProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  phone_number: string;
  status: 'active' | 'warning' | 'suspended';
  quality_score: number;
  fraud_score: number;
  balance: string;
  device_model: string;
  network_operator: string;
  last_lat: number;
  last_long: number;
  last_seen: string;
  created_at: string;
}

const AgentsManagement = () => {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'suspended' | 'warning'>('all');

  const fetchAgents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/agents/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Handle paginated or direct array results
        setAgents(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const toggleStatus = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/v1/agents/${id}/toggle_status/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAgents();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const filteredAgents = agents.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.agents.title')}</h1>
          <p className="admin-page-desc">{t('admin.agents.desc')}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', padding: '0.25rem', borderRadius: '0.75rem' }}>
            <button 
              onClick={() => setFilter('all')}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: filter === 'all' ? 'white' : 'transparent', fontWeight: 700, cursor: 'pointer' }}
            >Tous</button>
            <button 
              onClick={() => setFilter('suspended')}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: filter === 'suspended' ? 'white' : 'transparent', color: filter === 'suspended' ? 'var(--color-error)' : 'inherit', fontWeight: 700, cursor: 'pointer' }}
            >Suspendus</button>
          </div>
        </div>
      </div>

      <div className="admin-grid admin-grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('admin.agents.total')}</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{agents.length}</h2>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-error)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('admin.agents.suspended')}</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-error)' }}>{agents.filter(a => a.status === 'suspended').length}</h2>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('admin.agents.avg_score')}</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>
            {agents.length > 0 ? (agents.reduce((acc, a) => acc + a.quality_score, 0) / agents.length * 100).toFixed(1) : 0}%
          </h2>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('admin.agents.fraud_alerts')}</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-secondary)' }}>{agents.filter(a => a.fraud_score > 0.4).length}</h2>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.agents.table.agent')}</th>
              <th>{t('admin.agents.table.device')}</th>
              <th>{t('admin.agents.table.status')}</th>
              <th>{t('admin.agents.table.quality')}</th>
              <th>{t('admin.agents.table.location')}</th>
              <th>{t('admin.agents.table.balance')}</th>
              <th style={{ textAlign: 'right' }}>{t('admin.agents.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>{t('admin.common.loading') || 'Loading...'}</td></tr>
            ) : filteredAgents.map(agent => (
              <tr key={agent.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {agent.user.username[0].toUpperCase()}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '0.75rem', height: '0.75rem', borderRadius: '50%', border: '2px solid white', backgroundColor: (new Date().getTime() - new Date(agent.last_seen).getTime() < 300000) ? '#4CAF50' : '#9E9E9E' }}></div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{agent.user.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>{agent.phone_number}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{agent.device_model || 'Inconnu'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{agent.network_operator || 'Détection...'}</div>
                </td>
                <td>
                  <span className={`admin-badge ${agent.status === 'active' ? 'approved' : agent.status === 'suspended' ? 'rejected' : 'pending'}`}>
                    {agent.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '3rem', height: '0.4rem', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '1rem', overflow: 'hidden' }}>
                      <div style={{ width: `${agent.quality_score * 100}%`, height: '100%', backgroundColor: agent.quality_score > 0.7 ? 'var(--color-secondary)' : 'var(--color-primary)' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{(agent.quality_score * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td>
                  {agent.last_lat ? (
                    <a 
                      href={`https://www.google.com/maps?q=${agent.last_lat},${agent.last_long}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>location_on</span>
                      {t('admin.agents.table.view_map')}
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>{t('admin.agents.table.not_localized')}</span>
                  )}
                </td>
                <td style={{ fontWeight: 800 }}>{parseFloat(agent.balance).toLocaleString()} FCFA</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => toggleStatus(agent.id)}
                    style={{ 
                      padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', 
                      backgroundColor: agent.status === 'suspended' ? 'var(--color-secondary)' : 'transparent',
                      color: agent.status === 'suspended' ? 'white' : 'var(--color-error)',
                      fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem'
                    }}
                  >
                    {agent.status === 'suspended' ? t('admin.agents.table.reactivate') : t('admin.agents.table.suspend')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsManagement;
