import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gradient">Claimex</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/airdrops" className="text-gray-600 hover:text-blue-600 transition-colors">
              Airdrops
            </Link>
            <Link to="/community" className="text-gray-600 hover:text-blue-600 transition-colors">
              Community
            </Link>
            <Link to="/news" className="text-gray-600 hover:text-blue-600 transition-colors">
              News
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="py-4 space-y-2">
              <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Home
              </Link>
              <Link to="/airdrops" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Airdrops
              </Link>
              <Link to="/community" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Community
              </Link>
              <Link to="/news" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                News
              </Link>
              {isAdmin && (
                <Link to="/admin" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                    Login
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;