import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheck,
  FaTimes,
  FaBan,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaFlag,
  FaPray,
  FaHandsHelping,
  FaHeart,
  FaFireAlt,
  FaRegSadTear,
  FaLock,
  FaUnlock,
  FaReply,
  FaMobile,
  FaDesktop
} from 'react-icons/fa';
import axios from 'axios';
import api from '../api';

const AdminPrayers = () => {
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState('');
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / docHeight) * 100;
      const indicator = document.getElementById('prayers-scroll-indicator');
      if (indicator) {
        indicator.style.width = `${scrollPercentage}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${api}/api/admin/prayer-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrayerRequests(response.data.prayerRequests || []);
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
      setError('Failed to fetch prayer requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, isAnswered) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${api}/api/admin/prayer-request/${id}/status`, 
        { status, isAnswered },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPrayerRequests(prayerRequests.map(prayer => 
        prayer._id === id ? { ...prayer, status, isAnswered } : prayer
      ));
    } catch (error) {
      console.error('Error updating prayer request status:', error);
      setError('Failed to update prayer request status');
    }
  };

  const handleResponse = async (id) => {
    if (!responseText.trim()) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${api}/api/admin/prayer-request/${id}/status`, 
        { 
          status: 'answered', 
          isAnswered: true,
          response: responseText 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPrayerRequests(prayerRequests.map(prayer => 
        prayer._id === id ? { 
          ...prayer, 
          status: 'answered', 
          isAnswered: true,
          response: responseText,
          respondedAt: new Date()
        } : prayer
      ));
      
      setShowResponseModal(false);
      setResponseText('');
      setSelectedPrayer(null);
    } catch (error) {
      console.error('Error responding to prayer request:', error);
      setError('Failed to send response');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'healing': return <FaHeart size={16} color="#ec4899" />;
      case 'deliverance': return <FaFireAlt size={16} color="#ef4444" />;
      case 'provision': return <FaHandsHelping size={16} color="#10b981" />;
      case 'relationship': return <FaHeart size={16} color="#ec4899" />;
      case 'family': return <FaUser size={16} color="#3b82f6" />;
      case 'work': return <FaHandsHelping size={16} color="#f59e0b" />;
      default: return <FaPray size={16} color="#6366f1" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fffbeb', color: '#d97706' };
      case 'praying': return { bg: '#f0fdf4', color: '#16a34a' };
      case 'answered': return { bg: '#eff6ff', color: '#2563eb' };
      case 'closed': return { bg: '#f3f4f6', color: '#6b7280' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const filteredPrayerRequests = prayerRequests.filter(prayer => {
    const matchesSearch = prayer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.prayerRequest?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || prayer.status === filterStatus;
    const matchesCategory = !filterCategory || prayer.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading prayer requests...</p>
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
      {/* Prayers Content Only - Remove all sidebar/nav/scroll indicator */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Prayer Request Management
        </h1>
        <p style={{
          fontSize: '16px',
        color: '#6b7280'
        }}>
          Manage and respond to prayer requests from your congregation
        </p>
      </div>

      {/* Error Message */}
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

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
          gap: '16px'
        }}>
          {/* Search */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Search Requests
            </label>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Search by name, subject, or request..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="praying">Praying</option>
              <option value="answered">Answered</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">All Categories</option>
              <option value="healing">Healing</option>
              <option value="deliverance">Deliverance</option>
              <option value="provision">Provision</option>
              <option value="relationship">Relationship</option>
              <option value="family">Family</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prayer Requests Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {filteredPrayerRequests.map((prayer) => (
          <motion.div
            key={prayer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${prayer.isAnswered ? '#10b981' : '#e5e7eb'}`
            }}
          >
            {/* Prayer Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {getCategoryIcon(prayer.category)}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {prayer.subject}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    textTransform: 'capitalize'
                  }}>
                    {prayer.category}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                {prayer.isConfidential && (
                  <FaLock size={12} color="#6b7280" title="Confidential" />
                )}
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '500',
                  ...getStatusColor(prayer.status)
                }}>
                  {prayer.status}
                </span>
              </div>
            </div>

            {/* Prayer Content */}
            <div style={{ padding: '16px' }}>
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
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
                  {prayer.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '2px'
                  }}>
                    {prayer.name}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {prayer.email}
                  </p>
                </div>
              </div>

              {/* Prayer Request */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {prayer.prayerRequest}
                </p>
              </div>

              {/* Prayer Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <FaCalendarAlt size={12} />
                  Submitted {new Date(prayer.createdAt).toLocaleDateString()}
                </div>

                {prayer.response && (
                  <div style={{
                    backgroundColor: '#eff6ff',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #dbeafe'
                  }}>
                    <p style={{
                      fontSize: '12px',
                      color: '#1e40af',
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      Response:
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#1e40af',
                      lineHeight: '1.4'
                    }}>
                      {prayer.response}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedPrayer(prayer);
                    setShowPrayerModal(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <FaEye size={12} /> View
                </motion.button>

                {!prayer.isAnswered && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedPrayer(prayer);
                      setShowResponseModal(true);
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaReply size={12} />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusUpdate(prayer._id, 
                    prayer.status === 'pending' ? 'praying' : 
                    prayer.status === 'praying' ? 'answered' : 'closed'
                  )}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FaCheck size={12} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrayerRequests.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <FaPray size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
            No prayer requests found
          </h3>
          <p style={{ fontSize: '14px' }}>
            {searchTerm || filterStatus || filterCategory 
              ? 'Try adjusting your filters or search terms'
              : 'No prayer requests have been submitted yet'
            }
          </p>
        </div>
      )}

      {/* Prayer Detail Modal */}
      <AnimatePresence>
        {showPrayerModal && selectedPrayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowPrayerModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '20px',
                  zIndex: 10,
                }}
                aria-label="Close"
              >
                <FaTimes />
              </button>
              
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                {selectedPrayer.subject}
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2a1e7a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {selectedPrayer.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {selectedPrayer.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedPrayer.email}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '16px'
                }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    ...getStatusColor(selectedPrayer.status)
                  }}>
                    {selectedPrayer.status}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280'
                  }}>
                    {selectedPrayer.category}
                  </span>
                  {selectedPrayer.isConfidential && (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaLock size={10} />
                      Confidential
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Prayer Request:
                </h4>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                  {selectedPrayer.prayerRequest}
                </p>
              </div>
              
              {selectedPrayer.response && (
                <div style={{
                  backgroundColor: '#eff6ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #dbeafe'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                    Response:
                  </h4>
                  <p style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.6' }}>
                    {selectedPrayer.response}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    Responded on {new Date(selectedPrayer.respondedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}>
                Submitted on {new Date(selectedPrayer.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && selectedPrayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '500px',
                width: '100%',
                position: 'relative',
              }}
            >
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setResponseText('');
                  setSelectedPrayer(null);
                }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '20px',
                  zIndex: 10,
                }}
                aria-label="Close"
              >
                <FaTimes />
              </button>
              
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Respond to Prayer Request
              </h2>
              
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                Send a response to {selectedPrayer.name} regarding their prayer request.
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Your Response *
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                    setSelectedPrayer(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleResponse(selectedPrayer._id)}
                  disabled={!responseText.trim()}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: responseText.trim() ? '#10b981' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: responseText.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  Send Response
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPrayers; 