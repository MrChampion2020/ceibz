import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaUserShield, FaUser, FaComments } from 'react-icons/fa';
import api from '../api';

const AdminChat = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch chat list
  const fetchChatList = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${api}/api/admin/general-chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatList(res.data.chats || []);
    } catch (err) {
      setError('Failed to fetch chat list');
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${api}/api/admin/general-chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
      setParticipants(res.data.participants || []);
    } catch (err) {
      setMessages([]);
      setParticipants([]);
    }
  };

  // Poll for chat list
  useEffect(() => {
    fetchChatList();
    const interval = setInterval(fetchChatList, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll for messages in selected chat
  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages(selectedChat._id);
    const interval = setInterval(() => fetchMessages(selectedChat._id), 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  // Send admin reply
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.post(`${api}/api/admin/general-chat/${selectedChat._id}/reply`, {
        message: newMessage.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages(selectedChat._id);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Chat List */}
      <div style={{ width: 320, background: 'white', borderRight: '1px solid #e5e7eb', color: 'black',  padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FaComments /> Quick Chats</h2>
        {chatList.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center' }}>No chats yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {chatList.map(chat => {
              const user = chat.participants.find(p => !p.isAdmin);
              return (
                <li key={chat._id} style={{ marginBottom: 12 }}>
                  <button
                    onClick={() => setSelectedChat(chat)}
                    style={{
                      width: '100%',
                      background: selectedChat && selectedChat._id === chat._id ? '#f3f4f6' : 'transparent',
                      border: 'none',
                      borderRadius: 6,
                      padding: '12px 10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2a1e7a' }}>
                      <FaUser />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{user?.name || user?.email || 'User/Guest'}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{user?.email}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {/* Chat Room */}
      <div style={{ flex: 1, color: 'black', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {selectedChat ? (
          <>
            <div style={{ marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 0 }}>Chat with {participants.find(p => !p.isAdmin)?.name || participants.find(p => !p.isAdmin)?.email || 'User/Guest'}</h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb', padding: 12 }}>
              {messages.length === 0 ? (
                <div style={{ color: '#6b7280', textAlign: 'center' }}>No messages yet.</div>
              ) : (
                messages.map((msg, idx) => {
                  const isSender = (msg.sender && msg.sender.isAdmin);
                  return (
                    <div
                      key={idx}
                      style={{
                        marginBottom: 16,
                        display: 'flex',
                        flexDirection: isSender ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        gap: 10,
                        justifyContent: isSender ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: msg.sender.isAdmin ? '#2a1e7a' : '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.sender.isAdmin ? 'white' : '#2a1e7a' }}>
                        {msg.sender.isAdmin ? <FaUserShield /> : <FaUser />}
                      </div>
                      <div style={{ textAlign: isSender ? 'right' : 'left' }}>
                        <div style={{ fontWeight: 500, color: msg.sender.isAdmin ? '#2a1e7a' : '#111' }}>{msg.sender.name || (msg.sender.isAdmin ? 'Admin' : 'User/Guest')}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}</div>
                        <div style={{ fontSize: 15, color: '#111', background: isSender ? '#e0e7ff' : '#f3f4f6', borderRadius: 8, padding: '8px 12px', display: 'inline-block', maxWidth: 300 }}>{msg.message}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message as admin..."
                style={{ flex: 1, padding: 12, borderRadius: 4, border: '1px solid #d1d5db', fontSize: 15, color: '#111' }}
                disabled={loading}
              />
              <button
                type="submit"
                style={{ padding: '0 18px', background: '#2a1e7a', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                disabled={loading || !newMessage.trim()}
              >
                <FaPaperPlane /> Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ color: '#6b7280', textAlign: 'center', marginTop: 100, fontSize: 18 }}>Select a chat to view messages.</div>
        )}
      </div>
    </div>
  );
};

export default AdminChat; 