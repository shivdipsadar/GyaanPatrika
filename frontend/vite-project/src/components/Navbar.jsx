import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Gyan Patrika
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="hover:text-gray-200 font-medium"
              >
                Dashboard
              </Link>
              <span className="font-medium">Hi, {user.username}</span>
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/signup" className="hover:text-gray-200">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
