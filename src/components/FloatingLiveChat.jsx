import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaUserShield, FaUser, FaComments } from 'react-icons/fa';
import api from '../api';

const FloatingLiveChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const chatRef = useRef(null);

  // On mount, get user info from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('livestreamUserData');
    if (stored) {
      const data = JSON.parse(stored);
      setUser({ name: data.name, email: data.email, userId: data.id });
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Poll for messages if chatId exists
  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      try {
        // Use the user/guest endpoint for fetching chat messages
        const res = await axios.get(`${api}/api/user/general-chat/${chatId}/messages`);
        setMessages(res.data.messages || []);
      } catch {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  // Start or send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!user) {
      setError('Please enter your name and email to start chat.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${api}/api/user/general-chat`, {
        name: user.name,
        email: user.email,
        userId: user.userId,
        message: input.trim(),
      });
      setInput('');
      setChatId(res.data.chatId);
    } catch {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Handle user info submit (if not logged in)
  const handleUserInfo = (e) => {
    e.preventDefault();
    if (!input.trim() || !input.includes('@')) {
      setError('Please enter a valid name and email (e.g. John Doe <john@example.com>)');
      return;
    }
    // Parse "Name <email>"
    const match = input.match(/^(.*)<(.*)>$/);
    if (!match) {
      setError('Format: Name <email@example.com>');
      return;
    }
    const name = match[1].trim();
    const email = match[2].trim();
    if (!name || !email) {
      setError('Both name and email are required');
      return;
    }
    const userData = { name, email };
    localStorage.setItem('livestreamUserData', JSON.stringify(userData));
    setUser(userData);
    setInput('');
    setError('');
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      <button
        onClick={() => setShowChat((v) => !v)}
        style={{ background: '#2a1e7a', color: 'white', border: 'none', borderRadius: '50%', width: 56, height: 56, fontSize: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer' }}
        title="Live Chat"
      >
            <FaComments />
      </button>
      {showChat && (
        <div style={{ position: 'absolute', bottom: 70, right: 0, width: 340, background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '70vh', height: '70vh' }}>
          <div style={{ background: '#2a1e7a', color: 'white', padding: '14px 18px', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaComments /> Quick Chat
            <button onClick={() => setShowChat(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>&times;</button>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f9fafb' }}>
            {messages.length === 0 ? (
              <div style={{ color: '#6b7280', textAlign: 'center', marginTop: 40 }}>No messages yet. Start a chat below.</div>
            ) : (
              messages.map((msg, idx) => {
                const isSender = user && msg.sender && msg.sender.email === user.email && !msg.sender.isAdmin;
                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: 16,
            display: 'flex',
                      flexDirection: isSender ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 10,
                      justifyContent: isSender ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.sender.isAdmin ? '#2a1e7a' : '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.sender.isAdmin ? 'white' : '#2a1e7a' }}>
                      {msg.sender.isAdmin ? <FaUserShield /> : <FaUser />}
                    </div>
                    <div style={{ textAlign: isSender ? 'right' : 'left', alignItems: isSender ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 500, color: msg.sender.isAdmin ? '#2a1e7a' : '#111', alignSelf: isSender ? 'flex-end' : 'flex-start' }}>{msg.sender.name || (msg.sender.isAdmin ? 'Admin' : 'You')}</div>
                      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4, alignSelf: isSender ? 'flex-end' : 'flex-start' }}>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}</div>
                      <div style={{ fontSize: 15, color: '#111', background: isSender ? '#e0e7ff' : '#f3f4f6', borderRadius: 8, padding: '8px 12px', display: 'inline-block', maxWidth: 200, alignSelf: isSender ? 'flex-end' : 'flex-start' }}>{msg.message}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <form onSubmit={user ? handleSend : handleUserInfo} style={{ display: 'flex', gap: 8, borderTop: '1px solid #e5e7eb', padding: 12, background: 'white' }}>
            {user ? (
              <>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #d1d5db', fontSize: 15, color: '#111', '::placeholder': { color: '#111' } }}
                  disabled={loading}
                />
                <button
                  type="submit"
                  style={{ padding: '0 14px', background: '#2a1e7a', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  disabled={loading || !input.trim()}
                >
                  <FaPaperPlane />
                </button>
              </>
            ) : (
              <>
                      <input
                        type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter Name <email@example.com> to start chat"
                  style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #d1d5db', fontSize: 15, color: '#111', '::placeholder': { color: '#111' } }}
                  disabled={loading}
                      />
                      <button
                        type="submit"
                  style={{ padding: '0 14px', background: '#2a1e7a', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  disabled={loading || !input.trim()}
                >
                  Start
                      </button>
              </>
            )}
          </form>
          {error && <div style={{ color: '#dc2626', padding: 8, textAlign: 'center' }}>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default FloatingLiveChat; 