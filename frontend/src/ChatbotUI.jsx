import React, { useState, useEffect } from "react"
import axios from "axios"
import "./css/styles1.css"
import AOS from "aos"
import "aos/dist/aos.css"
import ReactMarkdown from "react-markdown"

const ChatbotUI = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    AOS.init({ offset: 1 })
  }, [])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

    console.log("Sending message:", newMessage)
    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message: newMessage,
      })
      console.log("Received response:", response.data.response)
      setMessages([
        ...messages,
        { content: newMessage, sender: "user" },
        { content: response.data.response, sender: "assistant" },
      ])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <>
      <section className="chatbot-container">
        <div className="chatbot-ui">
          <div className="chatbot-header">
            <h3>Chat with our Assistant</h3>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}-message`}>
                {message.sender === "assistant" ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="send-button" onClick={handleSendMessage}>
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </section>

      <div className="hero-img"></div>

      <div
        className="scroll"
        data-aos="zoom-out-down"
        data-aos-duration="1400"
        data-aos-delay="550"
      >
        <a href="#">
          <i className="ri-scroll-to-bottom-line"></i> Scroll Down
        </a>
      </div>
    </>
  )
}

export default ChatbotUI
