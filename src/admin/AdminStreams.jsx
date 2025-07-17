import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlay, 
  FaPause,
  FaYoutube,
  FaFacebook,
  FaVideo,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaStar,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaMobile,
  FaDesktop,
  FaPray,
  FaHandsHelping,
  FaFireAlt,
  FaHeart,
  FaRegSadTear
} from 'react-icons/fa';
import axios from 'axios';

const AdminStreams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState('');
  const [previewStream, setPreviewStream] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchStreams();
  }, []);

  // Removed scroll indicator effect

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/streams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStreams(response.data.streams || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
      setError('Failed to fetch streams');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStream = async (streamData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5000/api/admin/stream', streamData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStreams([response.data.stream, ...streams]);
      setShowForm(false);
      setEditingStream(null);
    } catch (error) {
      console.error('Error adding stream:', error);
      setError(error.response?.data?.message || 'Failed to add stream');
    }
  };

  const handleUpdateStream = async (id, streamData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`http://localhost:5000/api/admin/stream/${id}`, streamData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStreams(streams.map(stream => 
        stream._id === id ? response.data.stream : stream
      ));
      setShowForm(false);
      setEditingStream(null);
    } catch (error) {
      console.error('Error updating stream:', error);
      setError(error.response?.data?.message || 'Failed to update stream');
    }
  };

  const handleDeleteStream = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stream?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/admin/stream/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStreams(streams.filter(stream => stream._id !== id));
    } catch (error) {
      console.error('Error deleting stream:', error);
      setError(error.response?.data?.message || 'Failed to delete stream');
    }
  };

  const handleToggleLive = async (id, isLive) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(`http://localhost:5000/api/admin/stream/${id}/toggle-live`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStreams(streams.map(stream => 
        stream._id === id ? response.data.stream : stream
      ));
    } catch (error) {
      console.error('Error toggling stream status:', error);
      setError(error.response?.data?.message || 'Failed to toggle stream status');
    }
  };

  const getStreamIcon = (streamType) => {
    switch (streamType) {
      case 'youtube': return <FaYoutube size={20} color="#FF0000" />;
      case 'facebook': return <FaFacebook size={20} color="#1877F2" />;
      case 'castr': return <FaVideo size={20} color="#2a1e7a" />;
      default: return <FaVideo size={20} color="#6b7280" />;
    }
  };

  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || stream.streamType === filterType;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && stream.isActive) ||
                         (filterStatus === 'inactive' && !stream.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
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
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading streams...</p>
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
      padding: isMobile ? '80px 16px 24px' : '24px',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '32px',
        gap: isMobile ? '16px' : '0'
      }}>
        <div>
          <h1 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Stream Management
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#6b7280'
          }}>
            Manage your church's live streams and video content
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(true);
            setEditingStream(null);
          }}
          style={{
            padding: isMobile ? '12px 20px' : '14px 24px',
            backgroundColor: '#2a1e7a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            alignSelf: isMobile ? 'stretch' : 'auto'
          }}
        >
          <FaPlus /> Add New Stream
        </motion.button>
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
              Search Streams
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
                placeholder="Search by title or description..."
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

          {/* Type Filter */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Stream Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">All Types</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="castr">Castr</option>
              <option value="vimeo">Vimeo</option>
              <option value="twitch">Twitch</option>
              <option value="other">Other</option>
            </select>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Streams Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredStreams.map((stream) => (
          <motion.div
            key={stream._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${stream.isLive ? '#10b981' : '#e5e7eb'}`
            }}
          >
            {/* Stream Header */}
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
                {getStreamIcon(stream.streamType)}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {stream.title}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    textTransform: 'capitalize'
                  }}>
                    {stream.streamType}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleLive(stream._id, stream.isLive)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: stream.isLive ? '#10b981' : '#6b7280',
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
                  {stream.isLive ? <FaPlay size={10} /> : <FaPause size={10} />}
                  {stream.isLive ? 'Live' : 'Offline'}
                </motion.button>
              </div>
            </div>

            {/* Stream Content */}
            <div style={{ padding: '16px' }}>
              {stream.description && (
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  {stream.description}
                </p>
              )}

              {/* Stream Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {stream.scheduledDate && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <FaCalendarAlt size={12} />
                    {new Date(stream.scheduledDate).toLocaleDateString()}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <FaClock size={12} />
                  Created {new Date(stream.createdAt).toLocaleDateString()}
                </div>

                {stream.tags && stream.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <FaTag size={12} />
                    {stream.tags.join(', ')}
                  </div>
                )}
              </div>

              {/* Stream Reactions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Reactions:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}><FaPray size={14} /> {stream.reactions?.amen || 0}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}><FaHandsHelping size={14} /> {stream.reactions?.praise || 0}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}><FaFireAlt size={14} /> {stream.reactions?.fire || 0}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ec4899' }}><FaHeart size={14} /> {stream.reactions?.heart || 0}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1' }}><FaRegSadTear size={14} /> {stream.reactions?.sad || 0}</span>
              </div>

              {/* Stream URL Preview */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Stream URL:
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#1f2937',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace'
                }}>
                  {stream.streamUrl}
                </p>
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
                  onClick={() => setPreviewStream(stream)}
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
                  <FaEye size={12} /> Preview
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingStream(stream);
                    setShowForm(true);
                  }}
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
                  <FaEdit size={12} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteStream(stream._id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#ef4444',
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
                  <FaTrash size={12} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStreams.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <FaVideo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
            No streams found
          </h3>
          <p style={{ fontSize: '14px' }}>
            {searchTerm || filterType || filterStatus 
              ? 'Try adjusting your filters or search terms'
              : 'Get started by adding your first stream'
            }
          </p>
        </div>
      )}

      {/* Stream Form Modal */}
      <AnimatePresence>
        {showForm && (
          <StreamForm
            stream={editingStream}
            onClose={() => {
              setShowForm(false);
              setEditingStream(null);
            }}
            onSubmit={editingStream ? handleUpdateStream : handleAddStream}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewStream && (
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
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setPreviewStream(null)}
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
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>{previewStream.title}</h2>
              <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                <iframe
                  src={getEmbedUrl(previewStream)}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Stream Preview"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StreamForm = ({ stream, onClose, onSubmit, isMobile }) => {
  const [formData, setFormData] = useState({
    title: stream?.title || '',
    description: stream?.description || '',
    streamUrl: stream?.streamUrl || '',
    scheduledDate: stream?.scheduledDate ? new Date(stream.scheduledDate).toISOString().split('T')[0] : '',
    tags: stream?.tags?.join(', ') || '',
    isFeatured: stream?.isFeatured || false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (stream) {
        await onSubmit(stream._id, submitData);
      } else {
        await onSubmit(submitData);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000
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
          maxWidth: isMobile ? '100%' : '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
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
        <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {stream ? 'Edit Stream' : 'Add New Stream'}
          </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Stream Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.title ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#374151'
                }}
                placeholder="Enter stream title"
              />
              {errors.title && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  minHeight: '80px',
                  color: '#374151'
                }}
                placeholder="Enter stream description (optional)"
              />
            </div>

            {/* Stream URL */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Stream URL *
              </label>
              <input
                type="url"
                name="streamUrl"
                value={formData.streamUrl}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#374151'
                }}
                placeholder="Enter the full stream URL (e.g., https://www.youtube.com/watch?v=...)"
              />
              {errors.streamUrl && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.streamUrl}
                </p>
              )}
              <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                Supported formats:<br />
                YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID<br />
                Facebook: https://www.facebook.com/...<br />
                Castr: https://app.castr.io/player/...<br />
                Vimeo, Twitch, etc. are also supported.
              </p>
            </div>

            {/* Scheduled Date */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Scheduled Date (optional)
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#374151'
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#374151'
                }}
                placeholder="e.g., sermon, worship, children's"
              />
            </div>

            {/* Is Featured */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                style={{ width: '16px', height: '16px', accentColor: '#2a1e7a' }}
              />
              <label style={{ fontSize: '14px', color: '#374151' }}>
                Mark as Featured
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2a1e7a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #2a1e7a',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <>
                  <FaCheck />
                  {stream ? 'Update Stream' : 'Add Stream'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Add a helper function to get a valid embed URL for preview
function getEmbedUrl(stream) {
  if (!stream) return '';
  // Prefer backend embedUrl if present and looks like an embed
  if (stream.embedUrl && stream.embedUrl.includes('embed')) return stream.embedUrl;
  if (stream.streamUrl) {
    let url = stream.streamUrl;
    let videoId = '';
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/live/')) {
      videoId = url.split('live/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    // Facebook
    if (url.includes('facebook.com/')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=false`;
    }
    // Add more platforms as needed...
  }
  return stream.embedUrl || stream.streamUrl;
}

export default AdminStreams;