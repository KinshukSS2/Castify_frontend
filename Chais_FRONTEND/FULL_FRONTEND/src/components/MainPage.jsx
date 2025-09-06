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

      {/* Hero Section */}
      <section className="hero-landing">
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
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🎯</span>
              Our Mission & Vision
            </h2>
          </div>

          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-header">
                <div className="card-icon">🚀</div>
                <h3 className="card-title">Our Mission</h3>
              </div>
              <div className="card-content">
                <p>
                  To democratize content creation and provide a platform where
                  every story matters. We believe in empowering creators with
                  cutting-edge tools and connecting them with audiences who
                  appreciate authentic, diverse content.
                </p>
                <div className="mission-points">
                  <div className="point">
                    <span className="point-icon">✨</span>
                    <span>Empower creators worldwide</span>
                  </div>
                  <div className="point">
                    <span className="point-icon">🌍</span>
                    <span>Build global communities</span>
                  </div>
                  <div className="point">
                    <span className="point-icon">💡</span>
                    <span>Foster innovation in storytelling</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="vision-card">
              <div className="card-header">
                <div className="card-icon">🔮</div>
                <h3 className="card-title">Our Vision</h3>
              </div>
              <div className="card-content">
                <p>
                  To become the world's most creative and inclusive platform for
                  interactive storytelling, where technology meets artistry and
                  every voice can reach its intended audience.
                </p>
                <div className="vision-goals">
                  <div className="goal">
                    <div className="goal-number">1M+</div>
                    <div className="goal-text">Active Creators</div>
                  </div>
                  <div className="goal">
                    <div className="goal-number">50M+</div>
                    <div className="goal-text">Stories Shared</div>
                  </div>
                  <div className="goal">
                    <div className="goal-number">∞</div>
                    <div className="goal-text">Possibilities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📞</span>
              Get In Touch
            </h2>
            <div className="section-subtitle">
              Ready to start your journey? We're here to help you every step of
              the way
            </div>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p>hello@castify.com</p>
                  <p>support@castify.com</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📱</div>
                <div className="contact-details">
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon-Fri, 9AM-6PM PST</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>Visit Us</h4>
                  <p>123 Innovation Street</p>
                  <p>San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">🌐</div>
                <div className="contact-details">
                  <h4>Follow Us</h4>
                  <div className="social-links">
                    <span className="social-link">Twitter</span>
                    <span className="social-link">Instagram</span>
                    <span className="social-link">LinkedIn</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <div className="form-header">
                <h3>Send us a message</h3>
                <p>We'll get back to you within 24 hours</p>
              </div>
              <form className="contact-form-container">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Your Message"
                    className="form-textarea"
                    rows="5"
                  ></textarea>
                </div>
                <button type="submit" className="form-submit-btn">
                  Send Message
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Why Choose Castify?
            </h2>
            <div className="section-subtitle">
              Experience the future of content creation with our innovative
              features
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">🎨</div>
              <h3>Creative Tools</h3>
              <p>
                Professional-grade editing tools and templates to bring your
                vision to life
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">🛡️</div>
              <h3>Secure Platform</h3>
              <p>
                Enterprise-level security to protect your content and personal
                information
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>
                Comprehensive insights to track your content performance and
                audience engagement
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">🤝</div>
              <h3>Community Driven</h3>
              <p>
                Connect with like-minded creators and build meaningful
                relationships
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">💰</div>
              <h3>Monetization</h3>
              <p>
                Multiple revenue streams to help you earn from your creative
                work
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">🚀</div>
              <h3>Fast & Reliable</h3>
              <p>Lightning-fast performance with 99.9% uptime guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="section-container">
          {/* Main Footer Content */}
          <div className="footer-content">
            <div className="footer-brand">
              <h2 className="footer-logo">Castify</h2>
              <div className="footer-social">
                <div className="social-icons">
                  <span className="social-icon">📘</span>
                  <span className="social-icon">🐦</span>
                  <span className="social-icon">📷</span>
                  <span className="social-icon">📺</span>
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Platform</h4>
                <ul>
                  <li>Browse Content</li>
                  <li>Upload Videos</li>
                  <li>Premium Plans</li>
                  <li>Creator Tools</li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li>Help Center</li>
                  <li>Contact Support</li>
                  <li>System Status</li>
                  <li>Documentation</li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Press</li>
                  <li>Blog</li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Cookie Policy</li>
                  <li>DMCA Policy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2025 Castify, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
