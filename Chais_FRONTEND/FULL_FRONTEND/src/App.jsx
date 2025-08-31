import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import UploadVideo from "./components/UploadVideo";
import AllVideos from "./components/AllVideos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/videos" element={<AllVideos />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
