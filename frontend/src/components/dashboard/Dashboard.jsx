import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { Package, FolderOpen, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        if (response.data.success) {
          setStats({
            totalProducts: response.data.totalProducts,
            totalCategories: response.data.totalCategories,
            lowStockProducts: response.data.lowStockProducts,
          });
        }
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Real-time inventory metrics and stock warnings.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper p-bg">
            <Package size={24} className="stat-icon p-color" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{stats.totalProducts}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper c-bg">
            <FolderOpen size={24} className="stat-icon c-color" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Categories</span>
            <span className="stat-value">{stats.totalCategories}</span>
          </div>
        </div>

        <div className="stat-card low-stock-alert">
          <div className="stat-icon-wrapper l-bg">
            <AlertTriangle size={24} className="stat-icon l-color" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Low Stock Items</span>
            <span className="stat-value">{stats.lowStockProducts}</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-welcome">
        <h3>Welcome to Invenflow Admin Panel</h3>
        <p>Use the navigation options to manage your inventory products and categories.</p>
      </div>
    </div>
  );
};

export default Dashboard;
