import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavbar } from "../contexts/NavbarContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { isCollapsed, setIsCollapsed } = useNavbar();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { path: "/home", icon: "🏠", label: "Home", color: "blue" },
    { path: "/profile", icon: "👤", label: "Profile", color: "purple" },
    { path: "/videos", icon: "🎬", label: "All Videos", color: "green" },
    { path: "/upload", icon: "⬆️", label: "Upload", color: "orange" },
    { path: "/stories", icon: "📖", label: "Stories", color: "teal" },
    {
      path: "/stories/create",
      icon: "➕",
      label: "Create Story",
      color: "pink",
    },
    { path: "/populate", icon: "🎲", label: "Populate", color: "yellow" },
  ];

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      {/* Navbar */}
      <nav className={`luxury-navbar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Header */}
        <div className="navbar-header">
          <div className="brand">
            <div className="brand-icon">🎭</div>
            {!isCollapsed && <span className="brand-text">Castify</span>}
          </div>
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* User Profile Section */}
        <div className="user-section">
          <div className="user-avatar">{user.fullname[0].toUpperCase()}</div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">{user.fullname}</div>
              <div className="user-email">{user.email}</div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive(item.path) ? "active" : ""} ${
                item.color
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
              {isActive(item.path) && <div className="active-indicator"></div>}
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="navbar-footer">
          <button
            onClick={handleLogout}
            className="nav-item logout"
            title={isCollapsed ? "Logout" : ""}
          >
            <span className="nav-icon">🚪</span>
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </nav>

      {/* Backdrop for mobile */}
      {!isCollapsed && (
        <div
          className="navbar-backdrop"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
    </>
  );
}
