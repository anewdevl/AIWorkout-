import React, { useState } from "react"
import axios from "axios"
import { GENDERS, FITNESS_LEVELS, GOALS } from "./constants"
import "./css/WorkoutGenerator.css"

const WorkoutGenerationForm = ({ onWorkoutGenerated }) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    fitnessLevel: "",
    goal: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form Data:", formData) // Add this line to check form data
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate_workout",
        formData
      )
      console.log("Response Data:", response.data) // Add this line to check the response
      if (response.data.workout) {
        onWorkoutGenerated(response.data.workout)
      } else {
        console.error("No workout data in response:", response.data)
      }
    } catch (error) {
      console.error("Error generating workout:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="height">Height (cm)</label>
        <input
          type="number"
          name="height"
          id="height"
          value={formData.height}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="weight">Weight (kg)</label>
        <input
          type="number"
          name="weight"
          id="weight"
          value={formData.weight}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          name="age"
          id="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select
          name="gender"
          id="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          {GENDERS.map((gender) => (
            <option key={gender.value} value={gender.value}>
              {gender.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="fitnessLevel">Fitness Level</label>
        <select
          name="fitnessLevel"
          id="fitnessLevel"
          value={formData.fitnessLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select Fitness Level</option>
          {FITNESS_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="goal">Goal</label>
        <select
          name="goal"
          id="goal"
          value={formData.goal}
          onChange={handleChange}
          required
        >
          <option value="">Select Goal</option>
          {GOALS.map((goal) => (
            <option key={goal.value} value={goal.value}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn">
        Generate Workout
      </button>
    </form>
  )
}

export default WorkoutGenerationForm
