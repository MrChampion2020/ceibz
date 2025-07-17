import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { useState } from "react"
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaChevronDown,
} from "react-icons/fa"
import kingschat from "../assets/kingschat.png"
import logo from "../assets/logo.png"

const Footer = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" })
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" })
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [openDropdown, setOpenDropdown] = useState(null)

  const mainMenuLinks = [
    { name: "WATCH LIVE", path: "https://ceibz1.vercel.app/LiveStream" },
    {
      name: "MINISTRIES",
      path: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "FOUNDATION SCHOOL", path: "https://ceibz1.vercel.app/foundationSchool" },
        { name: "CHILDREN MINISTRY", path: "https://ceibz1.vercel.app/children" },
        { name: "TEENS MINISTRY", path: "https://ceibz1.vercel.app/teens" },
      ],
    },
    { name: "PROGRAMS", path: "https://ceibz1.vercel.app/Programs" },
    { name: "TESTIFY", path: "https://ceibz1.vercel.app/TestifyScreen" },
    { name: "GIVE", path: "https://ceibz1.vercel.app/give" },
  ]

  const relevantLinks = [
    { name: "RHAPSODY OF REALITIES", href: "https://rhapsodyofrealities.org/" },
    { name: "INNER CITY MISSIONS", href: "https://innercitymission.org/" },
    { name: "HEALING STREAMS", href: "https://healingstreams.tv/" },
    { name: "PASTOR CHRIS DIGITAL LIBRARY", href: "https://pcdl.co/" },
    { name: "PASTOR CHRIS ONLINE", href: "https://pastorchrisonline.org/" },
  ]

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: "CVHQ+R4, Ibadan 200285, Oyo" },
    { icon: FaPhoneAlt, text: "+234 000 0000 000" },
    { icon: FaEnvelope, text: "info@ceibz1.com" },
  ]

  const socialMedia = [
    { icon: FaFacebook, href: "https://www.facebook.com/ceibz1" },
    { icon: FaYoutube, href: "https://www.youtube.com/@ChristEmbassyibz1" },
    {
      icon: "image",
      src: kingschat,
      href: "https://www.kings.chat/@ChristEmbassyibz1",
    },
    { icon: FaInstagram, href: "https://instagram.com" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <footer style={{ backgroundColor: "#2a1e7a", color: "white" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "60px 24px 40px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        {/* Logo and Social Media */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <motion.div variants={itemVariants}>
            <img
              src={logo || "/placeholder.svg"}
              alt="Christ Embassy Logo"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                marginBottom: "16px",
              }}
            />
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              Christ Embassy Ibadan Zone 1
            </h3>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {socialMedia.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                whileHover={{ scale: 1.1, color: "#f59e0b" }}
                style={{
                  color: "white",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                {item.icon === "image" ? (
                  <img src={item.src || "/placeholder.svg"} alt="kingschat" style={{ width: 20, height: 20 }} />
                ) : (
                  <item.icon />
                )}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Menu */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h3
            variants={itemVariants}
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Main Menu
          </motion.h3>

          <motion.div
            variants={containerVariants}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {mainMenuLinks.map((link, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div style={{ position: "relative" }}>
                  <a
                    href={link.path === "#" ? "#" : link.path}
                    onClick={(e) => {
                      e.preventDefault()
                      if (link.hasDropdown) {
                        setOpenDropdown(openDropdown === index ? null : index)
                      } else if (link.path !== "#") {
                        window.location.href = link.path
                      }
                    }}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                    }}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <motion.div animate={{ rotate: openDropdown === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <FaChevronDown size={12} />
                      </motion.div>
                    )}
                  </a>

                  {link.hasDropdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: openDropdown === index ? "auto" : 0,
                        opacity: openDropdown === index ? 1 : 0,
                        display: openDropdown === index ? "block" : "none",
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        overflow: "hidden",
                        marginLeft: "16px",
                        borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      {link.dropdownItems?.map((item, idx) => (
                        <motion.div key={idx} whileHover={{ x: 5 }} style={{ marginTop: "8px" }}>
                          <a
                            href={item.path}
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = item.path
                            }}
                            style={{
                              color: "rgba(255, 255, 255, 0.8)",
                              textDecoration: "none",
                              fontSize: "14px",
                              display: "block",
                              padding: "6px 0 6px 16px",
                            }}
                          >
                            {item.name}
                          </a>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Relevant Links */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h3
            variants={itemVariants}
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            Relevant Links
          </motion.h3>

          <motion.div
            variants={containerVariants}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {relevantLinks.map((link, index) => (
              <motion.div key={index} variants={itemVariants}>
                <a
                  href={link.href}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "16px",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {link.name}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Information */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "40px 24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "16px",
              }}
            >
              <info.icon style={{ color: "#f59e0b", fontSize: "18px" }} />
              <span>{info.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Copyright */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "20px 24px",
          textAlign: "center",
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          © 2024 Christ Embassy Ibadan Zone 1. All rights reserved.
        </motion.p>
      </div>
    </footer>
  )
}

export default Footer 