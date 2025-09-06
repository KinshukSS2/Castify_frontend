// src/components/CreateStory.js
import { useState, useEffect } from "react";
import { createStory } from "./api/storyApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateStory.css";

export default function CreateStory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        console.log("Token found:", token ? "Yes" : "No");

        if (!token) {
          console.error("No token found in localStorage");
          setError("Please login first to create a story");
          return;
        }

        console.log(
          "Making request to:",
          "http://localhost:8000/api/v1/videos/getMyVideos"
        );

        const res = await axios.get(
          "http://localhost:8000/api/v1/videos/getMyVideos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Request successful!");
        console.log("Full response:", res);
        console.log("Response data:", res.data);
        console.log("Response data.data:", res.data.data);

        // Try multiple possible paths to access the videos
        let fetchedVideos = [];

        if (res.data?.data?.videos) {
          fetchedVideos = res.data.data.videos;
          console.log("✅ Found videos at res.data.data.videos");
        } else if (res.data?.videos) {
          fetchedVideos = res.data.videos;
          console.log("✅ Found videos at res.data.videos");
        } else if (Array.isArray(res.data)) {
          fetchedVideos = res.data;
          console.log("✅ Found videos as direct array");
        } else {
          console.log("❌ No videos found in any expected location");
          console.log(
            "Available keys in res.data:",
            Object.keys(res.data || {})
          );
        }

        console.log("Final parsed videos:", fetchedVideos);
        console.log("Number of videos:", fetchedVideos.length);

        if (fetchedVideos.length > 0) {
          console.log("Sample video object:", fetchedVideos[0]);
        }

        setVideos(fetchedVideos);

        if (fetchedVideos.length === 0) {
          setError(
            "No videos found. Please upload a video first to create a story."
          );
        }
      } catch (err) {
        console.error("❌ Request failed!");
        console.error("Error:", err);
        console.error("Error response:", err.response);
        console.error("Error response data:", err.response?.data);
        console.error("Status:", err.response?.status);

        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.");
        } else if (err.response?.status === 404) {
          setError("API endpoint not found. Please check your backend server.");
        } else {
          setError("Failed to fetch videos. Please try again.");
        }
      }
    };

    fetchMyVideos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedVideo) {
      setError("Please select a root video to create your story");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Creating story with data:", {
        title,
        description,
        rootVideoId: selectedVideo,
      });

      await createStory({
        title,
        description,
        rootVideoId: selectedVideo,
      });

      setSuccess("🎉 Story created successfully!");

      // Clear form
      setTitle("");
      setDescription("");
      setSelectedVideo("");

      // Navigate after a brief delay to show success message
      setTimeout(() => {
        navigate("/stories");
      }, 2000);
    } catch (err) {
      console.error("Story creation error:", err);
      console.error("Error response:", err.response?.data);
      setError(
        "Failed to create story: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-story-container">
      <div className="story-form-card">
        <div className="form-header">
          <h1 className="form-title">Create Your Story</h1>
          <p className="form-subtitle">
            Craft an epic narrative with branching video adventures
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span className="info-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <span className="info-icon">✅</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Story Title
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="Enter an captivating title for your story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Story Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Describe the world, characters, and premise of your interactive story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rootVideo" className="form-label">
              Root Video
            </label>
            <select
              id="rootVideo"
              className="form-select"
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">-- Choose your starting video --</option>
              {videos.map((video) => (
                <option key={video._id} value={video._id}>
                  {video.title}{" "}
                  {video.duration &&
                    `(${Math.floor(video.duration / 60)}:${(video.duration % 60)
                      .toString()
                      .padStart(2, "0")})`}
                </option>
              ))}
            </select>

            {videos.length > 0 && (
              <div className="videos-dropdown-info">
                <span className="info-icon">💡</span>
                <span>
                  Found {videos.length} video{videos.length !== 1 ? "s" : ""} in
                  your library. The selected video will be the first chapter of
                  your story.
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || videos.length === 0}
          >
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? "Creating Story..." : "Create Epic Story"}
          </button>
        </form>

        {/* Debug info for development */}
        {/* {process.env.NODE_ENV === "development" && (
          <div className="debug-info">
            <strong>Debug Info:</strong>
            <br />
            Videos loaded: {videos.length}
            <br />
            Selected video: {selectedVideo || "None"}
            <br />
            Loading: {isLoading ? "Yes" : "No"}
          </div>
        )} */}
      </div>
    </div>
  );
}
