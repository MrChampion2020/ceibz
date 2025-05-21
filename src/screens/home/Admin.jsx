import { useState, useEffect } from "react"
import { useMediaQuery } from "react-responsive"
import { motion } from "framer-motion"
import { useTheme } from "../../components/ThemeProvider"
import { FaUser, FaEdit, FaSave } from "react-icons/fa"
import logo from "../../assets/logo.png"


const Admin = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" })
  const { theme } = useTheme()
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ attendance: 0, progress: 0 })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://bootcamp-hrt5.onrender.com/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user._id)
    setEditForm({ attendance: user.attendance, progress: user.progress })
  }

  const handleSave = async (userId) => {
    try {
      const response = await fetch(`https://bootcamp-hrt5.onrender.com/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (response.ok) {
        setEditingUser(null)
        fetchUsers()
      } else {
        alert("Failed to update user.")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("An error occurred. Please try again later.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm({ ...editForm, [name]: parseInt(value) })
  }

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
        }}
      >
        <img
          src={logo} // Replace with the actual path to the logo image
          alt="Christ Embassy Ibadan Zone 1 Logo"
          style={{
            height: isMobile ? "40px" : "60px",
            marginBottom: "10px",
            margin: "auto"
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

      <main style={{ flexGrow: 1, padding: isMobile ? "40px 20px" : "60px 40px", marginTop: "80px" }}>
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "32px",
            marginTop: "30px",
            textAlign: "center",
            color: theme === "dark" ? "#f59e0b" : "#2a1e7a",
          }}
        >
          Admin Dashboard - Bootcamp Registrations
        </motion.h1>

        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {users.length === 0 ? (
            <p style={{ textAlign: "center", color: theme === "dark" ? "#cccccc" : "#4b5563" }}>
              No registrations found.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: theme === "dark" ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px", textAlign: "left", color: theme === "dark" ? "#f59e0b" : "#2a1e7a", borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}` }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left", color: theme === "dark" ? "#f59e0b" : "#2a1e7a", borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}` }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "left", color: theme === "dark" ? "#f59e0b" : "#2a1e7a", borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}` }}>Skill</th>
                    <th style={{ padding: "12px", textAlign: "left", color: theme === "dark" ? "#f59e0b" : "#2a1e7a", borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}` }}>Attendance (%)</th>
                    <th style={{ padding: "12px", textAlign: "left", color: theme === "dark" ? "#f59e0b" : "#2a1e7a", borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}` }}>Progress (%)</th>
                    <th style={{ padding: "12px", textAlign: "left", color: theme === "dark" ? "#f59e0b" : "#2a1e7a", borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}` }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      style={{ borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}` }}
                    >
                      <td style={{ padding: "12px" }}>{user.fullName}</td>
                      <td style={{ padding: "12px" }}>{user.email}</td>
                      <td style={{ padding: "12px" }}>{user.skill}</td>
                      <td style={{ padding: "12px" }}>
                        {editingUser === user._id ? (
                          <input
                            type="number"
                            name="attendance"
                            value={editForm.attendance}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            style={{
                              width: "60px",
                              padding: "4px",
                              borderRadius: "4px",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                              backgroundColor: theme === "dark" ? "#111" : "white",
                              color: theme === "dark" ? "#ffffff" : "#000000",
                            }}
                          />
                        ) : (
                          user.attendance
                        )}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {editingUser === user._id ? (
                          <input
                            type="number"
                            name="progress"
                            value={editForm.progress}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            style={{
                              width: "60px",
                              padding: "4px",
                              borderRadius: "4px",
                              border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
                              backgroundColor: theme === "dark" ? "#111" : "white",
                              color: theme === "dark" ? "#ffffff" : "#000000",
                            }}
                          />
                        ) : (
                          user.progress
                        )}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {editingUser === user._id ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSave(user._id)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#f59e0b",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <FaSave /> Save
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(user)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#2a1e7a",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <FaEdit /> Edit
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </main>

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
          <p><strong>Contact Us:</strong></p>
          <p>Email: ceibz1@church.org</p>
          <p>Phone: +234 123 456 7890</p>
          <p>WhatsApp: +234 987 654 3210</p>
          <p>Address: 123 Church Road, Ibadan, Nigeria</p>
        </div>
        <p style={{ marginTop: "20px" }}>© 2025 Christ Embassy Ibadan Zone 1. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Admin


