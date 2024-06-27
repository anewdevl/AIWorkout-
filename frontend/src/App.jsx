import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import "./App.css"
import WorkoutList from "./WorkoutList"
import WorkoutForm from "./WorkoutForm"
import Home from "./Home" // Import the Home component
import Generate from "./Generate"
import ChatbotUI from "./ChatbotUI"
import logo from "./img/logo1.png" // Ensure you import the logo

function App() {
  const [workouts, setWorkouts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    const response = await fetch("http://127.0.0.1:5000/workouts")
    const data = await response.json()
    setWorkouts(data.workouts)
    console.log(data.workouts)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openCreateModal = () => {
    setIsModalOpen(true)
  }

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen)
  }

  const openEditModal = () => {}

  return (
    <Router>
      <header>
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>
        <ul className={`navlist ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/workouts">Plan</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/generate">Generate</Link>
          </li>
        </ul>
        <div className="right-content">
          <Link to="/signin" className="nav-btn">
            Sign In
          </Link>
          <div
            className={`bx bx-menu ${menuOpen ? "bx-x" : ""}`}
            id="menu-icon"
            onClick={handleMenuClick}
          ></div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/chat" element={<ChatbotUI />} />
        <Route
          path="/workouts"
          element={
            <>
              <WorkoutList workouts={workouts} />
              <button className="btn-create" onClick={openCreateModal}>
                Create New Workout
              </button>
              {isModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <span className="close" onClick={closeModal}>
                      &times;
                    </span>
                    <WorkoutForm />
                  </div>
                </div>
              )}
            </>
          }
        />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </Router>
  )
}

export default App
