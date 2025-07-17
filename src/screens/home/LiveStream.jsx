import { useState, useRef, useEffect } from "react"
import { useMediaQuery } from "react-responsive"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import FloatingLiveChat from "../../components/FloatingLiveChat"
import { useTheme } from "../../components/ThemeProvider"
import { useNavigate } from "react-router-dom"
import bannerImage from "../../assets/pjoe2.jpg"

import {
  FaYoutube,
  FaFacebook,
  FaPlay,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUsers,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHeart,
  FaComment,
  FaShare,
  FaPray,
  FaFileAlt,
  FaPaperPlane,
  FaSmile,
  FaHandsHelping,
  FaFireAlt,
  FaRegSadTear,
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaVideo,
  FaGlobe,
  FaCalendarAlt,
} from "react-icons/fa"

import api from '../../api';
import axios from 'axios';

// Reaction options
const reactionOptions = [
  { id: "amen", icon: <FaPray />, label: "Amen", color: "#f59e0b" },
  { id: "praise", icon: <FaHandsHelping />, label: "Praise God", color: "#10b981" },
  { id: "fire", icon: <FaFireAlt />, label: "Fire", color: "#ef4444" },
  { id: "heart", icon: <FaHeart />, label: "Love", color: "#ec4899" },
  { id: "sad", icon: <FaRegSadTear />, label: "Need Prayer", color: "#6366f1" },
]

// Sample comments
const sampleComments = [
  {
    id: 1,
    user: "Sister Mary",
    message: "Amen! This message is exactly what I needed today.",
    timestamp: "2 minutes ago",
    reactions: { amen: 5, praise: 2 },
  },
  {
    id: 2,
    user: "Brother James",
    message: "Praise God for this powerful word! My faith is strengthened.",
    timestamp: "5 minutes ago",
    reactions: { praise: 8, fire: 3 },
  },
  {
    id: 3,
    user: "Pastor Daniel",
    message: "Let's continue to pray for those who are sick in our congregation.",
    timestamp: "10 minutes ago",
    reactions: { amen: 12, heart: 7 },
  },
  {
    id: 4,
    user: "Sister Elizabeth",
    message: "I'm receiving my healing right now in Jesus' name!",
    timestamp: "12 minutes ago",
    reactions: { praise: 10, fire: 5 },
  },
  {
    id: 5,
    user: "Brother Michael",
    message: "The presence of God is so strong even through this livestream!",
    timestamp: "15 minutes ago",
    reactions: { amen: 15, heart: 8 },
  },
]

// Helper to get a valid embed URL for a stream
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

const LiveStream = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" })
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" })
  const { theme } = useTheme()
  const navigate = useNavigate()

  // State variables
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [showGuestPrompt, setShowGuestPrompt] = useState(false)
  const [selectedStream, setSelectedStream] = useState(null)
  const [showStreamOptions, setShowStreamOptions] = useState(true)
  const [showComments, setShowComments] = useState(true)
  const [showTestimonyForm, setShowTestimonyForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [comments, setComments] = useState(sampleComments)
  const [newComment, setNewComment] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [activeTab, setActiveTab] = useState("comments")
  const [streamSources, setStreamSources] = useState([]);
  const [streamsLoading, setStreamsLoading] = useState(true);
  const [streamsError, setStreamsError] = useState('');
  const [hasNewComments, setHasNewComments] = useState(false);
  const [lastCommentCount, setLastCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');
  // Add chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Form data
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    audienceSize: "1",
    expectations: "",
  })

  const [testimonyData, setTestimonyData] = useState({
    name: "",
    email: "",
    title: "",
    testimony: "",
    sharePublicly: false,
  })

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // Refs
  const commentsRef = useRef(null)
  const streamContainerRef = useRef(null)

  // Move this to the top-level of LiveStream component:
  const fetchComments = async () => {
    if (!selectedStream || !selectedStream._id) {
      setComments([]);
      return;
    }
    try {
      if (activeTab === 'comments') {
        // Fetch comments
        const response = await axios.get(`${api}/api/user/comments/${selectedStream._id}`);
        console.log('Fetched comments from backend:', response.data); // DEBUG LOG
        const formattedComments = response.data.map(msg => ({
          id: msg._id,
          user: msg.userName,
          message: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString(),
          reactions: msg.reactions || {},
          type: 'chat'
        }));
        setComments(formattedComments);
      } else {
        // Fetch chat messages (prayer)
        const response = await axios.get(`${api}/api/user/chat-messages/${selectedStream._id}?messageType=prayer`);
        const formattedComments = response.data.map(msg => ({
          id: msg._id,
          user: msg.userName,
          message: msg.message,
          timestamp: new Date(msg.createdAt).toLocaleTimeString(),
          reactions: msg.reactions || {},
          type: msg.messageType
        }));
        setComments(formattedComments);
      }
    } catch (err) {
      setComments([]);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const storedUserData = localStorage.getItem("livestreamUserData")
    if (storedUserData) {
      const userData = JSON.parse(storedUserData)
      setIsLoggedIn(true)
      setShowLoginModal(false)
      
      // Check if user is a guest
      if (userData.isGuest) {
        setIsGuest(true)
      }
      
      // Update loginData with stored data
      setLoginData(prevData => ({
        ...prevData,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        password: userData.password || "",
        audienceSize: userData.audienceSize || "1",
        expectations: userData.expectations || "",
      }))
    }
  }, [])

  // Scroll to bottom of comments when new comments are added
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight
    }
  }, [comments])

  // Fetch streams from backend
  useEffect(() => {
    const fetchStreams = async () => {
      setStreamsLoading(true);
      setStreamsError('');
      try {
        const response = await axios.get(`${api}/api/streams/active`);
        // Map backend streams to the format expected by the UI
        const mapped = response.data.map((s) => ({
          id: s._id,
          _id: s._id, // Ensure _id is present for all logic
          name: s.title,
          icon: s.streamType === 'youtube' ? <FaYoutube size={24} /> : s.streamType === 'facebook' ? <FaFacebook size={24} /> : <FaPlay size={24} />,
          color: s.streamType === 'youtube' ? '#FF0000' : s.streamType === 'facebook' ? '#1877F2' : '#2a1e7a',
          embedUrl: s.embedUrl,
          streamUrl: s.streamUrl,
          description: s.description || '',
        }));
        setStreamSources(mapped);
      } catch (err) {
        setStreamsError('Unable to load livestreams.');
        setStreamSources([]);
      } finally {
        setStreamsLoading(false);
      }
    };
    fetchStreams();
  }, []);

  // Increment view count when a stream is selected
  useEffect(() => {
    if (selectedStream && selectedStream._id) {
      axios.get(`${api}/api/stream/${selectedStream._id}`)
        .then(res => {
          setLikeCount(res.data.likeCount || 0);
        })
        .catch(() => {});
    }
  }, [selectedStream]);

  // Fetch comments when stream changes or tab changes
  useEffect(() => {
    fetchComments();
  }, [selectedStream, activeTab]);

  // Handle login form input change
  const handleLoginInputChange = (e) => {
    const { id, value, type, checked } = e.target
    setLoginData({
      ...loginData,
      [id]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: null,
      })
    }
  }

  // Handle testimony form input change
  const handleTestimonyInputChange = (e) => {
    const { id, value, type, checked } = e.target
    setTestimonyData({
      ...testimonyData,
      [id]: type === "checkbox" ? checked : value,
    })
  }

  // Handle contact form input change
  const handleContactInputChange = (e) => {
    const { id, value } = e.target
    setContactData({
      ...contactData,
      [id]: value,
    })
  }

  // Validate login form
  const validateLoginForm = () => {
    const errors = {}

    if (!loginData.name.trim()) errors.name = "Name is required"
    if (!loginData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = "Email is invalid"
    }
    if (!loginData.phone.trim()) errors.phone = "Phone is required"
    if (!loginData.location.trim()) errors.location = "Location is required"
    if (!loginData.password.trim()) errors.password = "Password is required"

    return errors
  }

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    const errors = validateLoginForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Register user with backend
      const response = await axios.post(`${api}/api/user/register`, {
        name: loginData.name,
        email: loginData.email,
        phone: loginData.phone,
        location: loginData.location,
        password: loginData.password,
        audienceSize: loginData.audienceSize,
        expectations: loginData.expectations
      });

      if (response.data.user) {
      // Store user data in localStorage
        localStorage.setItem("livestreamUserData", JSON.stringify({
          ...loginData,
          id: response.data.user._id,
          token: response.data.token
        }))
      setIsLoggedIn(true)
      setShowLoginModal(false)
        setIsGuest(false)
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setFormErrors({ general: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle guest mode
  const handleGuestMode = () => {
    setShowGuestPrompt(true)
    setShowLoginModal(false)
  }

  // Handle guest registration
  const handleGuestSubmit = async (e) => {
    e.preventDefault()
    
    if (!loginData.name.trim() || !loginData.email.trim()) {
      setFormErrors({ guest: "Name and email are required for guest access" })
      return
    }

    setIsSubmitting(true)

    try {
      // Store guest data in localStorage
      localStorage.setItem("livestreamUserData", JSON.stringify({
        name: loginData.name,
        email: loginData.email,
        isGuest: true
      }))
      setIsLoggedIn(true)
      setIsGuest(true)
      setShowGuestPrompt(false)
    } catch (error) {
      console.error('Error setting guest mode:', error);
      setFormErrors({ guest: 'Failed to set guest mode' });
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle back to login
  const handleBackToLogin = () => {
    setShowGuestPrompt(false)
    setShowLoginModal(true)
    setFormErrors({})
  }

  // Handle stream selection
  const handleStreamSelect = (stream) => {
    setSelectedStream(stream)
    setShowStreamOptions(false)
  }

  // Handle back to stream options
  const handleBackToOptions = () => {
    setSelectedStream(null)
    setShowStreamOptions(true)
  }

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStream || !selectedStream._id) {
      setError('Cannot submit comment: missing stream or stream ID');
      return;
    }
    if (!newComment.trim()) return;
    try {
      setCommentLoading(true);
      await axios.post(`${api}/api/user/comment`, {
        streamId: selectedStream._id,
        userName: loginData.name || "Anonymous",
        userEmail: loginData.email || "anonymous@example.com",
        content: newComment.trim(),
      });
      setNewComment('');
      fetchComments(); // Refresh comments from DB
    } catch (err) {
      setError('Failed to submit comment');
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle reaction to a comment
  const handleReaction = async (commentId, reactionType) => {
    try {
      const response = await axios.put(`${api}/api/user/chat-message/${commentId}/reaction`, {
        reactionType
      });

      if (response.data.chatMessage) {
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return { 
                ...comment, 
                reactions: response.data.chatMessage.reactions 
              }
            }
            return comment
          }),
        )
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
      // Fallback to local update if API fails
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const updatedReactions = { ...comment.reactions }
          updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1
          return { ...comment, reactions: updatedReactions }
        }
        return comment
      }),
    )
    }
  }

  // Handle testimony submission
  const handleTestimonySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post(`${api}/api/user/testimony`, {
        name: testimonyData.name,
        email: testimonyData.email,
        title: testimonyData.title,
        testimony: testimonyData.testimony,
        category: 'other'
      });

      if (response.data.testimony) {
      setIsSubmitting(false)
      setShowTestimonyForm(false)
      setSuccessMessage("Your testimony has been submitted successfully! Thank you for sharing.")
      setShowSuccessModal(true)
      setTestimonyData({
        name: "",
        email: "",
        title: "",
        testimony: "",
        sharePublicly: false,
      })
      }
    } catch (error) {
      console.error('Error submitting testimony:', error);
      setIsSubmitting(false)
      setSuccessMessage("There was an error submitting your testimony. Please try again.")
      setShowSuccessModal(true)
    }
  }

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post(`${api}/api/user/contact`, {
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message
      });

      if (response.data.contact) {
      setIsSubmitting(false)
      setShowContactForm(false)
      setSuccessMessage("Your message has been sent successfully! We'll get back to you soon.")
      setShowSuccessModal(true)
      setContactData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setIsSubmitting(false)
      setSuccessMessage("There was an error sending your message. Please try again.")
      setShowSuccessModal(true)
    }
  }

  // Handle reaction button click
  const handleStreamReaction = async (reactionType) => {
    if (!selectedStream || !selectedStream._id || !loginData.name || !loginData.email) {
      alert('Please select a stream and make sure you are logged in.');
      return;
    }
    try {
      await axios.post(`${api}/api/user/stream-reaction`, {
        streamId: selectedStream._id,
        userName: loginData.name,
        userEmail: loginData.email,
        reactionType
      });
      // Optionally show a toast or update UI
    } catch (error) {
      console.error('Error sending reaction:', error);
      alert('Failed to send reaction.');
    }
  };

  // Handle share button click
  const handleShare = () => {
    const shareUrl = 'https://www.ceibz1.online/';
    if (navigator.share) {
      navigator.share({
        title: 'Watch our Livestream',
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Platform stream link copied to clipboard!');
    }
  };

  // Handle like button click
  const handleLike = async () => {
    if (!selectedStream || !selectedStream._id) return;
    try {
      const res = await axios.post(`${api}/api/stream/${selectedStream._id}/like`);
      setLikeCount(res.data.likeCount || 0);
    } catch (err) {
      setError('Failed to like stream');
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const response = await axios.get(`${api}/api/events/upcoming`);
        setEvents(response.data.events || []);
      } catch (error) {
        setEventsError('Failed to fetch events');
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch chat messages for the selected stream
  const fetchChatMessages = async () => {
    if (!selectedStream || !selectedStream._id) {
      setChatMessages([]);
      return;
    }
    try {
      const response = await axios.get(`${api}/api/user/chat-messages/${selectedStream._id}?messageType=chat`);
      setChatMessages(response.data.map(msg => ({
        id: msg._id,
        user: msg.userName,
        message: msg.message,
        timestamp: new Date(msg.createdAt).toLocaleTimeString(),
        reactions: msg.reactions || {},
        type: msg.messageType
      })));
    } catch (err) {
      setChatMessages([]);
    }
  };

  // Poll for chat messages every 3 seconds when chat tab is active
  useEffect(() => {
    if (activeTab === 'chat' && selectedStream && selectedStream._id) {
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedStream]);

  // Handle chat message submit
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStream || !selectedStream._id) {
      setError('Cannot send chat: missing stream or stream ID');
      return;
    }
    if (!chatText.trim()) return;
    try {
      setChatLoading(true);
      await axios.post(`${api}/api/user/chat-message`, {
        streamId: selectedStream._id,
        userName: loginData.name || 'Anonymous',
        userEmail: loginData.email || '',
        message: chatText.trim(),
        messageType: 'chat',
      });
      setChatText('');
      fetchChatMessages();
    } catch (err) {
      setError('Failed to send chat message');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <Navbar />

      {/* User Info Display */}
      {isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: isGuest ? "#f59e0b" : "#2a1e7a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
          }}>
            {loginData.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{
              fontSize: "14px",
              fontWeight: "600",
              color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
            }}>
              {loginData.name}
            </div>
            <div style={{
              fontSize: "12px",
              color: theme === "dark" ? "#cccccc" : "#6b7280",
            }}>
              {isGuest ? "Guest User" : "Member"}
            </div>
          </div>
        </motion.div>
      )}

      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            height: "300px",
            overflow: "hidden",
            marginTop: "80px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: "cover",
              backgroundColor: "rgba(42, 30, 122, 0.8)",
              backgroundPosition: "center",
              filter: "brightness(0.6)",
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
              zIndex: 2,
              width: "90%",
              maxWidth: "800px",
            }}
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                fontSize: isMobile ? "32px" : "48px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#f59e0b",
              }}
            >
              LIVE STREAM
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                fontSize: isMobile ? "16px" : "18px",
                lineHeight: 1.6,
                marginBottom: "32px",
              }}
            >
              Join us for our live service and experience the presence of God wherever you are.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "16px",
                justifyContent: "center",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#3a2e8a" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding:  isMobile ? "14px 1px" : "14px 28px",
                  width: isMobile ? "80%" : "auto",
                  margin: isMobile ? "0 auto" : "0",
                  backgroundColor: "#2a1e7a",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
              >
                <FaPlay /> Watch Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#e08c00" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding:  isMobile ? "14px 1px" : "14px 28px",
                  width: isMobile ? "80%" : "auto",
                  margin: isMobile ? "0 auto" : "0",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onClick={() => setShowTestimonyForm(true)}
              >
                <FaFileAlt /> Share Your Testimony
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Live Stream Section */}
        <section
          style={{
            padding: isMobile ? "40px 20px" : "60px 40px",
            backgroundColor: theme === "dark" ? "#111111" : "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {showStreamOptions && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2
                  style={{
                    fontSize: isMobile ? "16px" : "24px",
                    fontWeight: "700",
                    textAlign: "center",
                    marginBottom: "16px",
                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                  }}
                >
                  Choose Your Streaming Platform
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    textAlign: "center",
                    marginBottom: "40px",
                    color: theme === "dark" ? "#cccccc" : "#4b5563",
                    maxWidth: "800px",
                    margin: "0 auto 40px",
                  }}
                >
                  Select your preferred platform to watch our live service. Each platform offers different ways to
                  interact with our community.
                </p>
                {streamsLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>Loading livestreams...</div>
                ) : streamsError ? (
                  <div style={{ textAlign: 'center', color: 'red', padding: '40px' }}>{streamsError}</div>
                ) : streamSources.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>No livestreams available at this time.</div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                      gap: "24px",
                    }}
                  >
                    {streamSources.map((source, index) => (
                      <motion.div
                        key={source.id}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                        style={{
                          backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: theme === "dark" ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                        }}
                        onClick={() => handleStreamSelect(source)}
                      >
                        <div
                          style={{
                            height: "200px",
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: source.color,
                            fontSize: "64px",
                          }}
                        >
                          {source.icon}
                        </div>

                        <div style={{ padding: "20px" }}>
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              marginBottom: "8px",
                              color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                            }}
                          >
                            {source.name}
                          </h3>
                          <p
                            style={{
                              fontSize: "14px",
                              color: theme === "dark" ? "#cccccc" : "#4b5563",
                              marginBottom: "16px",
                              lineHeight: 1.6,
                            }}
                          >
                            {source.description}
                          </p>
                          <motion.div
                            whileHover={{ x: 5 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              color: source.color,
                              fontWeight: "500",
                              fontSize: "14px",
                            }}
                          >
                            Watch Stream <FaChevronRight size={12} />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {selectedStream && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "24px",
                }}
              >
                {/* Stream Player */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    flex: showComments ? "1 1 65%" : "1 1 100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: theme === "dark" ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                      borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBackToOptions}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <FaChevronLeft /> Back to Options
                    </motion.button>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: selectedStream.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        {selectedStream.icon}
                      </div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        }}
                      >
                        {selectedStream.name}
                      </h3>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowComments(!showComments)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {showComments ? "Hide Comments" : "Show Comments"}
                    </motion.button>
                  </div>

                  <div
                    ref={streamContainerRef}
                    style={{
                      position: "relative",
                      paddingTop: "56.25%", // 16:9 aspect ratio
                      width: "100%",
                      backgroundColor: "#000",
                    }}
                  >
                    <iframe
                      src={getEmbedUrl(selectedStream)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Live Stream"
                    ></iframe>
                  </div>

                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                      borderTop: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    {/* Reaction Buttons */}
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {reactionOptions.map((reaction) => (
                        <motion.button
                          key={reaction.id}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 12px",
                            backgroundColor: theme === "dark" ? "#2a1e7a" : "#e9ecef",
                            color: reaction.color,
                            border: "none",
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                          onClick={() => handleStreamReaction(reaction.id)}
                        >
                          {reaction.icon} {reaction.label}
                        </motion.button>
                      ))}
                    </div>

                    {/* Share Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      onClick={handleShare}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 12px",
                          backgroundColor: theme === "dark" ? "#2a1e7a" : "#e9ecef",
                          color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        <FaShare /> Share
                      </motion.button>
                  </div>
                </motion.div>

                {/* Comments Section */}
                {showComments && (
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                      flex: "1 1 35%",
                      backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: theme === "dark" ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: isMobile ? "400px" : "600px",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveTab("comments");
                            setHasNewComments(false);
                          }}
                          style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor:
                              activeTab === "comments" ? (theme === "dark" ? "#2a1e7a" : "#e9ecef") : "transparent",
                            color:
                              activeTab === "comments"
                                ? theme === "dark"
                                  ? "#f59e0b"
                                  : "#2a1e7a"
                                : theme === "dark"
                                  ? "#cccccc"
                                  : "#4b5563",
                            border: `1px solid ${
                              activeTab === "comments"
                                ? theme === "dark"
                                  ? "#2a1e7a"
                                  : "#2a1e7a"
                                : theme === "dark"
                                  ? "#333"
                                  : "#e5e7eb"
                            }`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: activeTab === "comments" ? "500" : "normal",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            position: "relative"
                          }}
                        >
                          <FaComment /> Comments
                          {hasNewComments && activeTab !== "comments" && (
                            <div style={{
                              position: "absolute",
                              top: "-2px",
                              right: "-2px",
                              width: "8px",
                              height: "8px",
                              backgroundColor: "#ef4444",
                              borderRadius: "50%",
                              animation: "pulse 1s infinite"
                            }} />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("chat")}
                          style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor:
                              activeTab === "chat" ? (theme === "dark" ? "#2a1e7a" : "#e9ecef") : "transparent",
                            color:
                              activeTab === "chat"
                                ? theme === "dark"
                                  ? "#f59e0b"
                                  : "#2a1e7a"
                                : theme === "dark"
                                  ? "#cccccc"
                                  : "#4b5563",
                            border: `1px solid ${
                              activeTab === "chat"
                                ? theme === "dark"
                                  ? "#2a1e7a"
                                  : "#2a1e7a"
                                : theme === "dark"
                                  ? "#333"
                                  : "#e5e7eb"
                            }`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: activeTab === "chat" ? "500" : "normal",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <FaPaperPlane /> Live Chat
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("prayers")}
                          style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor:
                              activeTab === "prayers" ? (theme === "dark" ? "#2a1e7a" : "#e9ecef") : "transparent",
                            color:
                              activeTab === "prayers"
                                ? theme === "dark"
                                  ? "#f59e0b"
                                  : "#2a1e7a"
                                : theme === "dark"
                                  ? "#cccccc"
                                  : "#4b5563",
                            border: `1px solid ${
                              activeTab === "prayers"
                                ? theme === "dark"
                                  ? "#2a1e7a"
                                  : "#2a1e7a"
                                : theme === "dark"
                                  ? "#333"
                                  : "#e5e7eb"
                            }`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: activeTab === "prayers" ? "500" : "normal",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <FaPray /> Prayer Requests
                        </motion.button>
                      </div>

                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        }}
                      >
                        {activeTab === "comments" ? "Comments" : activeTab === "chat" ? "Live Chat" : "Prayer Requests"}
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: theme === "dark" ? "#cccccc" : "#4b5563",
                        }}
                      >
                        {activeTab === "comments"
                          ? "Join the conversation with our community"
                          : activeTab === "chat"
                          ? "Chat with others in real time"
                          : "Share your prayer needs with us"}
                      </p>
                    </div>

                    <div
                      ref={commentsRef}
                      style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {activeTab === "comments" &&
                        comments.map((comment) => (
                          <div
                            key={comment.id}
                            style={{
                              backgroundColor: theme === "dark" ? "#111111" : "#f8f9fa",
                              borderRadius: "8px",
                              padding: "12px",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    backgroundColor: theme === "dark" ? "#2a1e7a" : "#e9ecef",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                                  }}
                                >
                                  <FaUser size={14} />
                                </div>
                                <div>
                                  <p
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "500",
                                      color: theme === "dark" ? "#ffffff" : "#374151",
                                    }}
                                  >
                                    {comment.user}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color: theme === "dark" ? "#999" : "#666",
                                    }}
                                  >
                                    {comment.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <p
                              style={{
                                fontSize: "14px",
                                color: theme === "dark" ? "#cccccc" : "#4b5563",
                                marginBottom: "12px",
                                lineHeight: 1.5,
                              }}
                            >
                              {comment.message}
                            </p>

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              {Object.entries(comment.reactions || {}).map(([type, count]) => (
                                <div
                                  key={type}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 8px",
                                    backgroundColor: theme === "dark" ? "#2a1e7a" : "#e9ecef",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    color:
                                      type === "amen"
                                        ? "#f59e0b"
                                        : type === "praise"
                                          ? "#10b981"
                                          : type === "fire"
                                            ? "#ef4444"
                                            : type === "heart"
                                              ? "#ec4899"
                                              : "#6366f1",
                                  }}
                                >
                                  {type === "amen" ? (
                                    <FaPray size={12} />
                                  ) : type === "praise" ? (
                                    <FaHandsHelping size={12} />
                                  ) : type === "fire" ? (
                                    <FaFireAlt size={12} />
                                  ) : type === "heart" ? (
                                    <FaHeart size={12} />
                                  ) : (
                                    <FaRegSadTear size={12} />
                                  )}
                                  {count}
                                </div>
                              ))}

                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                }}
                              >
                                {reactionOptions.slice(0, 3).map((reaction) => (
                                  <motion.button
                                    key={reaction.id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleReaction(comment.id, reaction.id)}
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: reaction.color,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "24px",
                                      height: "24px",
                                      borderRadius: "50%",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {reaction.icon}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                      {activeTab === "chat" &&
                        chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            style={{
                              backgroundColor: theme === "dark" ? "#111111" : "#f8f9fa",
                              borderRadius: "8px",
                              padding: "12px",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: theme === "dark" ? "#2a1e7a" : "#e9ecef", display: "flex", alignItems: "center", justifyContent: "center", color: theme === "dark" ? "#f59e0b" : "#2a1e7a" }}>
                                  <FaUser size={14} />
                                </div>
                                <div>
                                  <p style={{ fontSize: "14px", fontWeight: "500", color: theme === "dark" ? "#ffffff" : "#374151" }}>{msg.user}</p>
                                  <p style={{ fontSize: "12px", color: theme === "dark" ? "#999" : "#666" }}>{msg.timestamp}</p>
                                </div>
                              </div>
                            </div>
                            <p style={{ fontSize: "14px", color: theme === "dark" ? "#cccccc" : "#4b5563", marginBottom: "12px", lineHeight: 1.5 }}>{msg.message}</p>
                          </div>
                        ))}

                      {activeTab === "prayers" &&
                        comments
                          .filter((c) => c.type === "prayer")
                          .map((comment) => (
                            <div
                              key={comment.id}
                          style={{
                            backgroundColor: theme === "dark" ? "#111111" : "#f8f9fa",
                            borderRadius: "8px",
                            padding: "16px",
                            border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                            textAlign: "center",
                          }}
                        >
                          <FaPray
                            size={32}
                            style={{
                              color: "#f59e0b",
                              marginBottom: "16px",
                            }}
                          />
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              marginBottom: "8px",
                              color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                            }}
                          >
                                {comment.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "14px",
                              color: theme === "dark" ? "#cccccc" : "#4b5563",
                              marginBottom: "16px",
                              lineHeight: 1.6,
                            }}
                          >
                                {comment.testimony}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#3a2e8a" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowContactForm(true)}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#2a1e7a",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              margin: "0 auto",
                            }}
                          >
                            <FaPray /> Submit Prayer Request
                          </motion.button>
                        </div>
                          ))}
                    </div>

                    {/* Form for each tab */}
                    {activeTab === "comments" && (
                      <form onSubmit={handleCommentSubmit}>
                    <div
                      style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Type your message..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "4px",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                              backgroundColor: theme === "dark" ? "#111" : "white",
                              color: theme === "dark" ? "#ffffff" : "#374151",
                              fontSize: "14px",
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            style={{
                              padding: "12px",
                              backgroundColor: "#2a1e7a",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaPaperPlane />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            style={{
                              padding: "12px",
                              backgroundColor: theme === "dark" ? "#1a1a1a" : "#e9ecef",
                              color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaSmile />
                          </motion.button>
                        </div>
                      </form>
                    )}
                    {activeTab === "chat" && (
                      <form onSubmit={handleChatSubmit}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder="Type your chat message..."
                            value={chatText}
                            onChange={(e) => setChatText(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "4px",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                              backgroundColor: theme === "dark" ? "#111" : "white",
                              color: theme === "dark" ? "#ffffff" : "#374151",
                              fontSize: "14px",
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            style={{
                              padding: "12px",
                              backgroundColor: "#2a1e7a",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            disabled={chatLoading}
                          >
                            <FaPaperPlane />
                          </motion.button>
                        </div>
                      </form>
                    )}
                    {activeTab === "prayers" && (
                      <form onSubmit={handleCommentSubmit}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Type your prayer request..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "4px",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                              backgroundColor: theme === "dark" ? "#111" : "white",
                              color: theme === "dark" ? "#ffffff" : "#374151",
                              fontSize: "14px",
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            style={{
                              padding: "12px",
                              backgroundColor: "#2a1e7a",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaPaperPlane />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            style={{
                              padding: "12px",
                              backgroundColor: theme === "dark" ? "#1a1a1a" : "#e9ecef",
                              color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaSmile />
                          </motion.button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* Service Schedule Section */}
        <section
          style={{
            padding: isMobile ? "40px 20px" : "60px 40px",
            backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.1,
              filter: "blur(8px)",
            }}
          />

          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: isMobile ? "16px" : "24px",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "16px",
                color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
              }}
            >
              Upcoming Live Services
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "40px",
                color: theme === "dark" ? "#cccccc" : "#4b5563",
                maxWidth: "800px",
                margin: "0 auto 40px",
              }}
            >
              Join us for our upcoming live services and experience the presence of God wherever you are.
            </motion.p>

            {eventsError && <div style={{ color: '#dc2626', marginBottom: '16px' }}>{eventsError}</div>}
            {eventsLoading ? (
              <div>Loading events...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '24px' }}>
                {events.map(event => (
                <motion.div
                    key={event._id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  style={{
                      backgroundColor: theme === 'dark' ? '#1a1a1a' : 'white',
                      borderRadius: '8px',
                      padding: '24px',
                      boxShadow: theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: `1px solid ${theme === 'dark' ? '#333' : '#e5e7eb'}`,
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', marginBottom: '16px' }}>
                      <FaCalendarAlt />
                  </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: theme === 'dark' ? '#f59e0b' : '#2a1e7a' }}>{event.title}</h3>
                    <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: theme === 'dark' ? '#ffffff' : '#000000' }}>{new Date(event.startDate).toLocaleString()}</p>
                    <p style={{ fontSize: '14px', color: theme === 'dark' ? '#cccccc' : '#4b5563', lineHeight: 1.7, marginBottom: '16px' }}>{event.description}</p>
                    {event.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}><FaMapMarkerAlt /> {event.location}</div>}
                    {event.imageUrl && <img src={event.imageUrl} alt="Event" style={{ width: '100%', borderRadius: '8px', marginTop: '8px', maxHeight: '180px', objectFit: 'cover' }} />}
                    {/* Optionally add Add to Calendar button here */}
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                borderRadius: "8px",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                margin: "40px auto",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                  }}
                >
                  Welcome to Live Stream
                </h3>
              </div>

              <div style={{ padding: "24px", overflowY: "auto" }}>
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: "24px",
                    color: theme === "dark" ? "#cccccc" : "#4b5563",
                    lineHeight: 1.6,
                  }}
                >
                  Please provide your details to access our live stream service. Your information helps us serve you
                  better and stay connected.
                </p>

                <form onSubmit={handleLoginSubmit}>
                  <div
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    <label
                      htmlFor="name"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Full Name*
                    </label>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaUser size={16} />
                      </div>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={loginData.name}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${formErrors.name ? "#ef4444" : theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    {formErrors.name && (
                      <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formErrors.name}</p>
                    )}
                  </div>

                  <div
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    <label
                      htmlFor="email"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Email Address*
                    </label>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaEnvelope size={16} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={loginData.email}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${formErrors.email ? "#ef4444" : theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    {formErrors.email && (
                      <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formErrors.email}</p>
                    )}
                  </div>

                  <div
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    <label
                      htmlFor="phone"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Phone Number*
                    </label>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaPhone size={16} />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={loginData.phone}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${formErrors.phone ? "#ef4444" : theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    {formErrors.phone && (
                      <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formErrors.phone}</p>
                    )}
                  </div>

                  <div
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    <label
                      htmlFor="location"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Location*
                    </label>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaMapMarkerAlt size={16} />
                      </div>
                      <input
                        id="location"
                        type="text"
                        placeholder="Your city and country"
                        value={loginData.location}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${formErrors.location ? "#ef4444" : theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    {formErrors.location && (
                      <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formErrors.location}</p>
                    )}
                  </div>

                  <div
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    <label
                      htmlFor="password"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Password*
                    </label>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaLock size={16} />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${formErrors.password ? "#ef4444" : theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                          cursor: "pointer",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </div>
                    </div>
                    {formErrors.password && (
                      <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formErrors.password}</p>
                    )}
                  </div>

                  <div
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    <label
                      htmlFor="audienceSize"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Audience Size
                    </label>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaUsers size={16} />
                      </div>
                      <select
                        id="audienceSize"
                        value={loginData.audienceSize}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                          appearance: "none",
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                            theme === "dark" ? "white" : "black"
                          }' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 12px center",
                          backgroundSize: "16px",
                        }}
                      >
                        <option value="1">Just me</option>
                        <option value="2-5">2-5 people</option>
                        <option value="6-10">6-10 people</option>
                        <option value="11-20">11-20 people</option>
                        <option value="20+">More than 20 people</option>
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: "24px",
                    }}
                  >
                    <label
                      htmlFor="expectations"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Expectations (Optional)
                    </label>
                    <textarea
                      id="expectations"
                      placeholder="What are you expecting from today's service?"
                      value={loginData.expectations}
                      onChange={handleLoginInputChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#374151",
                        fontSize: "14px",
                        minHeight: "60px",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#e08c00" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "14px",
                      backgroundColor: isSubmitting ? "#9ca3af" : "#2a1e7a",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      fontSize: "16px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    {isSubmitting ? (
                      <div style={{
                            width: "20px",
                            height: "20px",
                        border: "3px solid #f3f3f3",
                        borderTop: "3px solid #2a1e7a",
                            borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                    ) : (
                      <>
                        <FaUser /> Join as Member
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#f59e0b" }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleGuestMode}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#f59e0b",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <FaUser /> Continue as Guest
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimony Form Modal */}
      <AnimatePresence>
        {showTestimonyForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "100%",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                margin: "40px auto",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                  }}
                >
                  Share Your Testimony
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTestimonyForm(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                  }}
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>

              <div style={{ padding: "24px", overflowY: "auto" }}>
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: "24px",
                    color: theme === "dark" ? "#cccccc" : "#4b5563",
                    lineHeight: 1.6,
                  }}
                >
                  We'd love to hear about what God has done in your life. Your testimony can inspire and encourage
                  others.
                </p>

                <form onSubmit={handleTestimonySubmit}>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "16px",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="name"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        }}
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={testimonyData.name}
                        onChange={handleTestimonyInputChange}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "4px",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="email"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={testimonyData.email}
                        onChange={handleTestimonyInputChange}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "4px",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      htmlFor="title"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Testimony Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="E.g., Healed from Cancer"
                      value={testimonyData.title}
                      onChange={handleTestimonyInputChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#374151",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      htmlFor="testimony"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Your Testimony
                    </label>
                    <textarea
                      id="testimony"
                      placeholder="Share your testimony in detail..."
                      value={testimonyData.testimony}
                      onChange={handleTestimonyInputChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#374151",
                        fontSize: "14px",
                        minHeight: "150px",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="sharePublicly"
                        checked={testimonyData.sharePublicly}
                        onChange={handleTestimonyInputChange}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          color: theme === "dark" ? "#cccccc" : "#4b5563",
                        }}
                      >
                        I consent to share my testimony publicly on the church website and social media
                      </span>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#3a2e8a" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "14px",
                      backgroundColor: isSubmitting ? "#4a4a6a" : "#2a1e7a",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      fontSize: "16px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            borderTop: "2px solid white",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaFileAlt /> Submit Testimony
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "100%",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                margin: "40px auto",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                  }}
                >
                  Contact Us
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowContactForm(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                  }}
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>

              <div style={{ padding: "24px", overflowY: "auto" }}>
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: "24px",
                    color: theme === "dark" ? "#cccccc" : "#4b5563",
                    lineHeight: 1.6,
                  }}
                >
                  Have a question or need prayer? Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleContactSubmit}>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "16px",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="name"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        }}
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={contactData.name}
                        onChange={handleContactInputChange}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "4px",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="email"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={contactData.email}
                        onChange={handleContactInputChange}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "4px",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      htmlFor="subject"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={contactData.subject}
                      onChange={handleContactInputChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#374151",
                        fontSize: "14px",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                          theme === "dark" ? "white" : "black"
                        }' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "16px",
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="Prayer Request">Prayer Request</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Counseling">Counseling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label
                      htmlFor="message"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      placeholder="Type your message here..."
                      value={contactData.message}
                      onChange={handleContactInputChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#374151",
                        fontSize: "14px",
                        minHeight: "150px",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#3a2e8a" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "14px",
                      backgroundColor: isSubmitting ? "#4a4a6a" : "#2a1e7a",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      fontSize: "16px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            borderTop: "2px solid white",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                borderRadius: "8px",
                padding: "32px",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "white",
                  fontSize: "32px",
                }}
              >
                <FaCheck />
              </div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                }}
              >
                Success!
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "24px",
                  color: theme === "dark" ? "#cccccc" : "#4b5563",
                  lineHeight: 1.7,
                }}
              >
                {successMessage}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#2a1e7a",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Prompt Modal */}
      <AnimatePresence>
        {showGuestPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                borderRadius: "8px",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                margin: "40px auto",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "24px 24px 0 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#f59e0b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  <FaUser size={24} color="white" />
                </div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    marginBottom: "8px",
                  }}
                >
                  Continue as Guest
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: theme === "dark" ? "#cccccc" : "#4b5563",
                    lineHeight: "1.5",
                  }}
                >
                  Provide your name and email to continue as a guest. You can still participate in the live chat and prayer requests.
                </p>
              </div>

              {/* Form */}
              <div style={{ padding: "24px" }}>
                {formErrors.guest && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#dc2626",
                      padding: "12px",
                      borderRadius: "4px",
                      marginBottom: "16px",
                      fontSize: "14px",
                    }}
                  >
                    {formErrors.guest}
                  </div>
                )}

                <form onSubmit={handleGuestSubmit}>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      htmlFor="name"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Full Name*
                    </label>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaUser size={16} />
                      </div>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={loginData.name}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label
                      htmlFor="email"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    >
                      Email Address*
                    </label>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "12px",
                          transform: "translateY(-50%)",
                          color: theme === "dark" ? "#666" : "#999",
                        }}
                      >
                        <FaEnvelope size={16} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={loginData.email}
                        onChange={handleLoginInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "4px",
                          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                          backgroundColor: theme === "dark" ? "#111" : "white",
                          color: theme === "dark" ? "#ffffff" : "#374151",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleBackToLogin}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "transparent",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                        border: `1px solid ${theme === "dark" ? "#f59e0b" : "#2a1e7a"}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Back to Login
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "#e08c00" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: isSubmitting ? "#9ca3af" : "#f59e0b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {isSubmitting ? (
                        <div style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #f3f3f3",
                          borderTop: "2px solid #f59e0b",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite"
                        }}></div>
                      ) : (
                        <>
                          <FaUser /> Continue as Guest
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <FloatingLiveChat />
    </div>
  )
}

export default LiveStream


