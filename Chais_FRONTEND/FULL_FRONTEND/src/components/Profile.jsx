import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useNavbar } from "../contexts/NavbarContext";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { isCollapsed } = useNavbar();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/register");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div
        className={`profile-page with-navbar ${isCollapsed ? "collapsed" : ""}`}
      >
        {/* Floating background elements */}
        <div className="profile-background">
          <div className="bg-orb orb-1"></div>
          <div className="bg-orb orb-2"></div>
          <div className="bg-orb orb-3"></div>
        </div>

        {/* Profile Header */}
        <section className="profile-header">
          <div className="cover-section">
            <div className="cover-image">
              {user.coverImage && (
                <img src={user.coverImage} alt="Cover" className="cover-img" />
              )}
              <div className="cover-overlay"></div>
            </div>

            <div className="profile-info">
              <div className="avatar-section">
                <div className="avatar-container">
                  <img
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <div className="avatar-ring"></div>
                  <div className="status-dot"></div>
                </div>
              </div>

              <div className="user-details">
                <h1 className="display-name">{user.fullname}</h1>
                <p className="username">@{user.username}</p>
                <div className="user-meta">
                  <span className="join-date">🗓️ Joined 2024</span>
                  <span className="user-level">⭐ Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="profile-nav">
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="tab-icon">📊</span>
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              <span className="tab-icon">🎬</span>
              Activity
            </button>
            <button
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="tab-icon">⚙️</span>
              Settings
            </button>
          </div>
        </section>

        {/* Profile Content */}
        <section className="profile-content">
          {activeTab === "overview" && (
            <div className="overview-content">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🎥</div>
                  <div className="stat-value">24</div>
                  <div className="stat-label">Videos Uploaded</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👁️</div>
                  <div className="stat-value">1.2K</div>
                  <div className="stat-label">Total Views</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-value">342</div>
                  <div className="stat-label">Likes Received</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">89%</div>
                  <div className="stat-label">Engagement Rate</div>
                </div>
              </div>

              {/* User Information */}
              <div className="info-section">
                <h2 className="section-title">Personal Information</h2>
                <div className="info-cards">
                  <div className="info-card">
                    <div className="info-header">
                      <span className="info-icon">📧</span>
                      <span className="info-title">Email Address</span>
                    </div>
                    <div className="info-value">{user.email}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-header">
                      <span className="info-icon">👤</span>
                      <span className="info-title">Username</span>
                    </div>
                    <div className="info-value">@{user.username}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-header">
                      <span className="info-icon">🎭</span>
                      <span className="info-title">Full Name</span>
                    </div>
                    <div className="info-value">{user.fullname}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="activity-content">
              <h2 className="section-title">Recent Activity</h2>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">🎬</div>
                  <div className="activity-details">
                    <div className="activity-text">Uploaded a new video</div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">❤️</div>
                  <div className="activity-details">
                    <div className="activity-text">Received 15 new likes</div>
                    <div className="activity-time">1 day ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-details">
                    <div className="activity-text">Created a new story</div>
                    <div className="activity-time">3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-content">
              <h2 className="section-title">Account Settings</h2>
              <div className="settings-grid">
                <button
                  className="setting-card"
                  onClick={() => navigate("/upload")}
                >
                  <div className="setting-icon">📤</div>
                  <div className="setting-title">Upload Content</div>
                  <div className="setting-desc">Share videos and stories</div>
                </button>
                <button
                  className="setting-card"
                  onClick={() => navigate("/videos")}
                >
                  <div className="setting-icon">🎬</div>
                  <div className="setting-title">My Videos</div>
                  <div className="setting-desc">Manage your content</div>
                </button>
                <button
                  className="setting-card"
                  onClick={() => navigate("/stories")}
                >
                  <div className="setting-icon">📖</div>
                  <div className="setting-title">My Stories</div>
                  <div className="setting-desc">View your stories</div>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions Floating Panel */}
        <div className="floating-actions">
          <button
            className="floating-btn primary"
            onClick={() => navigate("/upload")}
          >
            📤
          </button>
          <button
            className="floating-btn secondary"
            onClick={() => navigate("/home")}
          >
            🏠
          </button>
        </div>
      </div>
    </>
  );
}
