import React from 'react'
import Layout from '../components/Layouts/Layout'
import '../index.css';

const Policy = () => {
  return (
     <Layout title={"Privacy Policy"}>
             <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p>Last updated: April 9, 2025</p>

        <p>
          At <strong>Spice Bloom</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect personal information such as:</p>
        <ul>
          <li>Name and contact details</li>
          <li>Email address</li>
          <li>Shipping/billing address</li>
          <li>Payment information (handled securely)</li>
          <li>Browsing behavior on our site</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>Your data is used to:</p>
        <ul>
          <li>Process your orders and deliver products</li>
          <li>Send updates and promotional offers</li>
          <li>Improve our website and services</li>
        </ul>

        <h2>Data Protection</h2>
        <p>We implement a variety of security measures to maintain the safety of your personal information.</p>

        <h2>Cookies</h2>
        <p>We use cookies to enhance your browsing experience. You can manage your cookie preferences in your browser settings.</p>

        <h2>Third-Party Services</h2>
        <p>We may share data with trusted third parties to help us run our business (e.g., shipping providers, payment processors).</p>

        <h2>Your Consent</h2>
        <p>By using our site, you consent to our Privacy Policy.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this policy occasionally. Please review it regularly for any changes.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p><strong>Email:</strong> support@spicebloom.com</p>
        <p><strong>Toll-Free:</strong> 1800-123-SPICE</p>
      </div>
    </div>
     </Layout>
  )
}

export default Policy
