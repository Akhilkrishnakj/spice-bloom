import React from 'react'
import Layout from '../components/Layouts/Layout'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../index.css';

const Contact = () => {
  return (
    <Layout title={"Contact Us - Spice Bloom"}>
       <div className="contact-container">
      <h2 className="contact-heading">Contact Spice Bloom 🌶️</h2>

      <div className="contact-card">
        <div className="contact-item">
          <FaEnvelope className="icon" />
          <div>
            <h4>Email</h4>
            <p>support@spicebloom.com</p>
          </div>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="icon" />
          <div>
            <h4>Toll-Free</h4>
            <p>1800-123-456 (24/7 Support)</p>
          </div>
        </div>
        <div className="contact-item">
          <FaMapMarkerAlt className="icon" />
          <div>
            <h4>Head Office</h4>
            <p>123 Spice Street, Kochi, Kerala, India</p>
          </div>
        </div>
      </div>

      <div className="google-section">
        <h3>Send us a message</h3>
        <iframe
          title="Google Form"
          src="https://docs.google.com/forms/d/e/1FAIpQLSeXxxxxxxxxxxxxx/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          className="google-form"
        >
          Loading…
        </iframe>
      </div>

      <div className="google-section">
        <h3>Our Location</h3>
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.123456789!2d76.26730499999999!3d9.931232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d5a214dbbb1%3A0x12abc345def67890!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1680933489345!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="google-map"
        ></iframe>
      </div>
    </div>

  </Layout>
  )
}

export default Contact
