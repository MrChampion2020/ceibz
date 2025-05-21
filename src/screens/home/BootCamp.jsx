import { useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../components/ThemeProvider";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGraduationCap,
  FaCode,
  FaChartBar,
  FaLaptopCode,
  FaCheck,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
const Bootcamp = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const { theme } = useTheme();
  const formRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    education: "",
    skill: "",
    experience: "",
    location: "",
    expectations: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (formErrors[id]) {
      setFormErrors({ ...formErrors, [id]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.dob.trim()) errors.dob = "Date of Birth is required";
    if (!formData.education.trim())
      errors.education = "Education level is required";
    if (!formData.skill.trim()) errors.skill = "Skill selection is required";
    if (!formData.experience.trim())
      errors.experience = "Experience level is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.expectations.trim())
      errors.expectations = "Expectations are required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await fetch("https://bootcamp-hrt5.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowSuccessModal(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          dob: "",
          education: "",
          skill: "",
          experience: "",
          location: "",
          expectations: "",
        });
      } else {
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setFormSubmitting(false);
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
      {/* Custom Header */}
      <header
        style={{
          backgroundColor: "#2a1e7a",
          padding: isMobile ? "10px" : "20px",
          textAlign: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          margin: "auto",
        }}
      >
        <img
          src={logo} // Replace with the actual path to the logo image
          alt="Christ Embassy Ibadan Zone 1 Logo"
          style={{
            height: isMobile ? "40px" : "60px",
            marginBottom: "10px",
            margin: "auto",
          }}
        />
        <h1
          style={{
            color: "#f59e0b",
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: "bold",
            margin: 0,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Christ Embassy Ibadan Zone 1
        </h1>
      </header>

      <main style={{ flexGrow: 1, marginTop: "80px" }}>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            height: "500px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #2a1e7a 0%, #4a3e9a 100%)",
          }}
        >
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
            }}
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                fontSize: isMobile ? "32px" : "48px",
                fontWeight: "bold",
                color: "#f59e0b",
                marginBottom: "16px",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              Free Tech Skills Aquisition Program
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                fontSize: isMobile ? "14px" : "20px",
                maxWidth: isMobile ? "85%" : "70%",
                margin: "0 auto",
                color: "white",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              Book your Place in the Tuiton Free Technical and Digital Skills
              Training Program From May 31st 2025, to empower your tech skills
              and create lasting wealth!
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05, backgroundColor: "#f59e0b" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, delay: 1 }}
              onClick={() =>
                formRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "12px 24px",
                marginTop: "24px",
                backgroundColor: "#2a1e7a",
                color: "white",
                border: "2px solid #f59e0b",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Register Now
            </motion.button>
          </motion.div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.5) 100%)",
              zIndex: 1,
            }}
          ></div>
        </section>

        {/* Registration Form Section */}
        <section
          ref={formRef}
          style={{
            padding: isMobile ? "40px 20px" : "60px 40px",
            backgroundColor: theme === "dark" ? "#111111" : "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: "28px",
                fontWeight: "700",
                marginBottom: "8px",
                textAlign: "center",
                color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
              }}
            >
              Bootcamp Registration Form
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "32px",
                color: theme === "dark" ? "#cccccc" : "#4b5563",
              }}
            >
              Fill out the form below to secure your spot in the Tech Bootcamp.
            </motion.p>
            <motion.form
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              style={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                borderRadius: "8px",
                padding: "32px",
                boxShadow:
                  theme === "dark"
                    ? "0 4px 6px rgba(0, 0, 0, 0.3)"
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "24px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ flex: 1 }}
                >
                  <label
                    htmlFor="fullName"
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
                    <FaUser
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.fullName
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.fullName}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  style={{ flex: 1 }}
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
                    Email*
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaEnvelope
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.email
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  {formErrors.email && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.email}
                    </p>
                  )}
                </motion.div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "24px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  style={{ flex: 1 }}
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
                    Phone*
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaPhone
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.phone
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  {formErrors.phone && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.phone}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  style={{ flex: 1 }}
                >
                  <label
                    htmlFor="address"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}
                  >
                    Address*
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaMapMarkerAlt
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <input
                      id="address"
                      type="text"
                      placeholder="Your address"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.address
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  {formErrors.address && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.address}
                    </p>
                  )}
                </motion.div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "24px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  style={{ flex: 1 }}
                >
                  <label
                    htmlFor="dob"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}
                  >
                    Date of Birth*
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaCalendarAlt
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.dob
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  {formErrors.dob && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.dob}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  style={{ flex: 1 }}
                >
                  <label
                    htmlFor="education"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}
                  >
                    Highest Level of Education*
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaGraduationCap
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <select
                      id="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.education
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color:
                          theme === "dark"
                            ? "#ffffff"
                            : formData.education
                            ? "#ffffff"
                            : "#888",
                        fontSize: "14px",
                      }}
                    >
                      <option value="" disabled>
                        Select education level
                      </option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's Degree">
                        Bachelor's Degree
                      </option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {formErrors.education && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.education}
                    </p>
                  )}
                </motion.div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "24px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  style={{ flex: 1 }}
                >
                  <label
                    htmlFor="skill"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}
                  >
                    Skill*
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaCode
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <select
                      id="skill"
                      value={formData.skill}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.skill
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color:
                          theme === "dark"
                            ? "#ffffff"
                            : formData.skill
                            ? "#ffffff"
                            : "#888",
                        fontSize: "14px",
                      }}
                    >
                      <option value="" disabled>
                        Select skill
                      </option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="Digital Marketing">
                        Digital Marketing
                      </option>
                      <option value="Upwork Freelancing">
                        Upwork Freelancing
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {formErrors.skill && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.skill}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  style={{ flex: 1 }}
                >
                  <label
                    htmlFor="experience"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}
                  >
                    Level of Experience*
                  </label>
                  <div style={{ position: "relative" }}>
                    <FaChartBar
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "12px",
                        transform: "translateY(-50%)",
                        color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                      }}
                    />
                    <select
                      id="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          formErrors.experience
                            ? "#ef4444"
                            : theme === "dark"
                            ? "#333"
                            : "#e5e7eb"
                        }`,
                        backgroundColor: theme === "dark" ? "#111" : "white",
                        color:
                          theme === "dark"
                            ? "#ffffff"
                            : formData.experience
                            ? "#ffffff"
                            : "#888",
                        fontSize: "14px",
                      }}
                    >
                      <option value="" disabled>
                        Select experience level
                      </option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  {formErrors.experience && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.experience}
                    </p>
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
                style={{ marginBottom: "24px" }}
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
                <div style={{ position: "relative" }}>
                  <FaMapMarkerAlt
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "12px",
                      transform: "translateY(-50%)",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}
                  />
                  <input
                    id="location"
                    type="text"
                    placeholder="Your location (e.g., Ibadan, Nigeria)"
                    value={formData.location}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 36px",
                      borderRadius: "4px",
                      border: `1px solid ${
                        formErrors.location
                          ? "#ef4444"
                          : theme === "dark"
                          ? "#333"
                          : "#e5e7eb"
                      }`,
                      backgroundColor: theme === "dark" ? "#111" : "white",
                      color: theme === "dark" ? "#ffffff" : "#000000",
                      fontSize: "14px",
                    }}
                  />
                </div>
                {formErrors.location && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {formErrors.location}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                style={{ marginBottom: "24px" }}
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
                  Expectations*
                </label>
                <div style={{ position: "relative" }}>
                  <FaLaptopCode
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "12px",
                      color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                    }}
                  />
                  <textarea
                    id="expectations"
                    placeholder="What do you hope to achieve from this bootcamp?"
                    value={formData.expectations}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 36px",
                      borderRadius: "4px",
                      border: `1px solid ${
                        formErrors.expectations
                          ? "#ef4444"
                          : theme === "dark"
                          ? "#333"
                          : "#e5e7eb"
                      }`,
                      backgroundColor: theme === "dark" ? "#111" : "white",
                      color: theme === "dark" ? "#ffffff" : "#000000",
                      fontSize: "14px",
                      height: "120px",
                      resize: "vertical",
                    }}
                  />
                </div>
                {formErrors.expectations && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {formErrors.expectations}
                  </p>
                )}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#f59e0b" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.3 }}
                type="submit"
                disabled={formSubmitting}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: formSubmitting ? "#4a4a6a" : "#2a1e7a",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: formSubmitting ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {formSubmitting ? (
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
                    <style>
                      {`
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `}
                    </style>
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </motion.button>
            </motion.form>
          </div>
        </section>
      </main>

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
              backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                maxWidth: "400px",
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
                }}
              >
                <FaCheck size={32} color="white" />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
                }}
              >
                Registration Successful!
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "24px",
                  color: theme === "dark" ? "#cccccc" : "#4b5563",
                }}
              >
                Thank you for registering. A confirmation email has been sent to
                your inbox.
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

      {/* Custom Footer */}
      <footer
        style={{
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#f8f9fa",
          padding: isMobile ? "20px" : "40px",
          textAlign: "center",
          color: theme === "dark" ? "#cccccc" : "#4b5563",
          marginTop: "auto",
        }}
      >
        <div>
          <p>
            <strong>Contact Us:</strong>
          </p>
          <p>Email: ceibz1@church.org</p>
          <p>Phone: +234 123 456 7890</p>
          <p>
            <a
              href="https://wa.me/2349030155327?text=Hello%20Christ%20Embassy%20Zone%2C%20I%20would%20like%20to%20connect%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: +234 903 015 5327
            </a>
          </p>

          <p>Address: 123 Church Road, Ibadan, Nigeria</p>
        </div>
        <p style={{ marginTop: "20px" }}>
          © 2025 Christ Embassy Ibadan Zone 1. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Bootcamp;
