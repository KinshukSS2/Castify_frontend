import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {};
      if (formData.email.trim()) payload.email = formData.email;
      if (formData.username.trim()) payload.username = formData.username;
      payload.password = formData.password;

      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        payload,
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      setMessage({ type: "success", text: "✅ Login successful!" });
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text: "❌ " + (err.response?.data?.message || "Login failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>

      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Log in to continue</p>

        <div className="input-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required={!formData.email}
          />
          <label>Username</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required={!formData.username}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? <span className="loader"></span> : "Login"}
        </button>

        {message && (
          <div className={`toast ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
