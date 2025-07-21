// src/services/projectService.js
// Service for handling project CRUD operations

import { PROJECT_PREFIX } from '../constants';

export const saveProject = (name, data, thumbnail = null) => {
  const projectData = {
    ...data,
    thumbnail,
    lastModified: new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString()
  };
  localStorage.setItem(`${PROJECT_PREFIX}${name}`, JSON.stringify(projectData));
};

export const loadProject = (name) => {
  const data = localStorage.getItem(`${PROJECT_PREFIX}${name}`);
  return data ? JSON.parse(data) : null;
};

export const listProjects = () => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(PROJECT_PREFIX))
    .map(key => {
      const name = key.replace(PROJECT_PREFIX, '');
      const data = loadProject(name);
      return {
        name,
        thumbnail: data?.thumbnail,
        lastModified: data?.lastModified,
        createdAt: data?.createdAt,
        shapeCount: data?.shapes?.length || 0,
        canvasSize: data?.canvasSize || { width: 500, height: 500 }
      };
    })
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
};

export const deleteProject = (name) => {
  localStorage.removeItem(`${PROJECT_PREFIX}${name}`);
};

export const renameProject = (oldName, newName) => {
  // Check if the new name already exists
  if (loadProject(newName)) {
    throw new Error('A project with this name already exists');
  }
  
  // Load the existing project data
  const projectData = loadProject(oldName);
  if (!projectData) {
    throw new Error('Project not found');
  }
  
  // Save the project with the new name
  saveProject(newName, projectData, projectData.thumbnail);
  
  // Delete the old project
  deleteProject(oldName);
  
  return true;
};
