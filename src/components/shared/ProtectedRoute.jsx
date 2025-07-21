// src/components/shared/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import MobileRestriction from "./MobileRestriction";
import { MOBILE_BREAKPOINT } from "../../constants";

const ProtectedRoute = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (isMobile) {
    return <MobileRestriction />;
  }

  return children;
};

export default ProtectedRoute;
