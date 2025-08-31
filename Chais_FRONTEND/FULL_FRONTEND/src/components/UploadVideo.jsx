import { useState, useRef } from "react";
import axiosInstance from "./api/axiosInstance";
import "./UploadVideocss.css";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (videoFile) formData.append("videoFile", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      await axiosInstance.post("/publish", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);

      if (videoInputRef.current) videoInputRef.current.value = "";
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2 className="upload-title">🎬 Upload a New Video</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            placeholder="Enter a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
          />

          <textarea
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="textarea-field"
          />

          {/* File inputs with custom labels */}
          <label className="file-upload">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              ref={videoInputRef}
              required
            />
            📹 Choose Video File
          </label>

          <label className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              ref={thumbInputRef}
              required
            />
            🖼️ Choose Thumbnail
          </label>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "⏳ Uploading..." : "🚀 Publish Video"}
          </button>
        </form>

        {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
};

export default UploadVideo;
