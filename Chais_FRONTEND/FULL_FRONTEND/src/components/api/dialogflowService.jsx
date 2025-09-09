import apiInstance from "./apiInstance.jsx";

class DialogflowService {
  constructor() {
    this.isConfigured = false;
    this.sessionId = this.generateSessionId();
    this.checkServiceHealth();
  }

  generateSessionId() {
    return (
      "session-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now()
    );
  }

  async checkServiceHealth() {
    try {
      const response = await apiInstance.get("/dialogflow/health");
      this.isConfigured = response.data?.data?.dialogflowConfigured || false;
      console.log(
        "🤖 Dialogflow service health:",
        this.isConfigured ? "Configured" : "Fallback mode"
      );
    } catch (error) {
      console.log("🤖 Dialogflow service: Using fallback mode");
      this.isConfigured = false;
    }
  }

  async detectIntent(query) {
    try {
      const response = await apiInstance.post("/dialogflow/detect-intent", {
        query,
        sessionId: this.sessionId,
        languageCode: "en-US",
      });

      const result = response.data?.data;

      return {
        response: result?.fulfillmentText || this.getFallbackResponse(query),
        intent: result?.intent || "default.fallback",
        confidence: result?.confidence || 0.5,
        source: this.isConfigured ? "dialogflow" : "local",
      };
    } catch (error) {
      console.error("Error detecting intent:", error);
      return {
        response: this.getFallbackResponse(query),
        intent: "default.fallback",
        confidence: 0.3,
        source: "fallback",
      };
    }
  }

  getFallbackResponse(query) {
    const lowerQuery = query.toLowerCase();

    // Context-aware responses for Castify platform
    if (
      lowerQuery.includes("hello") ||
      lowerQuery.includes("hi") ||
      lowerQuery.includes("hey")
    ) {
      return "Hello! I'm your Castify assistant. I can help you with uploading videos, premium features, contact details, platform features, signing up, our mission, and navigation. What would you like to know?";
    }

    if (lowerQuery.includes("help") || lowerQuery.includes("assist")) {
      return "I can help you with: 📹 Uploading videos, ⭐ Platform features, 💰 Pricing information, 📞 Contact details, 🚀 Getting started, and 📊 Analytics. What interests you most?";
    }

    if (lowerQuery.includes("upload") || lowerQuery.includes("video")) {
      return "To upload videos on Castify: 1️⃣ Sign up for an account, 2️⃣ Go to Creator Tools, 3️⃣ Click 'Upload Videos', 4️⃣ Select your video file, 5️⃣ Add title and description, 6️⃣ Publish! 🎬";
    }

    if (
      lowerQuery.includes("premium") ||
      lowerQuery.includes("price") ||
      lowerQuery.includes("cost")
    ) {
      return "We offer flexible pricing: 🆓 Free plan with basic features, ⭐ Premium plans with advanced analytics, priority support, unlimited uploads, and exclusive tools. Check our pricing section for details!";
    }

    if (
      lowerQuery.includes("contact") ||
      lowerQuery.includes("reach") ||
      lowerQuery.includes("support")
    ) {
      return "Reach us easily: 📧 hello@castify.com or support@castify.com, 📞 +1 (555) 123-4567, 🏢 123 Innovation Street, San Francisco. Or use our contact form below!";
    }

    if (
      lowerQuery.includes("feature") ||
      lowerQuery.includes("what does") ||
      lowerQuery.includes("capabilities")
    ) {
      return "Castify offers amazing features: 🎨 Creative editing tools, 🛡️ Enterprise-level security, 📊 Advanced analytics, 👥 Community networking, 💰 Monetization options, and ⚡ lightning-fast performance!";
    }

    if (
      lowerQuery.includes("analytics") ||
      lowerQuery.includes("stats") ||
      lowerQuery.includes("insights")
    ) {
      return "Our Analytics Dashboard provides comprehensive insights: 📈 Video performance metrics, 👥 Audience engagement data, 🎯 Content optimization tips, and 💰 Revenue tracking. Available in Premium plans!";
    }

    if (
      lowerQuery.includes("community") ||
      lowerQuery.includes("connect") ||
      lowerQuery.includes("network")
    ) {
      return "Join our vibrant creator community! 🤝 Connect with like-minded creators, 💡 Share tips and collaborate, 🎉 Join virtual meetups, and 🚀 Grow together. Sign up to start networking!";
    }

    if (
      lowerQuery.includes("security") ||
      lowerQuery.includes("safe") ||
      lowerQuery.includes("privacy")
    ) {
      return "Your security is our priority! 🔐 Enterprise-level encryption, 🛡️ Secure data storage, 🔒 Privacy protection, and 📊 Transparent data handling. Your content and personal information are safe with us!";
    }

    if (
      lowerQuery.includes("sign up") ||
      lowerQuery.includes("register") ||
      lowerQuery.includes("join")
    ) {
      return "Signing up is easy! Click the 'Get Started' button, fill in your details, verify your email, and you're ready to start creating and sharing amazing content on Castify! 🚀";
    }

    if (
      lowerQuery.includes("mission") ||
      lowerQuery.includes("about") ||
      lowerQuery.includes("what is")
    ) {
      return "Castify's mission is to empower creators with the best tools and platform to share their stories, connect with audiences, and build thriving creative communities. We're here to make content creation accessible to everyone! 🌟";
    }

    // Default response
    return "I can help you with questions about uploading videos, premium features, contact information, platform features, signing up, our mission, and navigation. Could you please be more specific? 😊";
  }

  // Context management for conversation flow
  updateContext(intent, parameters = {}) {
    this.lastIntent = intent;
    this.lastParameters = parameters;
  }

  // Enhanced query processing with context awareness
  async processQuery(query, userContext = {}) {
    try {
      const result = await this.detectIntent(query);

      // Add context information
      if (userContext.isLoggedIn) {
        if (result.intent === "upload" && result.source === "local") {
          result.response +=
            " Since you're logged in, you can start uploading right away! 🎉";
        }
      } else {
        if (result.intent === "upload" && result.source === "local") {
          result.response +=
            " You'll need to sign up first to start uploading. It's quick and free! ✨";
        }
      }

      // Update context for next interaction
      this.updateContext(result.intent, result.parameters);

      return result;
    } catch (error) {
      console.error("Error processing query:", error);
      return {
        response:
          "I'm sorry, I'm having trouble understanding right now. Please try again or ask about specific topics like uploads, features, or pricing.",
        intent: "error",
        confidence: 0.1,
        source: "error",
      };
    }
  }

  // Reset session for new conversation
  resetSession() {
    this.sessionId = this.generateSessionId();
    this.lastIntent = null;
    this.lastParameters = {};
  }
}

// Create and export singleton instance
const dialogflowService = new DialogflowService();
export default dialogflowService;
