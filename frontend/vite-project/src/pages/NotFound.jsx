import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-100">
      <h1 className="text-7xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
