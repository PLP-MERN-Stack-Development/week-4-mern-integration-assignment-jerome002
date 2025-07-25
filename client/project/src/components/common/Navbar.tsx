// Navigation component with authentication states
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, Home, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { auth, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600';
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">BlogApp</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {auth.isAuthenticated && (
              <Link
                to="/create"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/create')}`}
              >
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={auth.user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                    alt={auth.user?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">{auth.user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;