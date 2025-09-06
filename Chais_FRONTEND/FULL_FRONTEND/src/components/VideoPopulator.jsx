// VideoPopulator.jsx - Component to populate pages with story videos
import React, { useState, useEffect } from "react";
import memeApiService from "../services/memeApi.js";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavbar } from "../contexts/NavbarContext";
import "./VideoPopulator.css";

const VideoPopulator = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("adventure");
  const [autoUpload, setAutoUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isCollapsed } = useNavbar();

  // Get story categories from the API
  const categories = memeApiService.getStoryCategories();
  console.log("Categories loaded:", categories); // Debug log

  useEffect(() => {
    console.log("VideoPopulator mounted, fetching videos..."); // Debug log
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    console.log("🎬 VideoPopulator: Starting video fetch");
    console.log("📂 VideoPopulator: Selected category:", selectedCategory);

    setLoading(true);
    try {
      console.log(
        "🔍 VideoPopulator: Calling memeApiService.getVideosByCategory"
      );
      console.log("📊 VideoPopulator: memeApiService object:", memeApiService);

      const response = await memeApiService.getVideosByCategory(
        selectedCategory,
        20
      );

      console.log("📦 VideoPopulator: Raw API response:", response);
      console.log("📊 VideoPopulator: Response data:", response.data);
      console.log("📈 VideoPopulator: Response success:", response.success);

      // Extract the data array from the response
      const fetchedVideos = response.data || [];
      console.log("📹 VideoPopulator: Extracted videos:", fetchedVideos);
      console.log("📏 VideoPopulator: Videos count:", fetchedVideos.length);

      if (fetchedVideos.length > 0) {
        console.log("🎯 VideoPopulator: First video sample:", {
          id: fetchedVideos[0].id,
          title: fetchedVideos[0].title,
          thumbnail: fetchedVideos[0].thumbnail,
          description: fetchedVideos[0].description,
        });
      }

      setVideos(fetchedVideos);
      setUploadStatus(
        `✅ Loaded ${fetchedVideos.length} ${selectedCategory} story videos`
      );

      console.log(
        "✅ VideoPopulator: State updated with",
        fetchedVideos.length,
        "videos"
      );
    } catch (error) {
      console.error("❌ VideoPopulator: Error fetching videos:", error);
      console.error("🔍 VideoPopulator: Error details:", {
        message: error.message,
        stack: error.stack,
      });
      setVideos([]);
      setUploadStatus("❌ Failed to fetch story content");
    } finally {
      setLoading(false);
    }
  };

  const uploadVideoToBackend = async (video) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Uploading video:", video.title);

      // Create video with URL-based approach (since we're using demo URLs)
      const videoData = {
        title: video.title,
        description: video.description,
        // For demo videos, we'll store the URL directly
        // In production, you'd download and upload the actual file
        videoFile: video.videoFile,
        thumbnail: video.thumbnail,
        duration: video.duration || 30,
        isPublished: true,
      };

      console.log("Video data being sent:", videoData);

      const response = await axios.post(
        "http://localhost:8000/api/v1/videos/publish-url",
        videoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to upload video:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  const uploadSingleVideo = async (video) => {
    try {
      setUploadStatus(`📤 Uploading: ${video.title}...`);
      const result = await uploadVideoToBackend(video);
      setUploadStatus(`✅ Uploaded: ${video.title}`);
      return result;
    } catch (error) {
      let errorMessage = `❌ Failed to upload: ${video.title}`;

      if (error.response?.status === 401) {
        errorMessage += " - Please login again";
      } else if (error.response?.status === 400) {
        errorMessage += " - Invalid video data";
      } else if (error.response?.status === 500) {
        errorMessage += " - Server error, check backend logs";
      }

      setUploadStatus(errorMessage);
      console.error("Upload error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  };

  const uploadAllVideos = async () => {
    if (!videos.length) {
      setUploadStatus("❌ No videos to upload");
      return;
    }

    setAutoUpload(true);
    setUploadProgress(0);
    const successfulUploads = [];
    const failedUploads = [];

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      setUploadProgress(((i + 1) / videos.length) * 100);

      try {
        await uploadSingleVideo(video);
        successfulUploads.push(video);

        // Small delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        failedUploads.push(video);
      }
    }

    setAutoUpload(false);
    setUploadStatus(
      `🎉 Upload complete! Success: ${successfulUploads.length}, Failed: ${failedUploads.length}`
    );
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const createStoryFromVideo = async (video) => {
    try {
      setUploadStatus(`📝 Creating story from: ${video.title}...`);

      // First upload the video
      const uploadedVideo = await uploadVideoToBackend(video);

      // Then create a story with this video as root
      const token = localStorage.getItem("token");
      const storyResponse = await axios.post(
        "http://localhost:8000/api/v1/stories/create",
        {
          title: `Story: ${video.title}`,
          description: `Interactive story based on: ${video.description}`,
          rootVideoId: uploadedVideo.data._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUploadStatus(`✅ Created story: ${video.title}`);
      return storyResponse.data;
    } catch (error) {
      setUploadStatus(`❌ Failed to create story: ${video.title}`);
      throw error;
    }
  };

  return (
    <>
      <Navbar />
      <div
        className={`video-populator with-navbar ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="populator-header">
          <h2>🎬 Story Content Populator</h2>
          <p>
            Fetch and upload story-ready video content to create immersive
            branching narratives
          </p>
        </div>

        {/* Category Selection */}
        <div className="category-selector">
          <h3>Select Story Genre:</h3>
          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`category-btn ${
                  selectedCategory === category.value ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.value)}
                disabled={loading}
                title={category.description}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="fetch-btn"
            onClick={fetchVideos}
            disabled={loading}
          >
            {loading ? "🔄 Loading..." : "🔄 Load Story Content"}
          </button>

          <button
            className="upload-all-btn"
            onClick={uploadAllVideos}
            disabled={loading || autoUpload || !videos.length}
          >
            {autoUpload
              ? "📤 Uploading..."
              : `📤 Add All to Library (${videos.length})`}
          </button>
        </div>

        {/* Upload Progress */}
        {autoUpload && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(uploadProgress)}%</span>
          </div>
        )}

        {/* Status Message */}
        {uploadStatus && (
          <div
            className={`status-message ${
              uploadStatus.includes("❌") ? "error" : "success"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        {/* Video Grid */}
        <div className="videos-grid">
          {(() => {
            console.log("🎨 VideoPopulator: Rendering video grid");
            console.log("⏳ VideoPopulator: Loading state:", loading);
            console.log("📊 VideoPopulator: Current videos state:", videos);
            console.log(
              "📏 VideoPopulator: Videos array length:",
              videos.length
            );
            console.log(
              "🔍 VideoPopulator: Videos is array?",
              Array.isArray(videos)
            );

            if (loading) {
              console.log("⏳ VideoPopulator: Showing loading skeleton");
              return (
                <div className="loading-grid">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="video-card-skeleton">
                        <div className="skeleton-thumbnail"></div>
                        <div className="skeleton-title"></div>
                        <div className="skeleton-description"></div>
                      </div>
                    ))}
                </div>
              );
            }

            if (videos.length === 0) {
              console.log("⚠️ VideoPopulator: No videos to display");
              return (
                <div className="no-videos-message">
                  <p>
                    No videos loaded. Click "Load Story Content" to fetch
                    videos.
                  </p>
                </div>
              );
            }

            console.log(
              "✨ VideoPopulator: Rendering",
              videos.length,
              "video cards"
            );
            if (Array.isArray(videos)) {
              return videos.map((video, index) => {
                console.log(
                  `🎬 VideoPopulator: Rendering video ${index + 1}:`,
                  {
                    id: video.id,
                    title: video.title,
                    thumbnail: video.thumbnail,
                  }
                );

                return (
                  <div key={video.id || index} className="video-card">
                    <div
                      className="video-thumbnail"
                      onClick={() => openVideoModal(video)}
                    >
                      <img
                        src={
                          video.thumbnail ||
                          "https://picsum.photos/400/300?random=1"
                        }
                        alt={video.title || "Video thumbnail"}
                        onError={(e) => {
                          console.log("Image failed to load:", video.thumbnail);
                          e.target.src =
                            "https://picsum.photos/400/300?random=1";
                        }}
                      />
                      <div className="play-overlay">
                        <button className="play-button">▶</button>
                      </div>
                      <div className="video-duration">{video.duration}s</div>
                      <div className="video-source">
                        {video.source || "Demo"}
                      </div>
                    </div>

                    <div className="video-info">
                      <h4 className="video-title">
                        {video.title || "Untitled Video"}
                      </h4>
                      <p className="video-description">
                        {video.description?.length > 100
                          ? `${video.description.substring(0, 100)}...`
                          : video.description || "No description available"}
                      </p>

                      <div className="video-stats">
                        <span className="votes">👍 {video.votes}</span>
                        <span className="views">👁️ {video.views}</span>
                      </div>
                    </div>

                    <div className="video-actions">
                      <button
                        className="upload-single-btn"
                        onClick={() => uploadSingleVideo(video)}
                        disabled={autoUpload}
                      >
                        📤 Upload
                      </button>

                      <button
                        className="create-story-btn"
                        onClick={() => createStoryFromVideo(video)}
                        disabled={autoUpload}
                      >
                        📝 Create Story
                      </button>
                    </div>
                  </div>
                );
              });
            }

            return null;
          })()}
        </div>

        {/* Usage Instructions */}
        <div className="usage-instructions">
          <h3>💡 How to Create Stories:</h3>
          <ol>
            <li>
              <strong>Select Genre:</strong> Choose the story genre that fits
              your narrative vision
            </li>
            <li>
              <strong>Load Content:</strong> Click "Load Story Content" to fetch
              themed videos
            </li>
            <li>
              <strong>Upload Individual:</strong> Click "Upload" on specific
              videos to add them to your library
            </li>
            <li>
              <strong>Batch Upload:</strong> Use "Add All to Library" to upload
              all loaded content
            </li>
            <li>
              <strong>Create Stories:</strong> Click "Create Story" to turn any
              video into an interactive branching narrative
            </li>
          </ol>

          <div className="api-info">
            <p>
              <strong>Story Genres Available:</strong>
            </p>
            <ul>
              <li>�️ Adventure - Epic journeys and exploration</li>
              <li>🕵️ Mystery - Suspenseful and intriguing narratives</li>
              <li>😂 Comedy - Funny and entertaining content</li>
              <li>⚡ Action - High-energy and thrilling sequences</li>
              <li>🚀 Sci-Fi - Futuristic and technology themes</li>
              <li>🧙 Fantasy - Magical and mythical adventures</li>
            </ul>
          </div>
        </div>

        {/* Video Modal for Fullscreen Playback */}
        {selectedVideo && (
          <div className="video-modal" onClick={closeVideoModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeVideoModal}>
                ×
              </button>
              <h3>{selectedVideo.title}</h3>
              <video
                controls
                autoPlay
                src={selectedVideo.videoFile}
                className="modal-video"
              >
                Your browser does not support the video tag.
              </video>
              <p className="video-description">{selectedVideo.description}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoPopulator;
