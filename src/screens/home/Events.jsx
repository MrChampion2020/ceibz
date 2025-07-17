import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import api from '../../api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/api/events/upcoming`);
      setEvents(response.data.events || []);
    } catch (error) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = (event) => {
    // Generate ICS file content
    const pad = (n) => n < 10 ? '0' + n : n;
    const formatDate = (date) => {
      const d = new Date(date);
      return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
    };
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDESCRIPTION:${event.description || ''}\nDTSTART:${formatDate(event.startDate)}\n${event.endDate ? `DTEND:${formatDate(event.endDate)}\n` : ''}LOCATION:${event.location || ''}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent.replace(/\n/g, '\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '24px' }}>Upcoming Events</h1>
      {error && <div style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</div>}
      {loading ? (
        <div>Loading events...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {events.map(event => (
            <div key={event._id} style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaCalendarAlt size={20} color="#f59e0b" />
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>{event.title}</h2>
              </div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '8px' }}>{event.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}>
                <FaClock /> {new Date(event.startDate).toLocaleString()} {event.endDate ? ' - ' + new Date(event.endDate).toLocaleString() : ''}
              </div>
              {event.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}><FaMapMarkerAlt /> {event.location}</div>}
              {event.imageUrl && <img src={event.imageUrl} alt="Event" style={{ width: '100%', borderRadius: '8px', marginTop: '8px', maxHeight: '180px', objectFit: 'cover' }} />}
              <button onClick={() => handleAddToCalendar(event)} style={{ marginTop: '12px', padding: '10px 16px', backgroundColor: '#2a1e7a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><FaPlus /> Add to Calendar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events; 