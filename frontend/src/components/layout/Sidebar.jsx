import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Package, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar" id="sidebar-navigation">
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `sidebar-item-link ${isActive ? 'active' : ''}`}
            end
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/categories" 
            className={({ isActive }) => `sidebar-item-link ${isActive ? 'active' : ''}`}
          >
            <FolderOpen size={20} />
            <span>Categories</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/products" 
            className={({ isActive }) => `sidebar-item-link ${isActive ? 'active' : ''}`}
          >
            <Package size={20} />
            <span>Products</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button className="sidebar-item-link" onClick={logout} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
