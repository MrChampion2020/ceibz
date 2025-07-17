// src/components/StreamList.jsx

import React from 'react';
import axios from 'axios';

const StreamList = ({ streams, onSelectStream, fetchStreams }) => {
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/stream/${id}`);
      fetchStreams(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting stream', error);
    }
  };

  return (
    <div style={styles.streamList}>
      <h3>Active Streams</h3>
      <ul>
        {streams.map((stream) => (
          <li key={stream._id} style={styles.streamItem}>
            <span onClick={() => onSelectStream(stream)} style={styles.link}>
              {stream.streamUrl}
            </span>
            <button onClick={() => handleDelete(stream._id)} style={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  streamList: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  streamItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default StreamList; 