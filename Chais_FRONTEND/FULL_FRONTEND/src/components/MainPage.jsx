import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-400 text-white">
      <h1 className="text-4xl font-extrabold mb-10">Welcome to Chai App ☕</h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-purple-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-purple-800 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
