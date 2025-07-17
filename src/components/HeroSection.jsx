import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

const HeroSection = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const { theme } = useTheme();
  const [programs, setPrograms] = useState([]);
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Default programs if API fails
  const defaultPrograms = [
    {
      title: "Sunday Service",
      date: "Every Sunday, 8:30AM",
      location: "Church Auditorium",
      image: "https://via.placeholder.com/400x250/2a1e7a/ffffff?text=Sunday+Service",
      description: "Join us for our weekly Sunday service"
    },
    {
      title: "Global Communion Service",
      date: "Sunday June 1st, 3PM",
      location: "Church Auditorium",
      image: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=Global+Communion",
      description: "Special communion service with Pastor Chris"
    },
    {
      title: "Reach Out World",
      date: "1st October 2025, 8AM",
      location: "Church Auditorium",
      image: "https://via.placeholder.com/400x250/10b981/ffffff?text=Reach+Out+World",
      description: "Outreach program to reach the world"
    },
    {
      title: "Healing Streams",
      date: "Coming This July",
      location: "Church Auditorium",
      image: "https://via.placeholder.com/400x250/ef4444/ffffff?text=Healing+Streams",
      description: "Divine healing service"
    }
  ];

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call when backend is ready
      // const response = await axios.get('https://bootcamp-hrt5.onrender.com/api/programs');
      // setPrograms(response.data);
      
      // For now, use default programs
      setPrograms(defaultPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms(defaultPrograms);
    } finally {
      setLoading(false);
    }
  };

  const nextProgram = () => {
    setCurrentProgramIndex((prev) => (prev + 1) % programs.length);
  };

  const prevProgram = () => {
    setCurrentProgramIndex((prev) => (prev - 1 + programs.length) % programs.length);
  };

  if (loading) {
    return (
      <div style={{
        height: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
      }}>
        <div>Loading programs...</div>
      </div>
    );
  }

  return (
    <section style={{
      backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
      padding: isMobile ? "40px 20px" : "80px 40px",
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
      }}>
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "40px" : "60px",
          }}
        >
          <h1 style={{
            fontSize: isMobile ? "32px" : isTablet ? "48px" : "64px",
            fontWeight: "700",
            marginBottom: "20px",
            background: "linear-gradient(135deg, #2a1e7a 0%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Welcome to Christ Embassy
          </h1>
          <h2 style={{
            fontSize: isMobile ? "20px" : "28px",
            fontWeight: "600",
            marginBottom: "16px",
            color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
          }}>
            Ibadan Zone 1
          </h2>
          <p style={{
            fontSize: isMobile ? "16px" : "20px",
            color: theme === "dark" ? "#cccccc" : "#4b5563",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Experience the love of God and the power of His Word in our vibrant community
          </p>
        </motion.div>

        {/* Upcoming Programs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            marginBottom: isMobile ? "40px" : "60px",
          }}
        >
          <div style={{
            textAlign: "center",
            marginBottom: isMobile ? "30px" : "40px",
          }}>
            <h2 style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "700",
              marginBottom: "12px",
              color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
            }}>
              Upcoming Programs
            </h2>
            <p style={{
              fontSize: isMobile ? "14px" : "16px",
              color: theme === "dark" ? "#cccccc" : "#4b5563",
            }}>
              Join us for these exciting events and services
            </p>
          </div>

          {/* Programs Carousel */}
          <div style={{
            position: "relative",
            maxWidth: "1000px",
            margin: "0 auto",
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProgramIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                style={{
                  backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: theme === "dark" 
                    ? "0 10px 25px rgba(0, 0, 0, 0.3)" 
                    : "0 10px 25px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 0,
                }}>
                  {/* Program Image */}
                  <div style={{
                    position: "relative",
                    height: isMobile ? "200px" : "300px",
                    overflow: "hidden",
                  }}>
                    <img
                      src={programs[currentProgramIndex]?.image}
                      alt={programs[currentProgramIndex]?.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, rgba(42, 30, 122, 0.8) 0%, rgba(245, 158, 11, 0.8) 100%)",
                    }} />
                  </div>

                  {/* Program Details */}
                  <div style={{
                    padding: isMobile ? "24px" : "40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
                    <h3 style={{
                      fontSize: isMobile ? "20px" : "28px",
                      fontWeight: "700",
                      marginBottom: "16px",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}>
                      {programs[currentProgramIndex]?.title}
                    </h3>
                    
                    <p style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: theme === "dark" ? "#cccccc" : "#4b5563",
                      marginBottom: "24px",
                      lineHeight: 1.6,
                    }}>
                      {programs[currentProgramIndex]?.description}
                    </p>

                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: theme === "dark" ? "#ffffff" : "#000000",
                      }}>
                        <FaCalendarAlt size={16} style={{ color: "#f59e0b" }} />
                        <span style={{ fontSize: "14px" }}>
                          {programs[currentProgramIndex]?.date}
                        </span>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: theme === "dark" ? "#ffffff" : "#000000",
                      }}>
                        <FaMapMarkerAlt size={16} style={{ color: "#f59e0b" }} />
                        <span style={{ fontSize: "14px" }}>
                          {programs[currentProgramIndex]?.location}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        marginTop: "24px",
                        padding: "12px 24px",
                        backgroundColor: "#2a1e7a",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        alignSelf: "flex-start",
                      }}
                    >
                      Join Us
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevProgram}
              style={{
                position: "absolute",
                left: "-20px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#2a1e7a",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
              }}
            >
              <FaChevronLeft size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextProgram}
              style={{
                position: "absolute",
                right: "-20px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#2a1e7a",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
              }}
            >
              <FaChevronRight size={16} />
            </motion.button>

            {/* Dots Indicator */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "24px",
            }}>
              {programs.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setCurrentProgramIndex(index)}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: index === currentProgramIndex ? "#f59e0b" : "#e5e7eb",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            textAlign: "center",
            padding: isMobile ? "40px 20px" : "60px 40px",
            backgroundColor: theme === "dark" ? "#1a1a1a" : "#f8fafc",
            borderRadius: "16px",
            marginTop: "40px",
          }}
        >
          <h3 style={{
            fontSize: isMobile ? "24px" : "32px",
            fontWeight: "700",
            marginBottom: "16px",
            color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
          }}>
            Join Our Live Stream
          </h3>
          <p style={{
            fontSize: isMobile ? "16px" : "18px",
            color: theme === "dark" ? "#cccccc" : "#4b5563",
            marginBottom: "32px",
            maxWidth: "600px",
            margin: "0 auto 32px",
          }}>
            Can't make it in person? Join us online for our live services and stay connected with our community
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px 32px",
              backgroundColor: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Watch Live Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 