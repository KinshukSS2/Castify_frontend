// src/pages/StoryTree.js
import React, { useEffect, useState } from "react";
import { getFullStoryTree } from "./api/storyApi.jsx";
import { useParams } from "react-router-dom";

const renderTree = (video) => {
  return (
    <li key={video._id}>
      <p>{video.title}</p>
      <video width="250" controls>
        <source src={video.url} type="video/mp4" />
      </video>
      {video.branches && video.branches.length > 0 && (
        <ul>{video.branches.map((child) => renderTree(child))}</ul>
      )}
    </li>
  );
};

const StoryTree = () => {
  const { storyId } = useParams();
  const [tree, setTree] = useState(null);

  useEffect(() => {
    getFullStoryTree(storyId).then((res) => setTree(res.data));
  }, [storyId]);

  if (!tree) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Story Tree</h2>
      <ul>{renderTree(tree.root)}</ul>
    </div>
  );
};

export default StoryTree;
