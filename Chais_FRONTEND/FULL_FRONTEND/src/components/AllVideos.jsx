import { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";
import "./AllVideoscss.css";


const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVideos = async (page = 1) => {
    try {
      const res = await axiosInstance.get(`/getAll-videos?page=${page}&limit=12`);
      setVideos(res.data.videos);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  return (
    <div className="all-videos-container">
      <h2 className="title">Explore All Videos</h2>

      {/* Video Grid */}
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            <div className="thumbnail-wrapper">
              <img src={video.thumbnail} alt={video.title} className="thumbnail" />
              <div className="overlay">
                <button className="play-btn">▶ Play</button>
              </div>
            </div>
            <div className="video-content">
              <h3 className="video-title">{video.title}</h3>
              <p className="video-desc">{video.description}</p>
              <video controls src={video.videoFile} className="video-player"></video>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ⬅ Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default AllVideos;
