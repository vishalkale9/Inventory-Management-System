import { Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={
            <main className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">Smart Inventory, Seamless Flow.</h1>
                <p className="hero-description">
                  Invenflow helps businesses track stock, manage categories, and stay ahead of low inventory alerts with a modern dashboard and real-time updates.
                </p>
                <div className="hero-actions">
                  <Link to={user ? "/dashboard" : "/login"} className="btn-primary">
                    Get Started
                  </Link>
                  <Link to={user ? "/dashboard" : "/login"} className="btn-secondary">
                    Learn More
                  </Link>
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
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  )
}

export default App



