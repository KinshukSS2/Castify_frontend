import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import MainPage from "./components/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<MainPage />} /> {/* fallback */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
