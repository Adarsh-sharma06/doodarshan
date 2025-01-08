import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../service/firebase";
import "./Sidebar.css"; // Your updated CSS file

function Sidebar({
  logoSrc = "/images/DD.png",
  logoText = "Doordarshan",
  menuSections = [],
  showLogout = false,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Sign out from Firebase
      navigate("/");  // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {/* Burger Menu for Mobile */}
      <div
        className={`burger-menu d-md-none ${isSidebarOpen ? "open" : ""}`}
        onClick={toggleSidebar}
      >
        <i className={`bi ${isSidebarOpen ? "bi-x" : "bi-list"}`}></i>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar bg-light shadow-sm ${
          isSidebarOpen ? "active" : ""
        } d-md-block`}
      >
        {/* Logo Section */}
        <div className="logo text-center p-4">
          <h6 className="d-flex align-items-center justify-content-center">
            <img src={logoSrc} alt="Logo" className="logo-img me-3" />
            {logoText}
          </h6>
        </div>

        {/* Menu Section */}
        <ul className="menu list-unstyled w-100">
          {menuSections.map((section, index) => (
            <div key={index} className="mb-3">
              {section.heading && (
                <li className="menu-heading text-muted px-3 mt-2">
                  {section.heading}
                </li>
              )}
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="py-2 px-3">
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      isActive
                        ? "text-decoration-none text-dark active"
                        : "text-decoration-none text-dark"
                    }
                    end
                  >
                    {item.icon && <i className={`${item.icon} me-2`}></i>}
                    {item.name}
                  </NavLink>
                </li>
              ))}
               {showLogout && index === menuSections.length - 1 && (
                <li className="py-2 px-3 ">
                  <button
                    onClick={handleLogout}
                    className="btn btn-link text-dark text-decoration-none d-flex align-items-center"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              )}
            </div>
          ))}

        
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
