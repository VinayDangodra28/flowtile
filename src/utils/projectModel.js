// src/utils/projectModel.js
// Model for saving, reading, and writing projects (localStorage for now, backend-ready)

const PROJECT_PREFIX = 'flowtile_project_';

export const saveProject = (name, data) => {
  localStorage.setItem(`${PROJECT_PREFIX}${name}`, JSON.stringify(data));
};

export const loadProject = (name) => {
  const data = localStorage.getItem(`${PROJECT_PREFIX}${name}`);
  return data ? JSON.parse(data) : null;
};

export const listProjects = () => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(PROJECT_PREFIX))
    .map(key => key.replace(PROJECT_PREFIX, ''));
};

export const deleteProject = (name) => {
  localStorage.removeItem(`${PROJECT_PREFIX}${name}`);
};
