import React, { useRef, useEffect } from "react"
import WorkoutTable from "./WorkoutTable"
import "./css/WorkoutGenerator.css"

const WorkoutPlan = ({ workoutData }) => {
  const pdfContainerRef = useRef(null)

  useEffect(() => {
    console.log("Workout Data in WorkoutPlan:", workoutData)
  }, [workoutData])

  const handleDownload = async () => {
    const html2pdf = await import("html2pdf.js")
    const pdfOptions = {
      margin: [10, 10, 10, 10],
    }

    html2pdf
      .default()
      .set(pdfOptions)
      .from(pdfContainerRef.current)
      .save("workout_plan.pdf")
  }

  return (
    <div className="workout-plan">
      {workoutData && workoutData.length > 0 ? (
        <>
          <div>
            <button onClick={handleDownload} className="download-btn">
              Download PDF
            </button>
          </div>
          <div ref={pdfContainerRef}>
            <h1>Your Weekly Exercise Plan</h1>
            {workoutData.map((day, index) => (
              <div key={index}>
                <h2 className="day-title">{day.day}</h2>
                {day.exercises && day.exercises.length > 0 ? (
                  <WorkoutTable exercises={day.exercises} />
                ) : (
                  <p>No exercises for this day.</p>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No workout data available.</p>
      )}
    </div>
  )
}

export default WorkoutPlan
