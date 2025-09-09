import { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";
import "./AllVideoscss.css";

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [votingStatus, setVotingStatus] = useState({}); // Track voting states
  const [currentUser, setCurrentUser] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null); // Track which video is playing
  const [selectedVideo, setSelectedVideo] = useState(null); // For fullscreen modal
  const [userVotes, setUserVotes] = useState({}); // Track user's vote state for each video

  useEffect(() => {
    // Get current user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchVideos = async (page = 1) => {
    try {
      console.log("🎬 AllVideos: Fetching videos for page:", page);
      console.log("🔗 API URL:", `/getAll-videos?page=${page}&limit=12`);

      const res = await axiosInstance.get(
        `/getAll-videos?page=${page}&limit=12`
      );

      console.log("📦 AllVideos: Raw API response:", res);
      console.log("📊 AllVideos: Response data:", res.data);

      // Handle both possible response structures
      const videosData = res.data.videos || res.data.data?.videos || res.data;
      console.log("📹 AllVideos: Videos array:", videosData);
      console.log("📈 AllVideos: Videos count:", videosData?.length || 0);

      if (videosData && videosData.length > 0) {
        console.log("🎯 AllVideos: First video sample:", {
          id: videosData[0]._id,
          title: videosData[0].title,
          thumbnail: videosData[0].thumbnail,
          videoFile: videosData[0].videoFile,
          description: videosData[0].description,
        });
      }

      setVideos(videosData || []);
      setTotalPages(
        res.data.totalPages ||
          Math.ceil((res.data.totalVideos || videosData?.length || 0) / 12) ||
          1
      );

      // Initialize user vote states from server response
      const voteStates = {};
      if (videosData) {
        videosData.forEach((video) => {
          if (video.userVoteState) {
            voteStates[video._id] = video.userVoteState;
          }
        });
      }
      setUserVotes(voteStates);

      console.log(
        "✅ AllVideos: State updated with",
        videosData?.length || 0,
        "videos"
      );
    } catch (err) {
      console.error("❌ AllVideos: Error fetching videos:", err);
      console.error("🔍 Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
      });
      setVideos([]);
    }
  };

  const handleVote = async (videoId, voteType) => {
    // Check if user is logged in
    if (!currentUser) {
      alert("Please log in to vote on videos!");
      return;
    }

    try {
      setVotingStatus((prev) => ({ ...prev, [videoId]: "voting" }));

      // Make API call to vote (correct endpoint - no /videos prefix since baseURL already includes it)
      const response = await axiosInstance.post(`/${videoId}/vote`, {
        voteType: voteType, // 'upvote' or 'downvote'
      });

      console.log("Vote response:", response.data);

      // Update the video in the local state
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? {
                ...video,
                upvotes: response.data.data.upvotes || 0,
                downvotes: response.data.data.downvotes || 0,
                votes: response.data.data.totalVotes || 0,
              }
            : video
        )
      );

      // Update user vote state
      setUserVotes((prev) => ({
        ...prev,
        [videoId]: response.data.data.userVoteState,
      }));

      setVotingStatus((prev) => ({ ...prev, [videoId]: "success" }));

      // Clear status after animation
      setTimeout(() => {
        setVotingStatus((prev) => ({ ...prev, [videoId]: null }));
      }, 1000);
    } catch (error) {
      console.error("Error voting:", error);
      setVotingStatus((prev) => ({ ...prev, [videoId]: "error" }));

      // Clear error status
      setTimeout(() => {
        setVotingStatus((prev) => ({ ...prev, [videoId]: null }));
      }, 2000);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      setVotingStatus((prev) => ({ ...prev, [videoId]: "deleting" }));

      await axiosInstance.delete(`/${videoId}`);

      // Remove video from local state
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video._id !== videoId)
      );

      setVotingStatus((prev) => ({ ...prev, [videoId]: "deleted" }));
    } catch (error) {
      console.error("Error deleting video:", error);

      if (error.response?.status === 403) {
        alert("❌ You can only delete your own videos");
      } else if (error.response?.status === 401) {
        alert("❌ Please login to delete videos");
      } else {
        alert("❌ Failed to delete video");
      }

      setVotingStatus((prev) => ({ ...prev, [videoId]: "delete-error" }));

      // Clear error status
      setTimeout(() => {
        setVotingStatus((prev) => ({ ...prev, [videoId]: null }));
      }, 2000);
    }
  };

  const handlePlayVideo = (videoId) => {
    console.log("🎬 Play button clicked for video ID:", videoId);
    const video = videos.find((v) => v._id === videoId);
    console.log("🎯 Found video for playback:", video);
    console.log("📹 Video file URL:", video?.videoFile);
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  useEffect(() => {
    // Initial load when component mounts
    console.log("AllVideos component mounted, loading videos...");
    fetchVideos(1);
  }, []);

  return (
    <div className="all-videos-container">
      <h2 className="title">Explore All Videos</h2>

      {/* Video Grid */}
      <div className="video-grid">
        {(() => {
          console.log("🎨 AllVideos: Rendering video grid");
          console.log("📊 AllVideos: Current videos state:", videos);
          console.log("📏 AllVideos: Videos array length:", videos.length);

          if (videos.length === 0) {
            console.log("⚠️ AllVideos: No videos to display");
            return (
              <div className="no-videos">
                <p>No videos found. Upload some videos to get started!</p>
              </div>
            );
          }

          console.log("✨ AllVideos: Rendering", videos.length, "video cards");
          return videos.map((video, index) => {
            console.log(`🎬 AllVideos: Rendering video ${index + 1}:`, {
              id: video._id,
              title: video.title,
              thumbnail: video.thumbnail,
            });

            return (
              <div key={video._id} className="video-card">
                <div className="thumbnail-wrapper">
                  <img
                    src={
                      video.thumbnail ||
                      "https://picsum.photos/400/300?random=1"
                    }
                    alt={video.title || "Video thumbnail"}
                    className="thumbnail"
                    onError={(e) => {
                      console.log("Image failed to load:", video.thumbnail);
                      e.target.src = "https://picsum.photos/400/300?random=1";
                    }}
                  />
                  <div className="overlay">
                    <button
                      className="play-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(
                          "🔘 Play button clicked for:",
                          video.title,
                          video._id
                        );
                        handlePlayVideo(video._id);
                      }}
                      onMouseEnter={() =>
                        console.log(
                          "🎯 Hovering over play button for:",
                          video.title
                        )
                      }
                    >
                      ▶ Play
                    </button>
                  </div>
                  {/* Always visible play button */}
                  <button
                    className="play-btn-always"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(
                        "🔘 Always-visible play button clicked for:",
                        video.title,
                        video._id
                      );
                      handlePlayVideo(video._id);
                    }}
                    title="Play Video"
                  >
                    ▶
                  </button>
                </div>
                <div className="video-content">
                  <h3 className="video-title">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="video-desc">
                    {video.description || "No description available"}
                  </p>

                  {/* Vote Buttons */}
                  <div className="vote-section">
                    <button
                      className={`vote-btn upvote ${
                        userVotes[video._id] === "upvoted" ? "active" : ""
                      } ${
                        votingStatus[video._id] === "voting" ? "voting" : ""
                      }`}
                      onClick={() => handleVote(video._id, "upvote")}
                      disabled={
                        votingStatus[video._id] === "voting" || !currentUser
                      }
                      title={
                        !currentUser
                          ? "Please log in to vote"
                          : userVotes[video._id] === "upvoted"
                          ? "Remove upvote"
                          : "Upvote"
                      }
                    >
                      👍 {video.upvotes || 0}
                    </button>
                    <button
                      className={`vote-btn downvote ${
                        userVotes[video._id] === "downvoted" ? "active" : ""
                      } ${
                        votingStatus[video._id] === "voting" ? "voting" : ""
                      }`}
                      onClick={() => handleVote(video._id, "downvote")}
                      disabled={
                        votingStatus[video._id] === "voting" || !currentUser
                      }
                      title={
                        !currentUser
                          ? "Please log in to vote"
                          : userVotes[video._id] === "downvoted"
                          ? "Remove downvote"
                          : "Downvote"
                      }
                    >
                      👎 {video.downvotes || 0}
                    </button>

                    {/* Delete Button - Only show for video owner */}
                    {currentUser && video.owner === currentUser._id && (
                      <button
                        className={`delete-btn ${
                          votingStatus[video._id] === "deleting"
                            ? "deleting"
                            : ""
                        }`}
                        onClick={() => handleDeleteVideo(video._id)}
                        disabled={votingStatus[video._id] === "deleting"}
                        title="Delete Video"
                      >
                        {votingStatus[video._id] === "deleting" ? "⏳" : "🗑️"}
                      </button>
                    )}

                    {votingStatus[video._id] === "success" && (
                      <span className="vote-feedback success">✅ Voted!</span>
                    )}
                    {votingStatus[video._id] === "error" && (
                      <span className="vote-feedback error">❌ Error</span>
                    )}
                    {votingStatus[video._id] === "deleted" && (
                      <span className="vote-feedback success">✅ Deleted!</span>
                    )}
                    {votingStatus[video._id] === "delete-error" && (
                      <span className="vote-feedback error">
                        ❌ Delete Failed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Video Modal for Fullscreen Playback */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeVideoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeVideoModal}>
              ×
            </button>
            <h3>{selectedVideo.title || "Untitled Video"}</h3>
            {selectedVideo.videoFile ? (
              <video
                controls
                autoPlay
                src={selectedVideo.videoFile}
                className="modal-video"
                onError={(e) => {
                  console.error("Video playback error:", e);
                  console.error("Video URL:", selectedVideo.videoFile);
                }}
                onLoadStart={() =>
                  console.log("Video loading started:", selectedVideo.videoFile)
                }
                onCanPlay={() =>
                  console.log("Video can play:", selectedVideo.title)
                }
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="video-error">
                <p>❌ Video file not available</p>
                <p>Debug info: {JSON.stringify(selectedVideo, null, 2)}</p>
              </div>
            )}
            <p className="video-description">
              {selectedVideo.description || "No description available"}
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ⬅ Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default AllVideos;
