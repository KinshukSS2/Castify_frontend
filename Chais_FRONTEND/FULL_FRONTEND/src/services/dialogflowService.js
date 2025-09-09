// src/services/dialogflowService.js
import { v4 as uuidv4 } from 'uuid';

class DialogflowService {
  constructor() {
    this.projectId = process.env.REACT_APP_GOOGLE_PROJECT_ID;
    this.sessionId = uuidv4();
    this.languageCode = 'en-US';
    
    // Fallback responses when Dialogflow is unavailable
    this.fallbackResponses = {
      "how to upload": 'To upload videos on Castify, you need to sign up first, then go to the Creator Tools section. Click on "Upload Videos" and follow the simple steps to share your content with our community!',
      premium: "Our Premium Plans offer exclusive features like advanced analytics, priority support, unlimited uploads, and access to premium editing tools. Check out our Platform section for more details!",
      contact: 'You can reach us through multiple ways: Email us at hello@castify.com or support@castify.com, call us at +1 (555) 123-4567, or visit our office at 123 Innovation Street, San Francisco. You can also use the contact form in the "Get In Touch" section below!',
      features: "Castify offers Creative Tools for professional editing, Secure Platform with enterprise-level security, Analytics Dashboard for insights, Community features to connect with creators, Monetization options, and Fast & Reliable performance. Scroll down to see all features!",
      "sign up": 'Getting started is easy! Click the "Join Now" button at the top of the page to create your account, or "Sign In" if you already have one. Welcome to the Castify community!',
      mission: "Our mission is to democratize content creation and provide a platform where every story matters. We empower creators with cutting-edge tools and connect them with audiences who appreciate authentic, diverse content.",
      help: "I can help you with information about uploading videos, premium features, contact details, platform features, signing up, our mission, and general navigation. What would you like to know more about?",
      navigate: "You can explore different sections: scroll down for Mission & Vision, Contact Us, and Features. Use the buttons above to Sign In or Join Now. Need something specific? Just ask!",
      analytics: "Our Analytics Dashboard provides comprehensive insights to track your content performance and audience engagement. It's included in our Creator Tools section. Sign up to access these powerful features!",
      community: "Join our vibrant community of creators! Connect with like-minded individuals, build meaningful relationships, and collaborate on projects. Sign up to start networking with fellow creators.",
      security: "We take security seriously with enterprise-level protection for your content and personal information. Your data is safe with our secure platform and advanced encryption.",
    };
  }

  // Check if Dialogflow is properly configured
  isConfigured() {
    return !!(
      this.projectId &&
      process.env.REACT_APP_DIALOGFLOW_PRIVATE_KEY &&
      process.env.REACT_APP_DIALOGFLOW_CLIENT_EMAIL
    );
  }

  // Simulate Dialogflow API call for now (since we need backend proxy for security)
  async detectIntent(query) {
    try {
      // In a real implementation, this would call your backend endpoint
      // that proxies to Dialogflow to keep credentials secure
      const response = await fetch('/api/v1/dialogflow/detect-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          sessionId: this.sessionId,
          languageCode: this.languageCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Dialogflow service unavailable');
      }

      const data = await response.json();
      return {
        fulfillmentText: data.fulfillmentText,
        intent: data.intent,
        confidence: data.confidence,
      };
    } catch (error) {
      console.warn('Dialogflow unavailable, using fallback:', error.message);
      throw error;
    }
  }

  // Enhanced response generation with Dialogflow integration
  async generateResponse(userMessage) {
    try {
      // First try Dialogflow if configured
      if (this.isConfigured()) {
        const result = await this.detectIntent(userMessage);
        
        // If Dialogflow has a good response (high confidence)
        if (result.confidence > 0.7 && result.fulfillmentText) {
          return {
            text: result.fulfillmentText,
            source: 'dialogflow',
            intent: result.intent,
            confidence: result.confidence,
          };
        }
      }
    } catch (error) {
      console.warn('Dialogflow error, falling back to predefined responses');
    }

    // Fallback to predefined responses
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(this.fallbackResponses)) {
      if (message.includes(key)) {
        return {
          text: response,
          source: 'fallback',
          intent: key,
          confidence: 0.8,
        };
      }
    }

    // Default response
    return {
      text: "I can help you with questions about uploading videos, premium features, contact information, platform features, signing up, our mission, and navigation. Could you please be more specific about what you'd like to know?",
      source: 'default',
      intent: 'default.fallback',
      confidence: 0.5,
    };
  }

  // Enhanced response with context awareness
  async generateContextualResponse(userMessage, conversationHistory = []) {
    try {
      const response = await this.generateResponse(userMessage);
      
      // Add contextual enhancements based on conversation history
      if (conversationHistory.length > 0) {
        const lastMessage = conversationHistory[conversationHistory.length - 1];
        
        // If user is asking for more info about a previous topic
        if (userMessage.toLowerCase().includes('more') || userMessage.toLowerCase().includes('tell me more')) {
          response.text += this.getAdditionalInfo(lastMessage);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error generating contextual response:', error);
      return {
        text: "I'm sorry, I'm having trouble understanding right now. Please try again or contact our support team.",
        source: 'error',
        intent: 'error',
        confidence: 0.0,
      };
    }
  }

  // Get additional information based on previous context
  getAdditionalInfo(lastMessage) {
    const additionalInfo = {
      'upload': '\n\n💡 Pro tip: Make sure your videos are in MP4 format and under 100MB for best upload experience. You can also add thumbnails and descriptions to make your content more discoverable!',
      'premium': '\n\n🚀 Premium members also get priority customer support, advanced video analytics, and access to beta features before anyone else!',
      'features': '\n\n✨ Our platform also includes collaborative tools, live streaming capabilities, and integration with social media platforms for maximum reach!',
      'community': '\n\n🌟 Join our Discord server and weekly virtual meetups where creators share tips, collaborate on projects, and network with industry professionals!',
    };

    for (const [key, info] of Object.entries(additionalInfo)) {
      if (lastMessage && lastMessage.toLowerCase().includes(key)) {
        return info;
      }
    }
    
    return '\n\nIs there anything specific you\'d like to know more about?';
  }

  // Reset session (useful for new conversations)
  resetSession() {
    this.sessionId = uuidv4();
  }
}

export default new DialogflowService();
