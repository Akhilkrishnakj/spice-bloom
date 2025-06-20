import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Helmet } from 'react-helmet'
import { Toaster } from 'react-hot-toast'
function Layout({ children, title, description, keywords, author }) {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description || "Default website description"} />
        <meta name="keywords" content={keywords || "spices, blends, organic, herbs"} />
        <meta name="author" content={author || "Your Brand"} />
        <title>{title || "Spice Store"}</title>
      </Helmet>

      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Toaster/>
        {children}</main>
      <Footer />
    </div>
  )
}

export default Layout

