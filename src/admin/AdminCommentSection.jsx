// src/components/CommentSection.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaUser, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaFlag, FaShieldAlt, FaExclamationTriangle, FaReply, FaQuoteLeft, FaQuoteRight, FaStar, FaHeart, FaPray, FaHandsHelping, FaFireAlt, FaRegSadTear } from 'react-icons/fa';
import axios from 'axios';
import api from '../api';

const CommentSection = ({ streamId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, [streamId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${api}/api/user/comments/${streamId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  const handleReaction = async (commentId, reactionType) => {
    try {
      await axios.put(`${api}/api/user/comment/${commentId}/reaction`, { reactionType });
      fetchComments(); // Refresh comments to update reactions
    } catch (error) {
      console.error('Error updating reaction', error);
    }
  };

  return (
    <div style={styles.comments}>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id} style={styles.comment}>
            <p>{comment.content}</p>
            <div>
              <button onClick={() => handleReaction(comment._id, 'thumbsUp')}>
                👍 {comment.reactions.thumbsUp}
              </button>
              <button onClick={() => handleReaction(comment._id, 'heart')}>
                ❤️ {comment.reactions.heart}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  comments: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  comment: {
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
};

export default CommentSection; 