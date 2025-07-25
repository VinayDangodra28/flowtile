import React, { useState, useEffect } from "react";
import { saveProject as saveProjectModel, loadProject as loadProjectModel, listProjects, deleteProject as deleteProjectModel } from "../services";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit3, Calendar, Layers, Maximize2, Search, Grid, List, RefreshCw } from "lucide-react";
import { useTheme } from "../context";

import { Helmet } from "react-helmet-async";
const ProjectList = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    const projectsList = listProjects();
    console.log('Projects loaded:', projectsList);
    projectsList.forEach(project => {
      console.log(`Project "${project.name}":`, {
        hasThumbnail: !!project.thumbnail,
        thumbnailType: project.thumbnail ? typeof project.thumbnail : 'none',
        thumbnailStartsWith: project.thumbnail ? project.thumbnail.substring(0, 50) + '...' : 'none'
      });
    });
    setProjects(projectsList);
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (name) => {
    navigate(`/editor/${encodeURIComponent(name)}`);
  };

  const handleCreate = () => {
    if (!newProjectName.trim()) return;
    
    const trimmedName = newProjectName.trim();
    if (projects.some(p => p.name === trimmedName)) {
      alert("A project with this name already exists.");
      return;
    }
    
    // Create a simple test thumbnail for new projects
    const testThumbnail = createTestThumbnail();
    
    saveProjectModel(trimmedName, { 
      shapes: [], 
      canvasSize: { width: 500, height: 500 },
      createdAt: new Date().toISOString()
    }, testThumbnail);
    setProjects(listProjects());
    setShowCreateModal(false);
    setNewProjectName("");
    navigate(`/editor/${encodeURIComponent(trimmedName)}`);
  };

  // Create a simple test thumbnail for debugging
  const createTestThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple gradient background
    const gradient = ctx.createLinearGradient(0, 0, 300, 200);
    gradient.addColorStop(0, '#4F46E5');
    gradient.addColorStop(1, '#7C3AED');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 200);
    
    // Draw some text
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Test Project', 150, 100);
    
    return canvas.toDataURL('image/png', 0.8);
  };

  const handleDelete = (name, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      deleteProjectModel(name);
      setProjects(listProjects());
    }
  };

  const handleRegenerateThumbnail = (projectName, e) => {
    e.stopPropagation();
    console.log('Regenerating thumbnail for:', projectName);
    
    // Load the current project data
    const currentData = loadProjectModel(projectName);
    if (currentData) {
      // Create a test thumbnail
      const testThumbnail = createTestThumbnail();
      
      // Save the project with the new thumbnail
      saveProjectModel(projectName, currentData, testThumbnail);
      
      // Reload the projects list
      setProjects(listProjects());
      console.log('Thumbnail regenerated for:', projectName);
    } else {
      console.error('Could not load project data for:', projectName);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const ProjectCard = ({ project }) => (
    <div 
      className={`group relative rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border overflow-hidden 
        ${theme === 'dark' ? 'bg-[#23272b] border-[#3a3a3a]' : 'bg-white border-gray-100'}`}
      onClick={() => handleOpen(project.name)}
    >
      {/* Thumbnail */}
      <div className={`relative h-48 flex items-center justify-center overflow-hidden 
        ${theme === 'dark' ? 'bg-gradient-to-br from-[#23272b] to-[#2d2d2d]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        {project.thumbnail && project.thumbnail.startsWith('data:image') ? (
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Thumbnail load error for project:', project.name);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`flex flex-col items-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} ${project.thumbnail && project.thumbnail.startsWith('data:image') ? 'hidden' : ''}`}>
          <Maximize2 className="w-12 h-12 mb-2" />
          <span className="text-sm">No Preview</span>
          {project.thumbnail && !project.thumbnail.startsWith('data:image') && (
            <span className="text-xs text-red-400 mt-1">Invalid thumbnail</span>
          )}
        </div>
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center 
          ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className={`px-4 py-2 rounded-lg font-medium shadow-lg 
              ${theme === 'dark' ? 'bg-[#23272b] text-[#82E9F0]' : 'bg-white text-gray-800'}`}>
              Open Project
            </button>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-lg truncate flex-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {project.name}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => handleDelete(project.name, e)}
              className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-red-900/20 text-red-400 hover:text-red-500' : 'hover:bg-red-50 text-red-500 hover:text-red-600'}`}
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>{project.shapeCount} shapes</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            <span>{project.canvasSize.width} × {project.canvasSize.height}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Modified {formatDate(project.lastModified)}</span>
          </div>
          {/* Debug info - remove in production */}
          {/* <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Thumbnail: {project.thumbnail ? 'Yes' : 'No'}</span>
            {project.thumbnail && (
              <span>({project.thumbnail.substring(0, 20)}...)</span>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );

  const ProjectListItem = ({ project }) => (
    <div 
      className={`group rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border p-4 
        ${theme === 'dark' ? 'bg-[#23272b] border-[#3a3a3a]' : 'bg-white border-gray-100'}`}
      onClick={() => handleOpen(project.name)}
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className={`relative w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 
          ${theme === 'dark' ? 'bg-gradient-to-br from-[#23272b] to-[#2d2d2d]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          {project.thumbnail && project.thumbnail.startsWith('data:image') ? (
            <img 
              src={project.thumbnail} 
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Thumbnail load error for project:', project.name);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`flex items-center justify-center ${project.thumbnail && project.thumbnail.startsWith('data:image') ? 'hidden' : ''} ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <Maximize2 className="w-6 h-6" />
          </div>
        </div>

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {project.name}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => handleRegenerateThumbnail(project.name, e)}
                className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-blue-900/20 text-blue-400 hover:text-blue-500' : 'hover:bg-blue-50 text-blue-500 hover:text-blue-600'}`}
                title="Regenerate thumbnail"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleDelete(project.name, e)}
                className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-red-900/20 text-red-400 hover:text-red-500' : 'hover:bg-red-50 text-red-500 hover:text-red-600'}`}
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {project.shapeCount} shapes
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />
              {project.canvasSize.width} × {project.canvasSize.height}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(project.lastModified)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile warning component
  const MobileWarning = () => (
    <div className="md:hidden h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <Maximize2 className="w-16 h-16 mx-auto text-red-500 mb-4" />
        </div>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Desktop Required
        </h2>
        <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          The Projects page requires a desktop or tablet device for the best experience.
        </p>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Please visit this page on a larger screen to manage your projects.
        </p>
      </div>
    </div>
  );

  return (
    <>
    <Helmet>
  <title>Projects | FlowTile</title>
  <meta name="title" content="Projects | FlowTile - Organize Your Tile Designs" />
  <meta name="description" content="View, manage, and organize your FlowTile projects. Access your creative tile-based designs and start editing or creating new projects with ease." />
  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />
  <link rel="canonical" href="https://flowtile.vercel.app/projects" />
  <link rel="icon" href="/flowtile.svg" type="image/svg+xml" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://flowtile.vercel.app/projects" />
  <meta property="og:site_name" content="FlowTile" />
  <meta property="og:title" content="Projects | FlowTile - Organize Your Tile Designs" />
  <meta property="og:description" content="View, manage, and organize your FlowTile projects. Access your creative tile-based designs and start editing or creating new projects with ease." />
  <meta property="og:image" content="https://flowtile.vercel.app/banner.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://flowtile.vercel.app/projects" />
  <meta name="twitter:title" content="Projects | FlowTile - Organize Your Tile Designs" />
  <meta name="twitter:description" content="View, manage, and organize your FlowTile projects. Access your creative tile-based designs and start editing or creating new projects with ease." />
  <meta name="twitter:image" content="https://flowtile.vercel.app/banner.webp" />
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "FlowTile Projects",
      "url": "https://flowtile.vercel.app/projects",
      "description": "View, manage, and organize your FlowTile projects. Access your creative tile-based designs and start editing or creating new projects with ease.",
      "publisher": {
        "@type": "Person",
        "name": "Vinay Dangodra"
      }
    })}
  </script>
</Helmet>

<div className={`min-h-screen ${theme === 'dark' ? 'bg-[#242424]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Show mobile warning on small screens */}
      <MobileWarning />
      
      {/* Desktop content */}
      <div className="hidden md:block">
        {/* Header */}
        <div className={`${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>My Projects</h1>
                <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Create and manage your FlowTile designs</p>
              </div>
              <div className="flex gap-3">
                
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  New Project
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800'}`}
            />
          </div>
          
          <div className={`flex items-center gap-2 rounded-lg border p-1 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'}`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === "grid" 
                  ? theme === 'dark' ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600" 
                  : theme === 'dark' ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === "list" 
                  ? theme === 'dark' ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600" 
                  : theme === 'dark' ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              {searchTerm ? (
                <>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-4">
                    No projects match "{searchTerm}". Try adjusting your search terms.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first project to get started with FlowTile.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Create Project
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredProjects.map((project) => (
              viewMode === "grid" ? (
                <ProjectCard key={project.name} project={project} />
              ) : (
                <ProjectListItem key={project.name} project={project} />
              )
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-md w-full p-6 border 
            ${theme === 'dark' ? 'bg-[#23272b] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    ${theme === 'dark' 
                      ? 'bg-[#2d2d2d] border-gray-700 text-gray-100 placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-200 
                    ${theme === 'dark' 
                      ? 'border-gray-700 text-gray-300 hover:bg-[#2d2d2d]' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newProjectName.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 
                    ${theme === 'dark' 
                      ? 'bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
    
  );
};

export default ProjectList;
