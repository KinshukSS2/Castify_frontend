// src/pages/Home.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
        "http://localhost:8000/api/v1/videos/getAll-videos?page=1&limit=8",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos(res.data.videos);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  };

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
      alert("❌ Logout failed");
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
    <div className="home-container">
      {/* Glass welcome card */}
      <div className="welcome-card pop-animation">
        <div className="avatar">{user.fullname[0]}</div>
        <div>
          <h2>
            Welcome back, <span>{user.fullname}</span> 👋
          </h2>
          <p>Your personalized video hub</p>
        </div>
      </div>

      {/* Navigation actions */}
      <div className="nav-actions">
        <button onClick={() => navigate("/profile")} className="glass-btn purple">👤 Profile</button>
        <button onClick={handleLogout} className="glass-btn red">🚪 Logout</button>
        <button onClick={() => navigate("/videos")} className="glass-btn green">🎬 All Videos</button>
        <button onClick={() => navigate("/upload")} className="glass-btn blue">⬆️ Upload</button>
        <button onClick={() => navigate("/stories")} className="glass-btn orange">📖 All Stories</button>
        <button onClick={() => navigate("/stories/create")} className="glass-btn teal">➕ Create Story</button>
        <button onClick={() => navigate("/populate")} className="glass-btn gradient">🎯 Populate Content</button>
      </div>

      {/* Latest videos */}
      <div className="videos-section">
        <h3 className="section-title">🔥 Latest Videos</h3>
        {videos.length === 0 ? (
          <p className="no-videos">No videos uploaded yet. 🚀</p>
        ) : (
          <div className="video-grid">
            {videos.map((video, i) => (
              <div
                key={video._id}
                className="video-card fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => openVideoModal(video)}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="play-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <p>{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeVideoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeVideoModal}>×</button>
            <h3>{selectedVideo.title}</h3>
            <video
              controls
              autoPlay
              src={selectedVideo.videoFile}
              className="modal-video"
            >
              Your browser does not support the video tag.
            </video>
            <p className="video-description">{selectedVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
