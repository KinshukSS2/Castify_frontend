import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* Avatar */}
        <div className="avatar-ring">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="avatar"
            className="avatar-img"
          />
        </div>

        {/* User info */}
        <h2 className="user-name">{user.fullname}</h2>
        <p className="user-handle">@{user.username}</p>

        {/* Info grid */}
        <div className="info-grid">
          <div className="info-box">
            <span>Email</span>
            <p>{user.email}</p>
          </div>
          <div className="info-box">
            <span>Username</span>
            <p>{user.username}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <button onClick={() => navigate("/home")} className="chip-btn purple">
            ⬅ Back Home
          </button>
          <button onClick={() => navigate("/videos")} className="chip-btn blue">
            🎥 My Videos
          </button>
          <button onClick={() => navigate("/upload")} className="chip-btn green">
            ⬆ Upload
          </button>
        </div>
      </div>
    </div>
  );
}
