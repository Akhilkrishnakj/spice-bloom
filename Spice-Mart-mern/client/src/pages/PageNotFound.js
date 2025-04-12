import React from 'react'
import Layout from '../components/Layouts/Layout'
import { Link } from 'react-router-dom';
import "../index.css";


const PageNotFound = () => {
  return (
    <Layout title={"Page Not Found "} >
             <div className="not-found-container">
               <h1 className="error-code">404</h1>
                <h2 className="error-text">Too Spicy to Find 🌶️</h2>
               <p className="error-desc">
                  Looks like this page got lost in the spice mix!<br />
                  Maybe try heading back to the spice shelf.
               </p>
                 <Link to="/" className="go-home-btn">Back to Home</Link>
               </div>
      </Layout>
  )
}

export default PageNotFound
