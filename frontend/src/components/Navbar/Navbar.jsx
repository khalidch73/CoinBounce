import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  // Assume isAuthenticated is a state variable indicating whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Function to handle logout
  const handleLogout = () => {
    // Perform logout actions
    // For example, clear authentication state, redirect, etc.
    setIsAuthenticated(false);
  };

  return (
    <>
    <nav className={styles.navbar}>
      <NavLink to="/" className={`${styles.logo} ${styles.inactiveStyle}`}>
        CoinBounce
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? styles.activeStyle : styles.inactiveStyle
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/crypto"
        className={({ isActive }) =>
          isActive ? styles.activeStyle : styles.inactiveStyle
        }
      >
        Cryptocurrencies
      </NavLink>
      <NavLink
        to="/blogs"
        className={({ isActive }) =>
          isActive ? styles.activeStyle : styles.inactiveStyle
        }
      >
        Blogs
      </NavLink>
      <NavLink
        to="/submit"
        className={({ isActive }) =>
          isActive ? styles.activeStyle : styles.inactiveStyle
        }
      >
        Submit Blog
      </NavLink>
      {/* Conditionally render logout or login/register button */}
      {isAuthenticated ? (
        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <>
          <NavLink
            to="/login"
            activeClassName={styles.activeStyle}
            className={styles.inactiveStyle}
          >
            <button className={styles.login}>Login</button>
          </NavLink>
          <NavLink
            to="/register"
            activeClassName={styles.activeStyle}
            className={styles.inactiveStyle}
          >
            <button className={styles.register}>Register</button>
          </NavLink>
        </>
      )}
    </nav>
    <div className={styles.separator}></div>
    </>
  );
};

export default Navbar;
