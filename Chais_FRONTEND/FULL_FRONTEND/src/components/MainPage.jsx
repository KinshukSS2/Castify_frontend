import { useNavigate } from "react-router-dom";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./MainPage.css";
import LightRays from "./bits/LightRays.jsx";
import dialogflowService from "./api/dialogflowService.jsx";

export default function MainPage() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your enhanced Castify AI assistant! 🤖 I can help you with platform features, video uploads, pricing, community info, and much more. I'm powered by advanced AI to give you better answers. How can I help you today?",
      source: "system",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage("");

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // Get user context (you can expand this based on your app state)
      const userContext = {
        isLoggedIn: !!localStorage.getItem("token"), // Check if user is logged in
      };

      // Use Dialogflow service for intelligent responses
      const result = await dialogflowService.processQuery(
        userMessage,
        userContext
      );

      console.log(`🤖 Chat Response (${result.source}):`, result.response);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: result.response,
          source: result.source, // Track response source for debugging
          intent: result.intent,
          confidence: result.confidence,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      // Fallback response on error
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I'm sorry, I'm having trouble understanding right now. Please try asking about our features, how to upload videos, pricing, or contact information.",
          source: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Contact form handlers
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // EmailJS configuration with your actual credentials
      const serviceId = "service_ncnao1y";
      const templateId = "template_7kir0ai";
      const publicKey = "_p2-a5BBqPi2CCnfR";

      const templateParams = {
        from_name: contactForm.name,
        from_email: contactForm.email,
        subject: contactForm.subject,
        message: contactForm.message,
        to_email: "kinshuk380@gmail.com",
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitMessage(
        "Message sent successfully! We'll get back to you soon."
      );
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Email sending failed:", error);
      setSubmitMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <p>(+91) 9496753214</p>
                  <p>Mon-Fri, 9AM-6PM PST</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>Visit Us</h4>
                  <p>Incubation Center,IIT</p>
                  <p>Lucknow,UP,94105</p>
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
              {submitMessage && (
                <div
                  className={`submit-message ${
                    submitMessage.includes("successfully") ? "success" : "error"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
              <form
                className="contact-form-container"
                onSubmit={handleContactSubmit}
              >
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    placeholder="Your Name"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    placeholder="Your Email"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactInputChange}
                    placeholder="Subject"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    placeholder="Your Message"
                    className="form-textarea"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
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

      {/* AI Chatbot */}
      <div className={`chatbot-container ${isChatOpen ? "open" : ""}`}>
        {isChatOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <div className="chatbot-title">
                <span className="bot-icon">🤖</span>
                <span>Castify Assistant</span>
                <span className="online-indicator">●</span>
              </div>
              <button
                className="close-chat"
                onClick={() => setIsChatOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className="message-content">{message.text}</div>
                </div>
              ))}
              {isLoading && (
                <div className="message bot">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chatbot-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Castify features, how to get started, or anything else..."
                className="chat-input"
              />
              <button
                onClick={handleSendMessage}
                className="send-button"
                disabled={!inputMessage.trim() || isLoading}
              >
                <span className="send-icon">📤</span>
              </button>
            </div>
          </div>
        )}

        <button
          className={`chatbot-toggle ${isChatOpen ? "open" : ""}`}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? "✕" : "💬"}
        </button>
      </div>
    </div>
  );
}
