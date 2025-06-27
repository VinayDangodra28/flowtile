// components/Navbar/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 bg-gray-900 text-white"
      style={{
        height: "10vh",
        minHeight: "10vh",
        maxHeight: "10vh",
      }}
      >
      <div className="flex items-center">
      <Link to="/"> 
        <img src="/flowtile.svg" alt="FlowTile Logo" style={{
          height: "5vh",
          width: "5vh",
        }} /></Link>
        <h1 className="text-2xl font-semibold">FlowTile</h1>
      </div>
      <a
        href="https://github.com/VinayDangodra28/flowtile"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded hover:bg-gray-600 transition"
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
    </nav>
  );
};

export default Navbar;
