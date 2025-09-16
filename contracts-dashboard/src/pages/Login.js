import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Username is required");
      return;
    }
    if (password === "test123") {
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem("username", username);
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid password. Hint: test123");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
        autoComplete="off" // ⛔ disables browser autocomplete
      >
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          autoComplete="off" // ⛔ disables saved username autofill
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Password (test123)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          autoComplete="new-password" // ⛔ prevents password breach warning
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}


