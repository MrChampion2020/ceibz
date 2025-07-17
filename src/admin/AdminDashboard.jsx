import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaVideo, 
  FaComments, 
  FaFileAlt, 
  FaEnvelope, 
  FaChartLine,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaPray,
  FaHandsHelping,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaMobile,
  FaDesktop,
  FaTablet
} from 'react-icons/fa';
import axios from 'axios';
import api from '../api';

const AdminDashboard = ({ adminInfo, onLogout, onSectionChange }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStreams: 0,
    totalComments: 0,
    totalTestimonies: 0,
    pendingContacts: 0,
    todayUsers: 0,
    todayComments: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    streams: [],
    comments: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${api}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data.stats);
      setRecentActivity(response.data.recentActivity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    onLogout();
  };

  if (loading) {
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
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading dashboard...</p>
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
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Dashboard Content Only - Remove all sidebar/nav/layout */}
      <div style={{
        marginBottom: '32px'
      }}>
            <h1 style={{
          fontSize: '32px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              Dashboard Overview
            </h1>
            <p style={{
          fontSize: '16px',
              color: '#6b7280'
            }}>
              Monitor your church's digital presence and engagement
            </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <StatCard
            icon={<FaUsers />}
            title="Total Users"
            value={stats.totalUsers}
            change="+12%"
            color="#3b82f6"
          />
          <StatCard
            icon={<FaVideo />}
            title="Active Streams"
            value={stats.activeStreams}
            change="+5%"
            color="#10b981"
          />
          <StatCard
            icon={<FaComments />}
            title="Total Comments"
            value={stats.totalComments}
            change="+8%"
            color="#f59e0b"
          />
          <StatCard
            icon={<FaFileAlt />}
            title="Testimonies"
            value={stats.totalTestimonies}
            change="+15%"
            color="#8b5cf6"
          />
          <StatCard
            icon={<FaEnvelope />}
            title="Pending Contacts"
            value={stats.pendingContacts}
            change="+3"
            color="#ef4444"
          />
          <StatCard
            icon={<FaHandsHelping />}
            title="Today's Users"
            value={stats.todayUsers}
            change="+20%"
            color="#06b6d4"
          />
        </div>

        {/* Recent Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1f2937'
            }}>
              Recent Streams
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.streams.slice(0, 5).map((stream, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FaVideo size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {stream.title || 'Untitled Stream'}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {new Date(stream.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#e5e7eb',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      <FaEye size={12} color="#6b7280" />
                    </button>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#e5e7eb',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      <FaEdit size={12} color="#6b7280" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1f2937'
            }}>
              Recent Comments
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.comments.slice(0, 5).map((comment, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {comment.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {comment.userName}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {comment.content}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#e5e7eb',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      <FaEye size={12} color="#6b7280" />
                    </button>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#e5e7eb',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      <FaTrash size={12} color="#6b7280" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginTop: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#1f2937'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <QuickActionButton
              icon={<FaPlus />}
              label="Add New Stream"
              color="#3b82f6"
            />
            <QuickActionButton
              icon={<FaFileAlt />}
              label="Review Testimonies"
              color="#10b981"
            />
            <QuickActionButton
              icon={<FaEnvelope />}
              label="Check Messages"
              color="#f59e0b"
            />
            <QuickActionButton
              icon={<FaPray />}
              label="Prayer Requests"
              color="#8b5cf6"
            />
          </div>
        </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid #e5e7eb`
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '14px',
        color: '#10b981',
        fontWeight: '500'
      }}>
        {change}
      </span>
    </div>
    <h3 style={{
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px'
    }}>
      {value.toLocaleString()}
    </h3>
    <p style={{
      fontSize: '14px',
      color: '#6b7280'
    }}>
      {title}
    </p>
  </motion.div>
);

const QuickActionButton = ({ icon, label, color }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    style={{
      padding: '16px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s'
    }}
  >
    <div style={{
      color: color,
      fontSize: '18px'
    }}>
      {icon}
    </div>
    <span style={{
      fontSize: '14px',
      fontWeight: '500',
      color: '#1f2937'
    }}>
      {label}
    </span>
  </motion.button>
);

export default AdminDashboard; 