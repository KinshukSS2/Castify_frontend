import { useNavigate } from "react-router-dom";
import "./MainPage.css";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <div className="overlay" />

      {/* Centered Content */}
      <div className="content">
        <h1 className="title">Welcome to Chai App ☕</h1>
        <p className="subtitle">Stream. Connect. Enjoy.</p>

        <div className="actions">
          <button onClick={() => navigate("/login")} className="btn light">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="btn dark">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
