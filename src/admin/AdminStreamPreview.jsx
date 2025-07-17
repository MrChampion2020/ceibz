import React from 'react';

const StreamPreview = ({ streamUrl }) => {
  let embedUrl = streamUrl;

  // Extract the video ID from the URL for YouTube Live or regular videos
  if (embedUrl.includes('youtube.com/live/') || embedUrl.includes('watch?v=')) {
    const videoId = embedUrl.split('/').pop().split('?')[0]; // Extract VIDEO_ID from live or watch URLs
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  // Convert shortened URLs (youtu.be) to embed format
  if (embedUrl.includes('youtu.be')) {
    const videoId = embedUrl.split('/').pop(); // Extract VIDEO_ID from shortened URLs
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  // Ensure mobile URLs (m.youtube.com) are converted to desktop URLs
  if (embedUrl.includes('m.youtube.com')) {
    embedUrl = embedUrl.replace('m.youtube.com', 'www.youtube.com');
  }

  return (
    <div style={styles.preview}>
      <h3>Stream Preview</h3>
      <div style={styles.videoWrapper}>
        <iframe
          src={embedUrl}  // Use the corrected embed URL
          style={styles.iframe}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Live Stream"
        ></iframe>
      </div>
    </div>
  );
};

const styles = {
  preview: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    maxWidth: '100%',
    backgroundColor: '#000', // To handle cases where the video doesn't load
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
};

export default StreamPreview; 