import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Editor from "./components/Editor/Editor";
import Navbar from "./components/Navbar/Navbar";
import ProjectList from "./ProjectList";

const App = () => {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Navbar />
        {/* Show warning on small screens */}
        <div className="block md:hidden text-center p-8 text-red-600 font-semibold text-lg">
          This application is not available on mobile devices.
        </div>
        {/* Main content for medium and larger screens */}
        <div className="hidden md:block flex-1">
          <Routes>
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/editor/:projectName" element={<Editor />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
