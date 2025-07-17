import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaTimes, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import api from '../api';

console.log('import.meta.env:', import.meta.env); // DEBUG: Check available env variables

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${api}/api/admin/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.events || []);
    } catch (error) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${api}/api/admin/event`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents([response.data.event, ...events]);
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add event');
    }
  };

  const handleUpdateEvent = async (id, eventData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${api}/api/admin/event/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.map(event => event._id === id ? response.data.event : event));
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${api}/api/admin/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>Event Management</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Manage upcoming church events</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowForm(true); setEditingEvent(null); }}
          style={{ padding: '14px 24px', backgroundColor: '#2a1e7a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Add New Event
        </motion.button>
      </div>
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}><FaTimes /></button>
        </motion.div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {events.map(event => (
          <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaCalendarAlt size={20} color="#f59e0b" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{event.title}</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{event.location}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setEditingEvent(event); setShowForm(true); }} style={{ padding: '6px 12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><FaEdit size={12} /></motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteEvent(event._id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><FaTrash size={12} /></motion.button>
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.5' }}>{event.description}</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                <span><FaCalendarAlt size={12} /> {new Date(event.startDate).toLocaleString()} {event.endDate ? ' - ' + new Date(event.endDate).toLocaleString() : ''}</span>
                {event.location && <span>{event.location}</span>}
              </div>
              {event.imageUrl && <img src={event.imageUrl} alt="Event" style={{ width: '100%', borderRadius: '8px', marginTop: '8px', maxHeight: '180px', objectFit: 'cover' }} />}
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {showForm && (
          <EventForm
            event={editingEvent}
            onClose={() => { setShowForm(false); setEditingEvent(null); }}
            onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const EventForm = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    location: event?.location || '',
    imageUrl: event?.imageUrl || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    form.append('folder', 'ceibz1'); // Upload to ceibz1 folder
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', CLOUDINARY_UPLOAD_URL);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setFormData(prev => ({ ...prev, imageUrl: res.secure_url }));
        } else {
          alert('Image upload failed');
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        alert('Image upload failed');
      };
      xhr.send(form);
    } catch (err) {
      setUploading(false);
      alert('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const submitData = { ...formData };
      if (event) {
        await onSubmit(event._id, submitData);
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '20px', zIndex: 10 }} aria-label="Close"><FaTimes /></button>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>{event ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Event Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: `1px solid ${errors.title ? '#ef4444' : '#d1d5db'}`, borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#374151' }} placeholder="Enter event title" />
            {errors.title && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', minHeight: '80px', color: '#374151' }} placeholder="Enter event description (optional)" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Start Date & Time *</label>
            <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#374151' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>End Date & Time</label>
            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#374151' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#374151' }} placeholder="e.g., Church Auditorium" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Event Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '8px' }} />
            {uploading && <div style={{ fontSize: '12px', color: '#2a1e7a' }}>Uploading... {uploadProgress}%</div>}
            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginTop: '8px', maxHeight: '120px', objectFit: 'cover' }} />}
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading} style={{ padding: '12px 24px', backgroundColor: '#2a1e7a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? (<div style={{ width: '20px', height: '20px', border: '3px solid #f3f3f3', borderTop: '3px solid #2a1e7a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>) : (<><FaCheck />{event ? 'Update Event' : 'Add Event'}</>)}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminEvents; 