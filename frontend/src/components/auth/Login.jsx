import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast.error('All fields are required');
      return;
    }
    
    setSubmitting(true);
    const loadingToast = toast.loading(isLogin ? 'Signing in...' : 'Creating account...');
    
    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(name, email, password);
      }

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Access your inventory management system' : 'Create an account to get started'}
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={submitting}>
            {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button className="auth-toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
