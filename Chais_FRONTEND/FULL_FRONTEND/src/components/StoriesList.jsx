// src/pages/StoriesList.js
import React, { useEffect, useState } from "react";
import { listStories, deleteStory } from "./api/storyApi";
import { Link } from "react-router-dom";
import "./StoriesList.css";

const StoriesList = () => {
  const [stories, setStories] = useState([]);
  const [deletingStory, setDeletingStory] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Mouse tracking for premium hover effects
  const handleMouseMove = (e) => {
    const cards = document.querySelectorAll(".story-card");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  };

  useEffect(() => {
    // Get current user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await listStories();
        console.log("Stories response:", res.data);

        // Handle the nested response structure
        const storiesData = res.data?.data?.stories || [];
        setStories(storiesData);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStories([]); // Set empty array on error
      }
    };

    fetchStories();
  }, []);

  const handleDeleteStory = async (storyId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this story? This will delete all videos in the story."
      )
    ) {
      return;
    }

    try {
      setDeletingStory(storyId);
      await deleteStory(storyId);

      // Remove story from local state
      setStories((prevStories) =>
        prevStories.filter((story) => story._id !== storyId)
      );
    } catch (error) {
      console.error("Error deleting story:", error);

      if (error.response?.status === 403) {
        alert("❌ You can only delete your own stories");
      } else if (error.response?.status === 401) {
        alert("❌ Please login to delete stories");
      } else {
        alert("❌ Failed to delete story. Please try again.");
      }
    } finally {
      setDeletingStory(null);
    }
  };

  return (
    <div className="stories-container" onMouseMove={handleMouseMove}>
      <div className="stories-header">
        <h1 className="stories-title">✨ Story Universe</h1>
        <p className="stories-subtitle">
          Discover and create immersive branching video narratives
        </p>
        <Link to="/stories/create" className="create-story-btn">
          <span>🎬</span>
          Create New Story
        </Link>
      </div>

      {!Array.isArray(stories) ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3 className="empty-title">No Stories Yet</h3>
          <p className="empty-description">
            Be the first to create an amazing branching story!
          </p>
          <Link to="/stories/create" className="create-story-btn">
            <span>🚀</span>
            Create Your First Story
          </Link>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story._id} className="story-card">
              <h3 className="story-title">{story.title}</h3>
              <p className="story-description">{story.description}</p>

              <div className="story-actions">
                <Link
                  to={`/stories/${story._id}/watch`}
                  className="action-btn watch-btn"
                >
                  <span>🎬</span>
                  Watch Story
                </Link>

                <Link
                  to={`/stories/${story._id}`}
                  className="action-btn manage-btn"
                >
                  <span>⚙️</span>
                  Manage
                </Link>

                {/* Delete Story Button - Only show for story owner */}
                {currentUser && story.owner === currentUser._id && (
                  <button
                    onClick={() => handleDeleteStory(story._id)}
                    disabled={deletingStory === story._id}
                    className="action-btn delete-btn"
                    title="Delete entire story"
                  >
                    <span>{deletingStory === story._id ? "⏳" : "🗑️"}</span>
                    {deletingStory === story._id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoriesList;
