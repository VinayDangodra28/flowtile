// src/components/shared/MobileRestriction.jsx
import React from "react";

const MobileRestriction = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Desktop Required</h2>
        <p className="text-gray-600 mb-6">
          The FlowTile editor requires a larger screen for the best experience. Please use a desktop or tablet to access the full editing features.
        </p>
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-gradient-to-r from-[#00343C] to-[#00A5B5] text-white py-2 px-4 rounded-lg font-medium hover:from-[#006B74] hover:to-[#82E9F0] transition-all"
          >
            Go to Homepage
          </a>
          <a
            href="/docs"
            className="block w-full bg-white text-[#00343C] py-2 px-4 rounded-lg font-medium border border-[#00A5B5] hover:bg-gray-50 transition-all"
          >
            View Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileRestriction;
