from flask import Flask, request, jsonify
from config import app, db
from models import Exercise, Workout, ChatMessage
import ollama
import requests
import json

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

@app.route("/workouts", methods=["GET"])
def get_workouts():
    workouts = Workout.query.all()
    json_workouts = list(map(lambda x: x.to_json(), workouts))
    return jsonify({"workouts": json_workouts})

@app.route("/create_workout", methods=["POST"])
def create_workout():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get('name')
    exercises_data = data.get('exercises')
    
    if not name:
        return jsonify({"error": "Workout name is required"}), 400
    if not isinstance(exercises_data, list) or not exercises_data:
        return jsonify({"error": "Exercises data is invalid or empty"}), 400
    
    if Workout.query.filter_by(name=name).first():
        return jsonify({"error": "Workout with this name already exists"}), 400
    
    new_workout = Workout(name=name)
    try:
        exercises = []
        for exercise_data in exercises_data:
            exercise_name = exercise_data.get('name')
            sets = exercise_data.get('sets')
            repetitions = exercise_data.get('repetitions')
            if not exercise_name or sets is None or repetitions is None:
                return jsonify({"error": "Invalid exercise data"}), 400
            
            new_exercise = Exercise(name=exercise_name, sets=sets, repetitions=repetitions, workout=new_workout)
            exercises.append(new_exercise)
        
        db.session.add(new_workout)
        db.session.add_all(exercises)
        db.session.commit()
        return jsonify(new_workout.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/update_workout/<int:workout_id>", methods=["PATCH"])
def update_workout(workout_id):
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"message": "Workout not found"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get('name')
    if name:
        existing_workout = Workout.query.filter(Workout.id != workout_id, Workout.name == name).first()
        if existing_workout:
            return jsonify({"error": "Workout with this name already exists"}), 400
        workout.name = name
    
    exercises_data = data.get('exercises')
    if exercises_data:
        existing_exercises = {exercise.name: exercise for exercise in workout.exercises}
        exercises = []
        for exercise_data in exercises_data:
            exercise_name = exercise_data.get('name')
            sets = exercise_data.get('sets')
            repetitions = exercise_data.get('repetitions')
            if not exercise_name or sets is None or repetitions is None:
                return jsonify({"error": "Invalid exercise data"}), 400
            
            if exercise_name in existing_exercises:
                existing_exercise = existing_exercises.pop(exercise_name)
                existing_exercise.sets = sets
                existing_exercise.repetitions = repetitions
                exercises.append(existing_exercise)
            else:
                new_exercise = Exercise(name=exercise_name, sets=sets, repetitions=repetitions, workout=workout)
                exercises.append(new_exercise)
        
        for exercise in existing_exercises.values():
            db.session.delete(exercise)
        workout.exercises = exercises
    
    try:
        db.session.commit()
        return jsonify(workout.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/delete_workout/<int:workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"message": "Workout not found"}), 404
    
    db.session.delete(workout)
    db.session.commit()
    return jsonify({"message": "Workout Deleted"})

@app.route("/chat", methods=['POST'])
def chat():
    data = request.get_json()
    print("Received message:", data)
    if not data or 'message' not in data:
        return jsonify({'error': 'Message is required'}), 400

    user_message = data['message']
    print("User message:", user_message)
    chat_message = ChatMessage(content=user_message, sender='user')
    db.session.add(chat_message)
    db.session.commit()

    assistant_response = get_assistant_response(user_message)
    print("Assistant response:", assistant_response)
    assistant_message = ChatMessage(content=assistant_response, sender='assistant')
    db.session.add(assistant_message)
    db.session.commit()

    return jsonify({'response': assistant_response})

url = "http://localhost:11434/api/chat"
headers = {
    "Content-Type": "application/json"
}

chat_history = []

def get_assistant_response(message):
    global chat_history

    # Add user message to chat history
    chat_history.append({
        "role": "user",
        "content": message + "(You are an AI Fitness planner. Answer concisely and avoid asking questions back)"
    })

    # Prepare the data payload with the entire chat history
    data = {
        "model": "gemma:2b",
        "messages": chat_history
    }

    # Send the request to the chat endpoint
    response = requests.post(url, headers=headers, data=json.dumps(data), stream=True)

    if response.status_code == 200:
        complete_response = ""
        for line in response.iter_lines():
            if line:
                part = json.loads(line.decode('utf-8'))
                complete_response += part["message"]["content"]
        
        # Add assistant message to chat history
        chat_history.append({
            "role": "assistant",
            "content": complete_response
        })

        return complete_response
    else:
        print("Error:", response.status_code, response.text)




#Generating Workout Table
@app.route("/generate_workout", methods=['POST'])
def generate_workout():
    data = request.get_json()
    print("Received Data:", data) # Add this line
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    user_data = f"""
    Height: {data['height']} cm
    Weight: {data['weight']} kg
    Age: {data['age']}
    Gender: {data['gender']}
    Fitness Level: {data['fitnessLevel']}
    Goal: {data['goal']}
    """

    workout_prompt = """
    Based on the user data below, generate an exercise plan for a week. Generate 3 (three) exercises per day.
    Return the workout plan as a JSON array only,dont respond with anything extra. 
    Sample output JSON:
		[{"day": "Monday","exercises": [{"exercise": "Dips", "sets": "3", "repetitions": "12"},...]},...]
    Answer:
    User data:
    """ + user_data
    
    print(workout_prompt)
    # Each day should be an object with a "day" field and an "exercises" array. Each exercise should be an object with "exercise", "sets", "repetitions" fields.

    response = ollama.chat(model='gemma:2b', messages=[{'role': 'user', 'content': workout_prompt}])
    print("Generated Workout:", response['message']['content']) # Add this line
    generated_workout = response['message']['content']

    # Attempt to parse the generated workout as JSON
    try:
        workout_json = json.loads(generated_workout)
        
        # Clean and standardize the data
        cleaned_workout = []
        for day in workout_json:
            cleaned_day = {
                "day": day.get("day", "Unknown"),
                "exercises": []
            }
            exercises = day.get("exercises") or day.get("exerinas") or []
            for exercise in exercises:
                if isinstance(exercise, dict) and not exercise.get("rest"):
                    cleaned_exercise = {
                        "exercise": exercise.get("exercise", "Unknown"),
                        "sets": exercise.get("sets", "N/A"),
                        "repetitions": exercise.get("repetitions", "N/A"),
                    }
                    cleaned_day["exercises"].append(cleaned_exercise)
            cleaned_workout.append(cleaned_day)

        return jsonify({'workout': cleaned_workout})
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to generate a valid workout plan'}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
