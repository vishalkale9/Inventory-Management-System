import { useState } from 'react'
import Navbar from './components/layout/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <main className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Smart Inventory, Seamless Flow.</h1>
            <p className="hero-description">
              Invenflow helps businesses track stock, manage categories, and stay ahead of low inventory alerts with a modern dashboard and real-time updates.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image-container">
            <img 
              src="/inventory_illustration.png" 
              alt="Inventory Management Illustration" 
              className="hero-image"
            />
          </div>
        </main>
      </div>
    </>
  )
}

export default App


