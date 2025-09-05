import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import axios from "axios";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    // Only redirect if both user data and valid token exist
    if (user && token) {
      try {
        JSON.parse(user); // Validate it's proper JSON
        navigate("/home");
      } catch (error) {
        // If user data is corrupted, clear it
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "avatar") setAvatar(e.target.files[0]);
    if (e.target.name === "coverimage") setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (avatar) data.append("avatar", avatar);
    if (coverImage) data.append("coverimage", coverImage);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("user", JSON.stringify(res.data.data));

      navigate("/home");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        "❌ Registration failed: " +
          (err.response?.data?.message || "Server error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Unique floating geometric shapes */}
      <div className="register-shape shape1"></div>
      <div className="register-shape shape2"></div>
      <div className="register-shape shape3"></div>

      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Register</h2>
          <p className="register-subtitle">
            Create your account and join our community
          </p>

          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="input-grid">
                <div className="input-group">
                  <input
                    type="text"
                    name="fullname"
                    placeholder=" "
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                  <label>Full Name</label>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    name="username"
                    placeholder=" "
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <label>Username</label>
                </div>
              </div>
            </div>

            {/* Account Details Section */}
            <div className="form-section">
              <h3 className="section-title">Account Details</h3>
              <div className="input-grid single">
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label>Email Address</label>
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <label>Password</label>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="form-section">
              <h3 className="section-title">Profile Assets</h3>
              <div className="upload-grid">
                <label className={`file-upload ${avatar ? "uploaded" : ""}`}>
                  <div className="upload-icon">👤</div>
                  <div className="upload-text">
                    {avatar ? "Avatar Uploaded" : "Upload Avatar"}
                  </div>
                  <div className="upload-subtext">Required • JPG, PNG</div>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    required
                  />
                </label>

                <label
                  className={`file-upload ${coverImage ? "uploaded" : ""}`}
                >
                  <div className="upload-icon">🖼️</div>
                  <div className="upload-text">
                    {coverImage ? "Cover Uploaded" : "Upload Cover"}
                  </div>
                  <div className="upload-subtext">Optional • JPG, PNG</div>
                  <input
                    type="file"
                    name="coverimage"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="register-btn">
              {loading ? (
                <>
                  <span className="loader"></span>
                  <span style={{ marginLeft: "10px" }}>
                    Creating Account...
                  </span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="redirect-section">
            <p className="redirect-text">Already have an account?</p>
            <Link to="/login" className="redirect-link">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
