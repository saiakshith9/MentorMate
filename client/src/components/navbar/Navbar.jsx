import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../searchbar/SearchBar.jsx";
import "./Navbar.css";
import { GlobalState } from "../../GlobalState.jsx";

const Navbar = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.UserApi.isLogged;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/scroll.js";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const logout = (e) => {
    localStorage.removeItem("id");
    handleSuccess("You've been logged out!");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <Link to="/">
          <div className="navbar-brand">
            <img src="/brand.png" alt="Mentor Mate" />
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <SearchBar />
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/">
                <div className="nav-link" aria-current="page">
                  Home
                </div>
              </Link>
            </li>
            <li className="nav-item">
              {isLogged && (
                <Link to="/courses">
                  <div className="nav-link">My Courses</div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {!isLogged ? (
                <Link to="/register">
                  <div className="nav-link">Signin/ Signup</div>
                </Link>
              ) : (
                <Link to="/" onClick={logout}>
                  <div className="nav-link">Logout</div>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
