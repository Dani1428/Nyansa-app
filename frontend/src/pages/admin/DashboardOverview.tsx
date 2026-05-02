import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectTrendChart from '../../components/admin/ProjectTrendChart';

interface DashboardStats {
  total_datasets: number;
  active_projects: number;
  total_experts: number;
  translation_accuracy: number[];
  project_trends: number[];
}

const DashboardOverview = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    total_datasets: 0,
    active_projects: 0,
    total_experts: 0,
    translation_accuracy: [0],
    project_trends: [0, 0, 0, 0]
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/dashboard/metrics/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data && data.translation_accuracy) {
          setStats(data);
        }
      })
      .catch(err => console.error('Error fetching dashboard metrics:', err));
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.dashboard.title') || 'Dashboard Overview'}</h1>
          <p className="admin-page-desc">{t('admin.dashboard.desc') || 'Real-time performance metrics for global agricultural linguistic processing.'}</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        {/* Card 1 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-icon" style={{ backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <span className="admin-badge" style={{ backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary)' }}>+12%</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-on-surface-variant)', marginBottom: '0.25rem' }}>{t('admin.dashboard.active_projects')}</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.active_projects}</h3>
        </div>

        {/* Card 2 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-icon" style={{ backgroundColor: 'rgba(107, 254, 156, 0.2)', color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <span className="admin-badge" style={{ backgroundColor: 'rgba(31, 122, 99, 0.1)', color: 'var(--color-primary)' }}>+5.2%</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-on-surface-variant)', marginBottom: '0.25rem' }}>{t('admin.dashboard.total_experts')}</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.total_experts}</h3>
        </div>

        {/* Card 3 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-icon" style={{ backgroundColor: 'rgba(133, 64, 54, 0.1)', color: 'var(--color-tertiary)' }}>
              <span className="material-symbols-outlined">database</span>
            </div>
            <span className="admin-badge" style={{ backgroundColor: 'rgba(133, 64, 54, 0.1)', color: 'var(--color-tertiary)' }}>+18%</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-on-surface-variant)', marginBottom: '0.25rem' }}>{t('admin.dashboard.total_datasets')}</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.total_datasets}</h3>
        </div>

        {/* Card 4 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-icon" style={{ backgroundColor: 'rgba(158, 243, 215, 0.3)', color: 'var(--color-primary-container)' }}>
              <span className="material-symbols-outlined">language</span>
            </div>
            <span className="admin-badge" style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}>Stable</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-on-surface-variant)', marginBottom: '0.25rem' }}>{t('admin.dashboard.accuracy')}</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{(stats.translation_accuracy && stats.translation_accuracy.length > 0) ? stats.translation_accuracy[stats.translation_accuracy.length - 1] : 0}%</h3>
        </div>
      </div>

      <div className="admin-grid admin-grid-cols-3">
        <div className="admin-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{t('admin.dashboard.trends')}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>{t('admin.dashboard.trends_desc') || 'Volume of incoming linguistic analysis requests'}</p>
            </div>
            <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontSize: '0.75rem', fontWeight: 600 }}>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <ProjectTrendChart data={stats.project_trends} />
          </div>
        </div>

        <div className="admin-card" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <span style={{ color: 'var(--color-on-primary-container)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>{t('admin.dashboard.system_status') || 'System Status'}</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>{t('admin.dashboard.engine_core') || 'Linguistic Engine Core'}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--color-secondary-container)' }}></span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>{t('admin.dashboard.operational') || 'All nodes operational'}</span>
            </div>
          </div>
          
          <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
              <span>{t('admin.dashboard.throughput') || 'Throughput'}</span>
              <span>{(stats.translation_accuracy && stats.translation_accuracy.length > 0) ? stats.translation_accuracy[stats.translation_accuracy.length - 1] : 0}%</span>
            </div>
            <div style={{ width: '100%', height: '0.375rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '9999px' }}>
              <div style={{ width: `${(stats.translation_accuracy && stats.translation_accuracy.length > 0) ? stats.translation_accuracy[stats.translation_accuracy.length - 1] : 0}%`, height: '100%', backgroundColor: 'var(--color-secondary-container)', borderRadius: '9999px' }}></div>
            </div>
          </div>
          
          <span className="material-symbols-outlined" style={{ position: 'absolute', right: '-1rem', bottom: '-1rem', fontSize: '120px', opacity: 0.1 }}>grid_view</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
