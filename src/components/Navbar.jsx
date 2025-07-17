import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaChevronDown, FaGlobe, FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/logo.png";
import englishFlag from "../assets/icons/eng.png"; // Assumed asset; remove if using emoji fallback

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMinistries, setShowMinistries] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setShowLanguageDropdown(false); // Close language dropdown when menu toggles
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
    setShowMinistries(false); // Close ministries dropdown to avoid overlap
  };

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, isMobile]);

  // Handle scroll for background color change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "https://ceibz1.vercel.app/" },
    { name: "WATCH LIVE", path: "https://ceibz1.vercel.app/LiveStream" },
    {
      name: "MINISTRIES",
      dropdown: true,
      items: [
        { name: "FOUNDATION SCHOOL", path: "https://ceibz1.vercel.app/foundationSchool" },
        { name: "CHILDREN MINISTRY", path: "https://ceibz1.vercel.app/children" },
        { name: "TEENS MINISTRY", path: "https://ceibz1.vercel.app/teens" },
      ],
    },
    { name: "PROGRAMS", path: "https://ceibz1.vercel.app/Programs" },
    { name: "TESTIFY", path: "https://ceibz1.vercel.app/TestifyScreen" },
    { name: "GIVE", path: "https://ceibz1.vercel.app/give" },
    { name: "CONTACT US", path: "https://ceibz1.vercel.app/Contact" },
  ];

  return (
    <motion.header
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        height: "80px",
        left: 0,
        width: "100%",
        zIndex: 9999,
        backgroundColor: scrolled
          ? theme === "dark"
            ? "rgba(42, 30, 122, 0.95)"
            : "rgba(42, 30, 122, 0.95)"
          : theme === "dark"
          ? "rgba(42, 30, 122, 0.95)"
          : "rgba(42, 30, 122, 0.95)",
        transition: "background-color 0.3s ease",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          maxWidth: "1400px",
          margin: "0 auto",
          height: "100%",
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => window.location.href = "https://ceibz1.vercel.app/"}
        >
          <img
            src={logo || "/placeholder.svg"}
            alt="Christ Embassy Logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          />
        </motion.div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav
            style={{
              display: "flex",
              gap: isTablet ? "20px" : "30px",
            }}
          >
            {navLinks.map((link, index) =>
              link.dropdown ? (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={() => setShowMinistries(true)}
                  onMouseLeave={() => setShowMinistries(false)}
                >
                  <motion.div
                    whileHover={{ color: "#f59e0b" }}
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {link.name}
                    <FaChevronDown size={12} />
                  </motion.div>
                  <AnimatePresence>
                    {showMinistries && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "200px",
                          backgroundColor: "#2a1e7a",
                          borderRadius: "0",
                          padding: "8px 0",
                          marginTop: "10px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          zIndex: 1000,
                        }}
                      >
                        {link.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ backgroundColor: "#3a2e8a" }}
                            style={{
                              padding: "12px 16px",
                              color: "white",
                              fontSize: "14px",
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onClick={() => window.location.href = item.path}
                          >
                            {item.name}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  key={index}
                  whileHover={{ color: "#f59e0b" }}
                  style={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => window.location.href = link.path}
                >
                  {link.name}
                </motion.div>
              )
            )}
          </nav>
        )}

        {/* Right Side Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Language Selector */}
          <div style={{ position: "relative" }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ color: "white", cursor: "pointer" }}
              onClick={toggleLanguageDropdown}
            >
              <FaGlobe size={16} />
            </motion.div>
            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    width: "150px",
                    backgroundColor: "#2a1e7a",
                    borderRadius: "0",
                    padding: "8px 0",
                    marginTop: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    minWidth: "120px",
                  }}
                >
                  <motion.div
                    whileHover={{ backgroundColor: "#3a2e8a" }}
                    style={{
                      padding: "8px 12px",
                      color: "white",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={englishFlag || "/placeholder.svg"}
                      alt="English"
                      style={{ width: "16px", height: "16px" }}
                    />
                    English
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
            </motion.div>
          </motion.button>

          {/* Mobile Menu Button */}
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#2a1e7a",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px" }}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {link.dropdown ? (
                    <div>
                      <div
                        style={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onClick={() => setShowMinistries(!showMinistries)}
                      >
                        {link.name}
                        <motion.div
                          animate={{ rotate: showMinistries ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaChevronDown size={12} />
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {showMinistries && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              paddingLeft: "20px",
                              marginTop: "8px",
                            }}
                          >
                            {link.items.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                  padding: "8px 0",
                                  color: "rgba(255, 255, 255, 0.8)",
                                  fontSize: "14px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  window.location.href = item.path;
                                  setMenuOpen(false);
                                }}
                              >
                                {item.name}
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "white",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        window.location.href = link.path;
                        setMenuOpen(false);
                      }}
                    >
                      {link.name}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar; 