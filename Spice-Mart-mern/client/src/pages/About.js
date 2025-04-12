import React from 'react'
import  '../index.css'
import Layout from '../components/Layouts/Layout'

const About = () => {
  return (
    <Layout title={"About Us - Spice Bloom"} >
              <div className="about-container">
      <h2 className="about-title">About Spice Bloom 🌿</h2>

      <div className="about-section">
        <div className="about-text">
          <p>
            At <strong>Spice Bloom</strong>, we believe spices are not just ingredients – they’re the soul of every dish.
            Born in the spice-rich lands of Kerala, our mission is to deliver fresh, aromatic, and premium quality spices
            directly to your kitchen.
          </p>
          <p>
            From the earthy turmeric to the fiery black pepper, we source our spices from trusted local farmers
            and ensure they’re processed naturally, preserving the purity and flavor in every pinch.
          </p>
        </div>
        <div className="about-image">
        <img
            src="https://media.istockphoto.com/id/1085301408/photo/close-up-of-black-pepper-in-a-bowl-and-spoon.webp?a=1&b=1&s=612x612&w=0&k=20&c=qFwkOD5mihTMdIiVxej6YitXVhacPDeoCI-_b8m0dpM="
            alt="Spices Bowl"
        />

        </div>
      </div>

      <div className="why-choose">
        <h3>Why Choose Us?</h3>
        <ul>
          <li>✅ 100% Natural and Pure Spices</li>
          <li>✅ Directly Sourced from Indian Farms</li>
          <li>✅ No Artificial Colors or Preservatives</li>
          <li>✅ Eco-friendly Packaging</li>
          <li>✅ Customer-Centric Support</li>
        </ul>
      </div>
    </div>
    </Layout>
  )
}



export default About
