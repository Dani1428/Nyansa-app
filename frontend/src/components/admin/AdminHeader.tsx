import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminHeader = () => {
  const { t } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Clear the auth token
    localStorage.removeItem('token');
    // Navigate to the login page when logout is clicked
    navigate('/admin/login');
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/notifications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Handle paginated or direct array results
        setNotifications(data.results || (Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/v1/notifications/${id}/mark_as_read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div className="admin-search-box">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search data modules..."
          />
        </div>
      </div>

      <div className="admin-header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }} ref={notificationRef}>
            <button 
              className="admin-icon-btn" 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.some(n => !n.is_read) && <span className="admin-notification-dot"></span>}
            </button>

            {isNotificationsOpen && (
              <div className="notification-dropdown">
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.875rem' }}>{t('admin.common.notifications') || 'Notifications'}</h4>
                  <span 
                    style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => {
                      notifications.filter(n => !n.is_read).forEach(n => markAsRead(n.id));
                    }}
                  >
                    Mark all as read
                  </span>
                </div>
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-icon-circle" style={{ 
                          backgroundColor: notification.type === 'error' ? 'rgba(186, 26, 26, 0.1)' : 
                                           notification.type === 'warning' ? 'rgba(133, 64, 54, 0.1)' : 
                                           'rgba(31, 122, 99, 0.1)', 
                          color: notification.type === 'error' ? 'var(--color-error)' : 
                                 notification.type === 'warning' ? 'var(--color-tertiary)' : 
                                 'var(--color-primary)' 
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                            {notification.type === 'error' ? 'report' : 
                             notification.type === 'warning' ? 'warning' : 
                             notification.type === 'success' ? 'check_circle' : 'info'}
                          </span>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: !notification.is_read ? 700 : 600 }}>{notification.title}</p>
                          <p style={{ margin: '0.125rem 0 0.25rem', fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>{notification.message}</p>
                          <span style={{ fontSize: '0.625rem', color: 'var(--color-outline-variant)' }}>
                            {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--color-on-surface-variant)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>View all notifications</button>
                </div>
              </div>
            )}
          </div>
          <button 
            className="admin-icon-btn"
            onClick={() => window.open('https://docs.nyansa-ai.com', '_blank')}
          >
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        
        <div className="admin-divider"></div>
        
        <div 
          className="admin-profile" 
          ref={profileRef}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{ position: 'relative' }}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-uImxVou6Jqa3fvzk9C2Rhkc5oD6a4znOmyXvMn7-XmsAGBk7FpmX6xE6M7KsjKM5uLiOV2a9ERsEhaudDsv2hgIoYvgxgEMB12phlB3aQtMIC6TQrGCuwQpT8AE_bdwsU08amIAKEnNwHEO1dU52hQkJhle8UGDkFXNMNWyAfFvluXfaZgKgkEqJZT3CkMhPpMzFET6wLsFJl_JuL-snU2Wag1j86h5eX3PoS_4BhXhubakTM2bAYtUuzL97K5byYeCGAMnDGuEV"
            alt="Admin Profile"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Profile Settings</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', transition: 'transform 0.2s', transform: isProfileOpen ? 'rotate(180deg)' : 'none' }}>
              expand_more
            </span>
          </div>

          {isProfileOpen && (
            <div style={{ 
              position: 'absolute', 
              top: 'calc(100% + 1rem)', 
              right: 0, 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
              border: '1px solid var(--color-border)',
              width: '12rem',
              zIndex: 50,
              padding: '0.5rem'
            }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0, color: 'var(--color-on-surface)' }}>Admin User</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', margin: 0 }}>admin@nyansa-ai.com</p>
              </div>
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/admin/settings');
                }}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  padding: '0.5rem', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: 'var(--color-on-surface)',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.25rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--color-on-surface-variant)' }}>settings</span>
                Settings
              </button>
              
              <button 
                onClick={handleLogout}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  padding: '0.5rem', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: 'var(--color-error)',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(186, 26, 26, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
