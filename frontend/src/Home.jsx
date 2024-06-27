import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./css/styles.css" // Import your CSS file
import logo from "./img/logo1.png" // Import the logo
import heroImage from "./img/hero4.png" // Import the hero image
import AOS from "aos"
import "aos/dist/aos.css"

const Home = () => {
  useEffect(() => {
    AOS.init({
      offset: 1,
    })
  }, [])

  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      <section className="hero" data-aos="zoom-in" data-aos-duration="1400">
        <div className="hero-text">
          <h5 data-aos="fade-right" data-aos-duration="1400">
            #StriveForGreatness
          </h5>
          <h1
            data-aos="zoom-in-left"
            data-aos-duration="1400"
            data-aos-delay="200"
          >
            - Stay Hard
          </h1>
          <p
            data-aos="fade-right"
            data-aos-duration="1400"
            data-aos-delay="300"
          >
            Start your fitness journey to become the best version of yourself.
            Your first step begins now.
          </p>
          <div
            className="main-hero"
            data-aos="flip-down"
            data-aos-duration="1400"
            data-aos-delay="400"
          >
            <Link to="/generate" className="btn">
              Get Started
            </Link>
            <Link to="/chat" className="price">
              Chat | <span>Try Our Fitness Chatbot</span>
            </Link>
          </div>
        </div>
        <img src={heroImage} alt="Hero" />
      </section>

      <div className="icons">
        <a
          href="#"
          data-aos="fade-in"
          data-aos-duration="1400"
          data-aos-delay="600"
        >
          <i className="ri-facebook-fill"></i>
        </a>
        <a
          href="#"
          data-aos="fade-in"
          data-aos-duration="1400"
          data-aos-delay="700"
        >
          <i className="ri-youtube-fill"></i>
        </a>
        <a
          href="#"
          data-aos="fade-in"
          data-aos-duration="1400"
          data-aos-delay="800"
        >
          <i className="ri-twitter-fill"></i>
        </a>
      </div>

      <div
        className="scroll"
        data-aos="zoom-out-down"
        data-aos-duration="1400"
        data-aos-delay="550"
      >
        <a href="#">
          <i className="ri-scroll-to-bottom-line"></i>Scroll Down
        </a>
      </div>
    </>
  )
}

export default Home
