import React, { useContext } from "react";
import "./Navbar.css";
import { LoginContext } from "../context/LoginContext";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const { token, setToken } = useContext(LoginContext);
  const visibility = token ? "none" : "inline-block";
  const oppositeVisibility = !token ? "none" : "inline-block";

  return (
    <div className="header">
      {/* <img
        src="https://i.postimg.cc/8P0LjnXR/logo-removebg-preview.png"
        className="logo"
        alt="Coins Logo"
      /> */}
      <NavLink
        className={({ isActive }) => (isActive ? "link-active" : "link")}
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "link-active" : "link")}
        style={{ display: oppositeVisibility }}
        to="/favorites"
      >
        Favorites
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "link-active" : "link")}
        style={{ display: oppositeVisibility }}
        to="/details"
      >
        Details
      </NavLink>
      <button
        className="login-btn"
        style={{ display: `${visibility}` }}
        onClick={() => {
          localStorage.setItem("token", "1");
          setToken("1");
        }}
      >
        Login
      </button>
    </div>
  );
}
