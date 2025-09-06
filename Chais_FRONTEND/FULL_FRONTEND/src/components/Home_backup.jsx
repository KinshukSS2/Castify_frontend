// src/pages/Home.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { listStories } from "./api/storyApi";
import Navbar from "./Navbar";
import { useNavbar } from "../contexts/NavbarContext";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [recentStories, setRecentStories] = useState([]);
  const { isCollapsed } = useNavbar();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchLatestVideos();
      fetchRecentStories();
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

  const fetchRecentStories = async () => {
    try {
      const response = await listStories();
      // Sort stories by creation date (most recent first) and get top 6
      const recentStories = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setRecentStories(recentStories);
    } catch (err) {
      console.error("Failed to fetch recent stories:", err);
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
          isCollapsed ? "collapsed" : ""
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
              <div className="stat-label">Videos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{recentStories.length}</div>
              <div className="stat-label">Stories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </section>

        {/* Action Cards Grid */}
        <section className="action-cards-section">
          <div className="action-cards-grid">
            <div
              className="action-card upload-card"
              onClick={() => navigate("/upload")}
            >
              <div className="action-icon">🎥</div>
              <h3>Upload Video</h3>
              <p>Share your moments with the world</p>
              <div className="action-arrow">→</div>
            </div>

            <div
              className="action-card story-card"
              onClick={() => navigate("/stories/create")}
            >
              <div className="action-icon">📚</div>
              <h3>Create Story</h3>
              <p>Tell interactive stories</p>
              <div className="action-arrow">→</div>
            </div>

            <div
              className="action-card explore-card"
              onClick={() => navigate("/all-videos")}
            >
              <div className="action-icon">🌟</div>
              <h3>Explore Content</h3>
              <p>Discover amazing videos</p>
              <div className="action-arrow">→</div>
            </div>

            <div
              className="action-card store-card"
              onClick={() => navigate("/store")}
            >
              <div className="action-icon">🛍️</div>
              <h3>Visit Store</h3>
              <p>Shop exclusive merchandise</p>
              <div className="action-arrow">→</div>
            </div>
          </div>
        </section>

        {/* Latest Videos Section */}
        <section className="latest-videos-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🎬</span>
              Latest Videos
            </h2>
            <button
              className="view-all-btn"
              onClick={() => navigate("/all-videos")}
            >
              View All
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎥</div>
              <h3>No videos yet</h3>
              <p>Start sharing your amazing content!</p>
              <button
                className="upload-btn"
                onClick={() => navigate("/upload")}
              >
                Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.slice(0, 6).map((video) => (
                <div
                  key={video._id}
                  className="video-card"
                  onClick={() => openVideoModal(video)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="play-overlay">
                      <div className="play-button">▶</div>
                    </div>
                    <div className="video-duration">
                      {Math.floor(video.duration / 60)}:
                      {String(video.duration % 60).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-description">
                      {video.description?.slice(0, 80)}...
                    </p>
                    <div className="video-stats">
                      <span className="views">👁 {video.views || 0} views</span>
                      <span className="date">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Stories Section */}
        <section className="top-stories-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🆕</span>
              Recent Stories
            </h2>
            <button
              className="view-all-btn"
              onClick={() => navigate("/stories")}
            >
              View All
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {recentStories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <h3>No stories yet</h3>
              <p>Start creating amazing interactive stories!</p>
              <button
                className="create-story-btn"
                onClick={() => navigate("/stories/create")}
              >
                Create Your First Story
              </button>
            </div>
          ) : (
            <div className="stories-grid">
              {recentStories.map((story, index) => (
                <div
                  key={story._id}
                  className={`story-card story-card-${index + 1}`}
                  onClick={() => navigate(`/stories/${story._id}`)}
                >
                  <div className="story-header">
                    <div className="story-number">{index + 1}</div>
                    <div className="story-date">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="story-content">
                    <h3 className="story-title">{story.title}</h3>
                    <p className="story-description">
                      {story.description?.slice(0, 100)}...
                    </p>
                  </div>
                  <div className="story-stats">
                    <div className="stat">
                      <span className="stat-icon">👁</span>
                      <span className="stat-value">
                        {story.totalViews || 0}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">
                        {story.totalLikes || 0}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">🔗</span>
                      <span className="stat-value">
                        {story.choices?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="story-gradient"></div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions Floating Bar */}
        <div className="quick-actions-bar">
          <button
            className="quick-action-btn upload-quick"
            onClick={() => navigate("/upload")}
            title="Upload Video"
          >
            <span className="action-icon">🎥</span>
          </button>
          <button
            className="quick-action-btn story-quick"
            onClick={() => navigate("/stories/create")}
            title="Create Story"
          >
            <span className="action-icon">📝</span>
          </button>
          <button
            className="quick-action-btn profile-quick"
            onClick={() => navigate("/profile")}
            title="Profile"
          >
            <span className="action-icon">👤</span>
          </button>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="video-modal-overlay" onClick={closeVideoModal}>
            <div className="video-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={closeVideoModal}>
                ×
              </button>
              <div className="modal-video-container">
                <video
                  src={selectedVideo.videoFile}
                  controls
                  autoPlay
                  className="modal-video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="modal-video-info">
                <h3>{selectedVideo.title}</h3>
                <p>{selectedVideo.description}</p>
                <div className="modal-video-stats">
                  <span>👁 {selectedVideo.views || 0} views</span>
                  <span>
                    📅 {new Date(selectedVideo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
