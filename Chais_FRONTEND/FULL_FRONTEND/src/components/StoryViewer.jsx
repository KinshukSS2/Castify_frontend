// StoryViewer.jsx - Reddit-style video thread viewer
import React, { useEffect, useState, useRef } from "react";
import { getFullStoryTree } from "./api/storyApi.jsx";
import { useParams } from "react-router-dom";
import "./StoryViewer.css";

const StoryViewer = () => {
  const { storyId } = useParams();
  const [storyTree, setStoryTree] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showBranches, setShowBranches] = useState(false);
  const [videoPath, setVideoPath] = useState([]); // Track the path taken
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchStoryTree();

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [storyId]);

  const fetchStoryTree = async () => {
    try {
      const res = await getFullStoryTree(storyId);
      console.log("Story tree:", res.data);

      const tree = res.data?.data?.rootVideoTree || res.data?.rootVideoTree;
      setStoryTree(tree);
      setCurrentVideo(tree);
      setVideoPath([tree]);
    } catch (error) {
      console.error("Failed to fetch story tree:", error);
    }
  };

  const selectBestBranch = (branches) => {
    if (!branches || branches.length === 0) return null;

    // Sort by votes (highest first), then by views
    return branches.sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return (b.views || 0) - (a.views || 0);
    })[0];
  };

  const handleVideoEnd = () => {
    if (currentVideo?.branches && currentVideo.branches.length > 0) {
      setShowBranches(true);

      // Auto-play best branch after 3 seconds
      setTimeout(() => {
        const bestBranch = selectBestBranch(currentVideo.branches);
        if (bestBranch) {
          playVideo(bestBranch);
        }
      }, 3000);
    }
  };

  const enterFullscreen = async () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          await videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.mozRequestFullScreen) {
          await videoRef.current.mozRequestFullScreen();
        } else if (videoRef.current.msRequestFullscreen) {
          await videoRef.current.msRequestFullscreen();
        }
      } catch (error) {
        console.warn("Failed to enter fullscreen:", error);
      }
    }
  };

  const playVideo = (video) => {
    const wasFullscreen = isFullscreen;

    setCurrentVideo(video);
    setVideoPath((prev) => [...prev, video]);
    setShowBranches(false);

    // Update video source without re-rendering the video element
    if (videoRef.current) {
      videoRef.current.src = video.videoFile;
      videoRef.current.load(); // Reload the video with new source

      // Play the video after a short delay to ensure it's loaded
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);

          // Re-enter fullscreen if it was previously in fullscreen
          if (wasFullscreen) {
            setTimeout(() => {
              enterFullscreen();
            }, 100); // Small delay to ensure video is playing
          }
        }
      }, 100);

      // Scroll video into view
      videoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goBackToPrevious = () => {
    if (videoPath.length > 1) {
      const newPath = videoPath.slice(0, -1);
      setVideoPath(newPath);
      setCurrentVideo(newPath[newPath.length - 1]);
      setShowBranches(false);
    }
  };

  if (!storyTree) return <div className="loading">Loading story...</div>;

  return (
    <div className="story-viewer">
      {/* Video Player */}
      <div className="video-container">
        <video
          ref={videoRef}
          width="100%"
          height="500"
          controls
          autoPlay
          onEnded={handleVideoEnd}
          src={currentVideo?.videoFile}
        >
          Your browser does not support the video tag.
        </video>

        {/* Fullscreen Branch Selection Overlay */}
        {showBranches && currentVideo?.branches && isFullscreen && (
          <div className="fullscreen-branches-overlay">
            <div className="fullscreen-branches-container">
              <h4>Choose your path:</h4>
              <div className="fullscreen-branches-grid">
                {currentVideo.branches
                  .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                  .map((branch, index) => (
                    <div
                      key={branch._id}
                      className={`fullscreen-branch-card ${
                        index === 0 ? "recommended" : ""
                      }`}
                      onClick={() => playVideo(branch)}
                    >
                      {index === 0 && (
                        <div className="fullscreen-recommended-badge">
                          🔥 Most Popular
                        </div>
                      )}

                      {branch.thumbnail && (
                        <img src={branch.thumbnail} alt={branch.title} />
                      )}

                      <div className="fullscreen-branch-info">
                        <h5>{branch.title}</h5>
                        <div className="fullscreen-branch-stats">
                          <span>👍 {branch.votes || 0}</span>
                          <span>👁️ {branch.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="fullscreen-auto-play-timer">
                <div className="timer-bar"></div>
                Most popular will auto-play in 3 seconds...
              </div>
            </div>
          </div>
        )}

        {/* Video Info */}
        <div className="video-info">
          <div className="video-header">
            <h3>{currentVideo?.title}</h3>
            <button
              className="fullscreen-btn"
              onClick={enterFullscreen}
              title="Enter Fullscreen"
            >
              ⛶
            </button>
          </div>
          <p>{currentVideo?.description}</p>
          <div className="video-stats">
            <span>👍 {currentVideo?.votes || 0}</span>
            <span>👁️ {currentVideo?.views || 0}</span>
            {isFullscreen && (
              <span className="fullscreen-indicator">🖥️ Fullscreen</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button
          onClick={goBackToPrevious}
          disabled={videoPath.length <= 1}
          className="nav-btn back-btn"
        >
          ← Previous
        </button>

        <div className="path-indicator">Video {videoPath.length} of story</div>
      </div>

      {/* Branch Selection Overlay - Only show when NOT in fullscreen */}
      {showBranches && currentVideo?.branches && !isFullscreen && (
        <div className="branches-overlay">
          <h4>Choose your path:</h4>
          <div className="branches-grid">
            {currentVideo.branches
              .sort((a, b) => (b.votes || 0) - (a.votes || 0)) // Sort by votes
              .map((branch, index) => (
                <div
                  key={branch._id}
                  className={`branch-card ${index === 0 ? "recommended" : ""}`}
                  onClick={() => playVideo(branch)}
                >
                  {index === 0 && (
                    <div className="recommended-badge">🔥 Most Popular</div>
                  )}

                  {branch.thumbnail && (
                    <img src={branch.thumbnail} alt={branch.title} />
                  )}

                  <div className="branch-info">
                    <h5>{branch.title}</h5>
                    <div className="branch-stats">
                      <span>👍 {branch.votes || 0}</span>
                      <span>👁️ {branch.views || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="auto-play-timer">
            Most popular will auto-play in 3 seconds...
          </div>
        </div>
      )}

      {/* End of Story */}
      {!showBranches &&
        (!currentVideo?.branches || currentVideo.branches.length === 0) && (
          <div className="story-end">
            <h3>🎬 End of Story</h3>
            <p>You've reached the end of this story thread!</p>
            <button
              onClick={() => window.location.reload()}
              className="restart-btn"
            >
              🔄 Watch Again
            </button>
          </div>
        )}
    </div>
  );
};

export default StoryViewer;
