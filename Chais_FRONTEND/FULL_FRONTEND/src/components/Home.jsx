// src/pages/Home.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchLatestVideos();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchLatestVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8000/api/v1/videos/getAll-videos?page=1&limit=12",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos(res.data.videos);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div
        className={`home-container with-navbar ${
          isNavCollapsed ? "collapsed" : ""
        }`}
      >
        {/* Floating background elements */}
        <div className="floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>

        {/* Hero Welcome Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="welcome-badge">
              <span className="badge-icon">✨</span>
              <span className="badge-text">Welcome Back</span>
            </div>
            <h1 className="hero-title">
              Hello, <span className="gradient-text">{user.fullname}</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing content curated just for you
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{videos.length}</div>
              <div className="stat-label">Videos Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Possibilities</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">🎬</div>
              <div className="stat-label">Entertainment</div>
            </div>
          </div>
        </section>

        {/* Featured Videos Section */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🔥</span>
              Featured Content
            </h2>
            <button
              className="view-all-btn"
              onClick={() => navigate("/videos")}
            >
              View All
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">�</div>
              <h3>No videos yet</h3>
              <p>Be the first to upload amazing content!</p>
              <button
                className="upload-btn"
                onClick={() => navigate("/upload")}
              >
                Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.slice(0, 8).map((video, index) => (
                <div
                  key={video._id}
                  className="video-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => openVideoModal(video)}
                >
                  <div className="card-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="thumbnail-overlay">
                      <div className="play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="video-duration">5:30</div>
                  </div>
                  <div className="card-content">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-description">{video.description}</p>
                    <div className="video-meta">
                      <span className="upload-date">2 days ago</span>
                      <span className="video-views">1.2K views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions Section */}
        <section className="quick-actions">
          <h3 className="actions-title">Quick Actions</h3>
          <div className="actions-grid">
            <button
              className="action-card upload"
              onClick={() => navigate("/upload")}
            >
              <div className="action-icon">📤</div>
              <div className="action-title">Upload Video</div>
              <div className="action-desc">Share your content</div>
            </button>
            <button
              className="action-card story"
              onClick={() => navigate("/stories/create")}
            >
              <div className="action-icon">📝</div>
              <div className="action-title">Create Story</div>
              <div className="action-desc">Tell your story</div>
            </button>
            <button
              className="action-card explore"
              onClick={() => navigate("/videos")}
            >
              <div className="action-icon">🌟</div>
              <div className="action-title">Explore</div>
              <div className="action-desc">Discover content</div>
            </button>
          </div>
        </section>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="video-modal" onClick={closeVideoModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeVideoModal}>
                ×
              </button>
              <div className="modal-header">
                <h3>{selectedVideo.title}</h3>
              </div>
              <div className="modal-video-container">
                <video
                  controls
                  autoPlay
                  src={selectedVideo.videoFile}
                  className="modal-video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="modal-description">
                <p>{selectedVideo.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
