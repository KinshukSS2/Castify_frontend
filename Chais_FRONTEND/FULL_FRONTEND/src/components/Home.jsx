import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/"); // redirect to main page if not logged in
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        { withCredentials: true } // important for cookies
      );

      // clear local storage
      localStorage.removeItem("user");

      // redirect to main page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("❌ Logout failed");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-6">
        Welcome back, {user.fullname} 👋
      </h2>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/profile")}
          className="bg-purple-600 px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition text-lg font-semibold"
        >
          View Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-6 py-3 rounded-xl shadow-lg hover:bg-red-700 transition text-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
