import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Navbar.css";

const Navbar = ({ title, placeholder, profileImg, profileName }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Search query:", searchQuery);
    // Add search logic here
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // Add logout logic here
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
    // Add profile click logic here
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    // Add settings click logic here
  };

  return (
    <nav className="navbar">
      {/* Left Section: Title */}
      <div className="navbar-left">
        <h1>{title}</h1>
      </div>

      {/* Center Section: Search Bar */}
      <div className="navbar-center">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      {/* Right Section: Profile */}
      <div className="navbar-right">
        <div className="profile">
          <img
            src={profileImg}
            alt="Profile"
            className="profile-img"
            onClick={handleProfileClick}
          />
          <span>{profileName}</span>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-secondary dropdown-toggle"
              type="button"
              id="profileMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="profileMenu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={handleProfileClick}
                >
                  View Profile
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={handleSettingsClick}
                >
                  Settings
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  profileImg: PropTypes.string.isRequired,
  profileName: PropTypes.string.isRequired,
};

export default Navbar;
