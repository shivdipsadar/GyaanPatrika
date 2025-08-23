import { Link } from "react-router-dom";
import { Rocket, BarChart3, Users } from "lucide-react"; // ✅ Importing icons

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Test Your Knowledge with{" "}
          <span className="text-yellow-300">Gyan Patrika</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8">
          Create, share, and attempt quizzes with ease. Compete with friends,
          learn new skills, or prepare for exams with insightful analytics.
        </p>
        <div className="flex gap-4">
          <Link
            to="/signup"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Gyan Patrika?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
              <Rocket className="mx-auto mb-4 w-16 h-16 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">Easy to Use</h3>
              <p>
                Create quizzes quickly with our simple interface. Learning made
                fun and easy!
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
              <BarChart3 className="mx-auto mb-4 w-16 h-16 text-green-600" />
              <h3 className="text-xl font-semibold mb-4">Analytics</h3>
              <p>
                Track attempts, scores, and performance trends with insightful
                reports.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
              <Users className="mx-auto mb-4 w-16 h-16 text-purple-600" />
              <h3 className="text-xl font-semibold mb-4">Community</h3>
              <p>
                Challenge friends, share quizzes, and climb the leaderboard
                together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <p className="italic mb-4">
                "Gyan Patrika helped me ace my exams with fun quizzes!"
              </p>
              <p className="font-semibold">- Aisha S.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <p className="italic mb-4">
                "The analytics and reports are amazing for tracking progress."
              </p>
              <p className="font-semibold">- Raj P.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <p className="italic mb-4">
                "I love creating quizzes and sharing them with my friends!"
              </p>
              <p className="font-semibold">- Sneha K.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Quiz Journey?
        </h2>
        <p className="mb-6 max-w-xl mx-auto">
          Join thousands of learners and start challenging yourself today!
        </p>
        <Link
          to="/signup"
          className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition"
        >
          Join Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} Gyan Patrika. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
