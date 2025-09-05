import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import LightRays from "./bits/LightRays.jsx";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      {/* Unique floating particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Enhanced background with light rays */}
      <div className="background">
        <LightRays
          raysOrigin="center"
          raysColor="#3b82f6"
          raysSpeed={1.2}
          lightSpread={0.6}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.08}
          distortion={0.03}
          className="custom-rays"
        />
      </div>

      {/* Gradient overlay */}
      <div className="overlay" />

      {/* Main content */}
      <div className="content">
        <div className="hero-section">
          <h1 className="title">Castify</h1>
          <p className="subtitle">Stream • Connect • Discover</p>
        </div>

        {/* Feature highlights */}
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🎬</div>
            <div className="feature-text">Stream Videos</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🌐</div>
            <div className="feature-text">Global Community</div>
          </div>
          <div className="feature">
            <div className="feature-icon">✨</div>
            <div className="feature-text">Premium Experience</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="actions">
          <button onClick={() => navigate("/login")} className="btn primary">
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn secondary"
          >
            Join Now
          </button>
        </div>
      </div>

      {/* Footer tagline */}
      <div className="footer-tagline">Experience Entertainment Redefined</div>
    </div>
  );
}
