// components/Navbar/Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}><img style={styles.logoImage} src="/flowtile.svg" alt="Google Logo"/>FlowTile</h1>
    </nav>
  );
};

const styles = {
  nav: {
    padding: "1rem 2rem",
    backgroundColor: "#282c34",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
    lineHeight: "3rem",
  },
  logoImage: {
    height: "3rem",
    marginRight: "1rem",
  },
};

export default Navbar;
