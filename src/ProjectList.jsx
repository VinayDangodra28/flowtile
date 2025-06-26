import React from "react";
import { saveProject as saveProjectModel, loadProject as loadProjectModel, listProjects, deleteProject as deleteProjectModel } from "./utils/projectModel";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    setProjects(listProjects());
  }, []);

  const handleOpen = (name) => {
    // Navigate to editor with project name as param
    navigate(`/editor/${encodeURIComponent(name)}`);
  };

  const handleCreate = () => {
    const name = prompt("Enter a name for your new project:");
    if (!name) return;
    if (projects.includes(name)) {
      alert("A project with this name already exists.");
      return;
    }
    // Save an empty project (or with default data)
    saveProjectModel(name, { shapes: [], canvasSize: { width: 500, height: 500 } });
    setProjects(listProjects());
    navigate(`/editor/${encodeURIComponent(name)}`);
  };

  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to delete the project "${name}"? This cannot be undone.`)) {
      deleteProjectModel(name);
      setProjects(listProjects());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <button
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          onClick={handleCreate}
        >
          + New Project
        </button>
        {projects.length === 0 ? (
          <div className="text-gray-500 text-center">No projects found.</div>
        ) : (
          <ul>
            {projects.map((name) => (
              <li key={name} className="mb-3 flex items-center justify-between">
                <span className="font-medium">{name}</span>
                <div>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleOpen(name)}
                  >
                    Open
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                    onClick={() => handleDelete(name)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
