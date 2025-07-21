import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Editor, Navbar, ProtectedRoute } from "./components";
import { Home, Docs, ProjectList } from "./pages";
import { ThemeProvider, ProjectProvider } from "./context";

const App = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/docs" element={<Docs />} />
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute>
                      <ProjectList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editor/:projectName" 
                  element={
                    <ProtectedRoute>
                      <Editor />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editor" 
                  element={
                    <ProtectedRoute>
                      <Editor />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
