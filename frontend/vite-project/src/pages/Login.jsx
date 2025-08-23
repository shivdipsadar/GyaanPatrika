import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password);

      // ✅ Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex w-full max-w-4xl">
        
        {/* Left: Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Login to continue your quiz journey
          </p>

          {error && <p className="text-red-600 text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block flex-1 bg-indigo-50">
          <img
            src="/login.jpg"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
