import React from "react"
import "./WorkoutList.css" // Import the CSS file

const WorkoutList = ({ workouts, updateWorkout, updateCallback }) => {
  return (
    <div className="workout-list">
      <h2>Workouts</h2>
      <table>
        <thead>
          <tr>
            <th>Workout Name</th>
            <th>Exercises</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr key={workout.id}>
              <td>{workout.name}</td>
              <td>
                {workout.exercises.length > 0 ? (
                  <ul>
                    {workout.exercises.map((exercise) => (
                      <li key={exercise.id}>
                        {exercise.name} - {exercise.sets} sets,{" "}
                        {exercise.repetitions} repetitions
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No exercises added yet</p>
                )}
              </td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => updateWorkout(workout)}
                >
                  Update
                </button>
                <button className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WorkoutList
