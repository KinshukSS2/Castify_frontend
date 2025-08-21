import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/register");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex justify-center items-center">
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
        <img
          src={user.avatar || "https://via.placeholder.com/100"}
          alt="avatar"
          className="w-28 h-28 rounded-full mx-auto border-4 border-purple-500"
        />
        <h2 className="text-2xl font-bold mt-4">{user.fullname}</h2>
        <p className="text-gray-400">@{user.username}</p>

        <div className="mt-6 space-y-2 text-left">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Username:</span> {user.username}</p>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
