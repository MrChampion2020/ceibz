import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StreamForm from './AdminStreamForm';
import StreamList from './AdminStreamList';
import StreamPreview from './AdminStreamPreview';
import CommentSection from './AdminCommentSection';

const AdminScreen = () => {
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);

  // Fetch all streams when the component mounts
  useEffect(() => {
    fetchStreams();
  }, []);

  // Fetch streams from the backend
  const fetchStreams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/streams');
      setStreams(response.data);
    } catch (error) {
      console.error('Error fetching streams', error);
    }
  };

  // Handle the selection of a stream for preview
  const handleStreamSelect = (stream) => {
    setSelectedStream(stream); // Set the selected stream for preview
  };


  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8f8f8',
      borderRadius: '8px',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Admin Screen Content Only - Remove all sidebar/nav/layout */}
      <h1>Admin Dashboard</h1>
      {/* Stream Form for adding/updating streams */}
      <StreamForm fetchStreams={fetchStreams} />
      {/* Stream Preview Section */}
      {selectedStream && (
        <StreamPreview streamUrl={selectedStream.streamUrl} />
      )}
      {/* Stream List */}
      <StreamList streams={streams} onSelectStream={handleStreamSelect} fetchStreams={fetchStreams} />
      {/* Comment Section */}
      {selectedStream && (
        <CommentSection streamId={selectedStream._id} />
      )}
    </div>
  );
};

export default AdminScreen; 