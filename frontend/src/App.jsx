import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Login from './components/auth/Login'
import Categories from './components/categories/Categories'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuth } from './context/AuthContext'


import Products from './components/products/Products'

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      
      {user ? (
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
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
                    <Link to="/login" className="btn-primary">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn-secondary">
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
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      )}
    </>
  )
}

export default App




