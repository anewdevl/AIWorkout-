import { useState } from "react"
import "./WorkoutForm.css" // Import the CSS file

const WorkoutForm = ({ existingWorkout = {}, updateCallback }) => {
  const [name, setName] = useState(existingWorkout.name || "")
  const [exercises, setExercises] = useState([
    existingWorkout.exercises || { name: "", sets: "", repetitions: "" },
  ])

  const updating = Object.entries(existingWorkout).length !== 0

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises]
    updatedExercises[index][field] = value
    setExercises(updatedExercises)
  }

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: "", repetitions: "" }])
  }

  const handleRemoveExercise = (index) => {
    const updatedExercises = [...exercises]
    updatedExercises.splice(index, 1)
    setExercises(updatedExercises)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const exercisesData = exercises.map((exercise) => ({
      name: exercise.name,
      sets: parseInt(exercise.sets, 10),
      repetitions: parseInt(exercise.repetitions, 10),
    }))
    const data = {
      name,
      exercises: exercisesData,
    }
    console.log("Data being sent:", data) // Log the data here
    const url =
      "http://127.0.0.1:5000/" +
      (updating ? `update_contact/${existingWorkout.id}` : "create_workout")
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        console.log("Workout created successfully")
        updateCallback()
        // Reset form fields
        setName("")
        setExercises([{ name: "", sets: "", repetitions: "" }])
      } else {
        const errorData = await response.json()
        console.error("Error creating workout:", errorData.error)
      }
    } catch (error) {
      console.error("Error creating workout:", error)
    }
  }

  return (
    <form className="workout-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Workout Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <h3>Exercises</h3>
      {exercises.map((exercise, index) => (
        <div key={index} className="exercise-group">
          <div className="form-group">
            <label htmlFor={`exercise-name-${index}`}>Exercise Name</label>
            <input
              type="text"
              id={`exercise-name-${index}`}
              value={exercise.name}
              onChange={(e) =>
                handleExerciseChange(index, "name", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor={`exercise-sets-${index}`}>Sets</label>
            <input
              type="number"
              id={`exercise-sets-${index}`}
              value={exercise.sets}
              onChange={(e) =>
                handleExerciseChange(index, "sets", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor={`exercise-repetitions-${index}`}>Reps</label>
            <input
              type="number"
              id={`exercise-repetitions-${index}`}
              value={exercise.repetitions}
              onChange={(e) =>
                handleExerciseChange(index, "repetitions", e.target.value)
              }
            />
          </div>
          <button
            type="button"
            className="btn-remove"
            onClick={() => handleRemoveExercise(index)}
          >
            Remove Exercise
          </button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={handleAddExercise}>
        Add Exercise
      </button>
      <button type="submit" className="btn-submit">
        Create Workout
      </button>
    </form>
  )
}

export default WorkoutForm
