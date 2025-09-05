// src/pages/StoryDetail.js
import React, { useEffect, useState } from "react";
import { getStory, addBranch, voteOnVideo } from "./api/storyApi.jsx";
import { useParams } from "react-router-dom";

const StoryDetail = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [branchVideoId, setBranchVideoId] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await getStory(storyId);
        console.log("Story response:", res.data);

        // Handle the nested response structure similar to StoriesList
        const storyData = res.data?.data?.story || res.data;
        setStory(storyData);
      } catch (error) {
        console.error("Failed to fetch story:", error);
      }
    };

    fetchStory();
  }, [storyId]);

  const handleAddBranch = async () => {
    try {
      if (!story.rootVideo?._id) {
        alert("Root video ID is missing");
        return;
      }

      if (!branchVideoId.trim()) {
        alert("Please enter a branch video ID");
        return;
      }

      console.log("Adding branch:", {
        parentVideoId: story.rootVideo._id,
        branchVideoId: branchVideoId,
      });

      await addBranch(story.rootVideo._id, { branchVideoId });
      alert("Branch added!");
      setBranchVideoId(""); // Clear the input
    } catch (error) {
      console.error("Error adding branch:", error);
      alert(
        "Error adding branch: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleVote = async (videoId, type) => {
    try {
      if (!videoId) {
        alert("Video ID is missing");
        return;
      }

      // Convert type to value format expected by backend
      const value = type === "upvote" ? 1 : -1;

      console.log(
        "Voting on video:",
        videoId,
        "with type:",
        type,
        "value:",
        value
      );
      await voteOnVideo(videoId, { value });
      alert("Voted!");
    } catch (error) {
      console.error("Error voting:", error);
      alert(
        "Error voting: " + (error.response?.data?.message || error.message)
      );
    }
  };

  if (!story) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>{story.title}</h2>
      <p>{story.description}</p>
      <h3>Root Video</h3>
      {story.rootVideo?.videoFile ? (
        <video width="400" controls>
          <source src={story.rootVideo.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Video not available</p>
      )}

      {/* Debug info */}
      <div style={{ fontSize: "12px", color: "gray", marginTop: "10px" }}>
        <p>Video URL: {story.rootVideo?.videoFile || "Not found"}</p>
        <p>Video ID: {story.rootVideo?._id || "Not found"}</p>
      </div>
      <div>
        <button onClick={() => handleVote(story.rootVideo?._id, "upvote")}>
          👍
        </button>
        <button onClick={() => handleVote(story.rootVideo?._id, "downvote")}>
          👎
        </button>
      </div>

      {/* Branches Section */}
      <div style={{ marginTop: "20px" }}>
        <h4>Branches ({story.rootVideo?.branches?.length || 0})</h4>
        {story.rootVideo?.branches && story.rootVideo.branches.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            {story.rootVideo.branches.map((branch) => (
              <div
                key={branch._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <h5>{branch.title}</h5>
                {branch.thumbnail && (
                  <img
                    src={branch.thumbnail}
                    alt={branch.title}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                )}
                {branch.videoFile && (
                  <video
                    width="100%"
                    height="120"
                    controls
                    style={{ marginTop: "5px" }}
                  >
                    <source src={branch.videoFile} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div
                  style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}
                >
                  <p>Branch ID: {branch._id}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "gray", fontStyle: "italic" }}>
            No branches added yet. Add the first branch above!
          </p>
        )}
      </div>

      <div>
        <h4>Add Branch</h4>
        <input
          value={branchVideoId}
          onChange={(e) => setBranchVideoId(e.target.value)}
          placeholder="Video ID"
        />
        <button onClick={handleAddBranch}>Add</button>
      </div>
    </div>
  );
};

export default StoryDetail;
