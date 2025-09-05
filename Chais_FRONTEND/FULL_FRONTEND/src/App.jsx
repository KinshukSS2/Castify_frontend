// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import UploadVideo from "./components/UploadVideo";
import AllVideos from "./components/AllVideos";

// 🆕 Import Story-related pages
import StoriesList from "./components/StoriesList";
import CreateStory from "./components/CreateStory";
import StoryDetail from "./components/StoryDetail";
import StoryTree from "./components/StoryTree";
import StoryViewer from "./components/StoryViewer";

// 🎬 Import Video Populator
import VideoPopulator from "./components/VideoPopulator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root/Landing */}
        <Route path="/" element={<MainPage />} />

        {/* Auth + User */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />

        {/* Videos */}
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/videos" element={<AllVideos />} />

        {/* Content Population */}
        <Route path="/populate" element={<VideoPopulator />} />

        {/* Stories */}
        <Route path="/stories" element={<StoriesList />} />
        <Route path="/stories/create" element={<CreateStory />} />
        <Route path="/stories/:storyId" element={<StoryDetail />} />
        <Route path="/stories/:storyId/watch" element={<StoryViewer />} />
        <Route path="/stories/:storyId/full" element={<StoryTree />} />

        {/* Default (catch-all) */}
        <Route path="*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
