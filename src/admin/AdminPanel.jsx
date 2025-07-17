import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaTachometerAlt, 
  FaVideo, 
  FaUsers, 
  FaComments, 
  FaFileAlt, 
  FaEnvelope, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
  FaCalendarAlt
} from 'react-icons/fa';
import AdminDashboard from './AdminDashboard';
import AdminStreams from './AdminStreams';
import AdminUsers from './AdminUsers';
import AdminComments from './AdminComments';
import AdminTestimonies from './AdminTestimonies';
import AdminContacts from './AdminContacts';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminEvents from './AdminEvents';
import AdminChat from './AdminChat'; // Added import for AdminChat

const AdminPanel = () => {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      // You can fetch admin data here if needed
    } else {
      // TEMPORARY: Bypass authentication for testing
      setIsAuthenticated(true);
      // Uncomment the line below when you want to enable authentication again
      // window.location.href = '/admin/login';
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, color: '#3b82f6' },
    { id: 'streams', label: 'Streams', icon: <FaVideo />, color: '#ef4444' },
    { id: 'users', label: 'Users', icon: <FaUsers />, color: '#10b981' },
    { id: 'comments', label: 'Comments', icon: <FaComments />, color: '#f59e0b' },
    { id: 'testimonies', label: 'Testimonies', icon: <FaFileAlt />, color: '#8b5cf6' },
    { id: 'contacts', label: 'Contacts', icon: <FaEnvelope />, color: '#06b6d4' },
    { id: 'events', label: 'Events', icon: <FaCalendarAlt />, color: '#f59e0b' },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar />, color: '#84cc16' },
    { id: 'chat', label: 'Live Chat', icon: <FaComments />, color: '#06b6d4' }, // Move Live Chat above Settings
    { id: 'settings', label: 'Settings', icon: <FaCog />, color: '#6b7280' },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <AdminDashboard onSectionChange={setActiveScreen} />;
      case 'streams':
        return <AdminStreams onSectionChange={setActiveScreen} />;
      case 'users':
        return <AdminUsers onSectionChange={setActiveScreen} />;
      case 'comments':
        return <AdminComments onSectionChange={setActiveScreen} />;
      case 'testimonies':
        return <AdminTestimonies onSectionChange={setActiveScreen} />;
      case 'contacts':
        return <AdminContacts onSectionChange={setActiveScreen} />;
      case 'events':
        return <AdminEvents onSectionChange={setActiveScreen} />;
      case 'analytics':
        return <AdminAnalytics onSectionChange={setActiveScreen} />;
      case 'settings':
        return <AdminSettings onSectionChange={setActiveScreen} />;
      case 'chat': // Added case for chat
        return <AdminChat onSectionChange={setActiveScreen} />;
      default:
        return <AdminDashboard onSectionChange={setActiveScreen} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #2a1e7a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: isMobile ? '280px' : '280px',
              backgroundColor: '#2a1e7a',
              color: 'white',
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
              position: isMobile ? 'fixed' : 'fixed',
              zIndex: 1000,
              height: '100vh',
              left: 0,
              top: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Sidebar Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  CEIBZ Admin
                </h2>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  Church Management
                </p>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Navigation Menu */}
            <nav style={{ 
              padding: '16px 0',
              flex: 1,
              overflowY: 'auto'
            }}>
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveScreen(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: activeScreen === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    fontWeight: activeScreen === item.id ? '600' : '500',
                    color: 'white',
                    borderLeft: activeScreen === item.id ? '3px solid white' : '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ color: item.color, fontSize: '16px' }}>
                    {item.icon}
                  </div>
                  {item.label}
                  {activeScreen === item.id && (
                    <FaChevronRight style={{ marginLeft: 'auto', fontSize: '12px' }} />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Logout Button */}
            <div style={{ 
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaSignOutAlt />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        marginLeft: isMobile ? '0' : (sidebarOpen ? '280px' : '0'),
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top Bar */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {!sidebarOpen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaBars />
              </motion.button>
            )}
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              {menuItems.find(item => item.id === activeScreen)?.label || 'Dashboard'}
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2a1e7a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              A
            </div>
            <span style={{
              fontSize: '14px',
              color: '#374151',
              fontWeight: '500'
            }}>
              Admin
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative'
        }}>
          {/* Scroll Indicator */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: 'transparent',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <div
              id="scroll-indicator"
              style={{
                height: '100%',
                backgroundColor: '#2a1e7a',
                width: '0%',
                transition: 'width 0.1s ease'
              }}
            />
          </div>

    <AnimatePresence mode="wait">
      <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
              style={{
                padding: '24px',
                minHeight: '100%'
              }}
              onScroll={(e) => {
                const scrollTop = e.target.scrollTop;
                const scrollHeight = e.target.scrollHeight;
                const clientHeight = e.target.clientHeight;
                const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
                const indicator = document.getElementById('scroll-indicator');
                if (indicator) {
                  indicator.style.width = `${scrollPercentage}%`;
                }
              }}
            >
              {renderScreen()}
      </motion.div>
    </AnimatePresence>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel; 