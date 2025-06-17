import React from "react";
import Editor from "./components/Editor/Editor";
import Navbar from "./components/Navbar/Navbar";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      {/* Show warning on small screens */}
      <div className="block md:hidden text-center p-8 text-red-600 font-semibold text-lg">
        This application is not available on mobile devices.
      </div>

      {/* Show editor only on medium and larger screens */}
      <div className="hidden md:block">
        <Editor />
      </div>
    </div>
  );
};

export default App;
