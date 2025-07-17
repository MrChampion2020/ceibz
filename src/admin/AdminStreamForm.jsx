import React, { useState } from 'react';
import axios from 'axios';

const StreamForm = ({ fetchStreams }) => {
  const [streamUrl, setStreamUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Post request to the backend with the stream URL
      const response = await axios.post('http://localhost:5000/api/admin/stream', { streamUrl });
      console.log('Stream added successfully:', response.data);
      setStreamUrl(''); // Clear input field after successful submission
      fetchStreams(); // Call the parent function to refresh stream list
    } catch (error) {
      // Improved error handling
      if (error.response) {
        console.error('Error response from server:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server:', error.request);
      } else {
        console.error('Axios error:', error.message);
      }
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3>Add a New Stream</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="YouTube Stream URL"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Add Stream</button>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  input: {
    width: '80%',
    padding: '10px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: '#374151',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default StreamForm; 