import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);

  const updateProjectName = (oldName, newName) => {
    if (currentProject && currentProject.name === oldName) {
      setCurrentProject({ ...currentProject, name: newName });
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      currentProject, 
      setCurrentProject, 
      updateProjectName 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
