import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.username, formData.email, formData.password);
      navigate("/login"); // redirect after signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex w-full max-w-4xl">
        
        {/* Left: Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Create Account 🚀
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Join us and start your quiz journey
          </p>

          {error && <p className="text-red-600 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block flex-1 bg-indigo-50">
          <img
            src="/login.jpg"
            alt="Signup Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
