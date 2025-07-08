// components/Navbar/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useProject } from "../../context/ProjectContext";
import { renameProject } from "../../utils/projectModel";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentProject, updateProjectName } = useProject();
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isEditorPage = location.pathname.startsWith('/editor');

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Mobile-accessible routes
  const mobileAllowedRoutes = ['/', '/docs'];
  const isMobileAllowed = (path) => mobileAllowedRoutes.includes(path);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProjectNameClick = () => {
    if (currentProject && currentProject.name) {
      setEditingName(currentProject.name);
      setIsEditing(true);
    }
  };

  const handleProjectNameSave = async () => {
    if (!editingName.trim() || editingName === currentProject.name) {
      setIsEditing(false);
      return;
    }

    try {
      // Rename the project in storage
      renameProject(currentProject.name, editingName.trim());
      
      // Update the context
      updateProjectName(currentProject.name, editingName.trim());
      
      // Navigate to the new URL
      navigate(`/editor/${encodeURIComponent(editingName.trim())}`, { replace: true });
      
      setIsEditing(false);
    } catch (error) {
      alert(`Error renaming project: ${error.message}`);
      setEditingName(currentProject.name);
      setIsEditing(false);
    }
  };

  const handleProjectNameCancel = () => {
    setEditingName(currentProject?.name || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleProjectNameSave();
    } else if (e.key === 'Escape') {
      handleProjectNameCancel();
    }
  };
  return (
    <nav
      className={`flex items-center justify-between px-4 md:px-8 transition-colors duration-300
        ${theme === 'dark' ? 'bg-[#1e1e1e] text-white border-b border-gray-700' : 'bg-[#fafdff] text-gray-900 border-b border-gray-200'}`}
      style={{
        height: "10vh",
        minHeight: "10vh",
        maxHeight: "10vh",
        boxShadow: theme === 'dark' ? '0 2px 8px 0 rgba(0,0,0,0.25)' : '0 2px 8px 0 rgba(0,0,0,0.06)'
      }}
    >
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/flowtile.svg"
            alt="FlowTile Logo"
            className="h-8 w-8 md:h-12 md:w-12"
          />
        </Link>
        <h1 className={`text-lg md:text-2xl font-semibold ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>FlowTile</h1>
        
        {/* Project Name Display - Only show when in editor and on desktop */}
        {isEditorPage && currentProject && !isMobile && (
          <div className="flex items-center ml-4">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>›</span>
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleProjectNameSave}
                onKeyDown={handleKeyPress}
                className={`ml-2 px-2 py-1 text-lg font-medium rounded border transition-colors
                  ${theme === 'dark' 
                    ? 'bg-[#2d2d2d] border-gray-600 text-white focus:border-[#00A5B5]' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#00A5B5]'
                  } focus:outline-none`}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            ) : (
              <button
                onClick={handleProjectNameClick}
                className={`ml-2 px-2 py-1 text-lg font-medium rounded transition-colors hover:bg-opacity-80
                  ${theme === 'dark' 
                    ? 'text-white hover:bg-[#2d2d2d]' 
                    : 'text-gray-900 hover:bg-gray-100'
                  }`}
                title="Click to rename project"
              >
                {currentProject.name}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className={`text-sm font-medium transition ${theme === 'dark' ? 'text-white hover:text-[#00A5B5]' : 'text-gray-900 hover:text-[#00A5B5]'}`}>Home</Link>
        <Link to="/projects" className={`text-sm font-medium transition ${theme === 'dark' ? 'text-white hover:text-[#00A5B5]' : 'text-gray-900 hover:text-[#00A5B5]'}`}>Projects</Link>
        <Link to="/editor" className={`text-sm font-medium transition ${theme === 'dark' ? 'text-white hover:text-[#00A5B5]' : 'text-gray-900 hover:text-[#00A5B5]'}`}>Editor</Link>
        <Link to="/docs" className={`text-sm font-medium transition ${theme === 'dark' ? 'text-white hover:text-[#00A5B5]' : 'text-gray-900 hover:text-[#00A5B5]'}`}>Docs</Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-4">
        {/* Mobile theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full focus:outline-none transition-colors border ${theme === 'dark' ? 'bg-[#23272b] border-gray-700 hover:bg-[#2d2d2d]' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Hamburger menu button */}
        <button
          onClick={toggleMobileMenu}
          className={`p-2 rounded-lg focus:outline-none transition-colors ${theme === 'dark' ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-100'}`}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full focus:outline-none transition-colors border ${theme === 'dark' ? 'bg-[#23272b] border-gray-700 hover:bg-[#2d2d2d]' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            // Sun icon for dark mode (click to switch to light)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            // Moon icon for light mode (click to switch to dark)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        <a
          href="https://github.com/VinayDangodra28/flowtile"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition border
            ${theme === 'dark' ? 'bg-[#23272b] border-gray-700 text-white hover:bg-[#2d2d2d]' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 .297a12 12 0 00-3.794 23.406c.6.11.793-.261.793-.577v-2.256c-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.833 2.807 1.303 3.492.996.107-.775.418-1.304.762-1.603-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.235-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016 0c2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.803 5.624-5.475 5.921.43.37.814 1.102.814 2.222v3.293c0 .319.192.694.8.576A12.003 12.003 0 0012 .297z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-1">GitHub</span>
        </a>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div 
            className={`fixed top-0 right-0 h-full w-64 shadow-lg transform transition-transform duration-300 ${
              theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-100'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu items */}
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                className={`text-lg font-medium transition py-2 ${theme === 'dark' ? 'text-white hover:text-[#00A5B5]' : 'text-gray-900 hover:text-[#00A5B5]'}`}
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/docs" 
                className={`text-lg font-medium transition py-2 ${theme === 'dark' ? 'text-white hover:text-[#00A5B5]' : 'text-gray-900 hover:text-[#00A5B5]'}`}
                onClick={toggleMobileMenu}
              >
                Docs
              </Link>
              
              {/* Disabled links for mobile with explanatory text */}
              <div className="border-t pt-4 mt-4">
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Desktop only features:
                </p>
                <div className={`text-lg font-medium py-2 opacity-50 cursor-not-allowed ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Projects
                </div>
                <div className={`text-lg font-medium py-2 opacity-50 cursor-not-allowed ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Editor
                </div>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Use a desktop or tablet for full editing experience
                </p>
              </div>

              {/* GitHub link */}
              <div className="border-t pt-4 mt-4">
                <a
                  href="https://github.com/VinayDangodra28/flowtile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-lg font-medium transition py-2 ${theme === 'dark' ? 'text-white hover:text-[#00A5B5]' : 'text-gray-900 hover:text-[#00A5B5]'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 .297a12 12 0 00-3.794 23.406c.6.11.793-.261.793-.577v-2.256c-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.833 2.807 1.303 3.492.996.107-.775.418-1.304.762-1.603-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.235-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016 0c2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.803 5.624-5.475 5.921.43.37.814 1.102.814 2.222v3.293c0 .319.192.694.8.576A12.003 12.003 0 0012 .297z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
