import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSave, 
  FaUser, 
  FaLock, 
  FaBell, 
  FaPalette,
  FaGlobe,
  FaShieldAlt,
  FaDatabase,
  FaCog,
  FaExclamationTriangle,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';

const AdminSettings = (props) => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'CEIBZ Church',
      siteDescription: 'Christ Embassy International Bible Zone',
      contactEmail: 'admin@ceibz.com',
      contactPhone: '+234 123 456 7890'
    },
    appearance: {
      primaryColor: '#2a1e7a',
      secondaryColor: '#f59e0b',
      darkMode: false
    },
    notifications: {
      emailNotifications: true,
      streamAlerts: true,
      userRegistrations: true,
      commentModeration: true
    },
    security: {
      sessionTimeout: 30,
      requireTwoFactor: false,
      passwordMinLength: 8
    }
  });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put('http://localhost:5000/api/admin/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog />, color: '#3b82f6' },
    { id: 'appearance', label: 'Appearance', icon: <FaPalette />, color: '#8b5cf6' },
    { id: 'notifications', label: 'Notifications', icon: <FaBell />, color: '#f59e0b' },
    { id: 'security', label: 'Security', icon: <FaShieldAlt />, color: '#ef4444' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Settings Content Only - Remove all sidebar/nav/layout */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Settings
        </h1>
        <p style={{
          fontSize: '16px',
        color: '#6b7280'
        }}>
          Configure your church management system
        </p>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaExclamationTriangle />
          {error}
          <button
            onClick={() => setError('')}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaCheck />
          {success}
          <button
            onClick={() => setSuccess('')}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#16a34a',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
        </motion.div>
      )}

      {/* Settings Container */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '24px',
        minHeight: '600px'
      }}>
        {/* Tabs */}
        <div style={{
          width: isMobile ? '100%' : '250px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          height: 'fit-content'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 16px',
                  background: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  color: activeTab === tab.id ? '#2a1e7a' : '#374151',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: tab.color, fontSize: '16px' }}>
                  {tab.icon}
                </div>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'general' && (
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '24px'
                  }}>
                    General Settings
                  </h2>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Site Description
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.general.contactPhone}
                        onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '24px'
                  }}>
                    Appearance Settings
                  </h2>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Primary Color
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                          style={{
                            width: '50px',
                            height: '40px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Secondary Color
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <input
                          type="color"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleInputChange('appearance', 'secondaryColor', e.target.value)}
                          style={{
                            width: '50px',
                            height: '40px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        />
                        <input
                          type="text"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleInputChange('appearance', 'secondaryColor', e.target.value)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.appearance.darkMode}
                        onChange={(e) => handleInputChange('appearance', 'darkMode', e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#2a1e7a'
                        }}
                      />
                      <label style={{
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Enable Dark Mode
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '24px'
                  }}>
                    Notification Settings
                  </h2>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          Email Notifications
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Receive notifications via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#2a1e7a'
                        }}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          Stream Alerts
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Get notified when streams go live
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.streamAlerts}
                        onChange={(e) => handleInputChange('notifications', 'streamAlerts', e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#2a1e7a'
                        }}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          User Registrations
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Notify when new users register
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.userRegistrations}
                        onChange={(e) => handleInputChange('notifications', 'userRegistrations', e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#2a1e7a'
                        }}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          Comment Moderation
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Alert for comments requiring moderation
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.commentModeration}
                        onChange={(e) => handleInputChange('notifications', 'commentModeration', e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#2a1e7a'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '24px'
                  }}>
                    Security Settings
                  </h2>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="20"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.security.requireTwoFactor}
                        onChange={(e) => handleInputChange('security', 'requireTwoFactor', e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#2a1e7a'
                        }}
                      />
                      <label style={{
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Require Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 