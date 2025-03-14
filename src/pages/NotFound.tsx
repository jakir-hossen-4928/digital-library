import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="animate-bounce">
          <svg
            className="mx-auto h-32 w-32 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600">
          Oops! The page <code className="text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{location.pathname}</code> seems to be lost in space.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-purple-200"
          >
            ← Go Back
          </button>
          <span className="text-gray-400 hidden sm:block">or</span>
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium"
          >
            Return Home
          </a>
        </div>

        <div className="pt-8">
          <p className="text-gray-500 mb-2">Can't find what you're looking for?</p>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm">
            <form action="/search" className="flex">
              <input
                type="search"
                placeholder="Search our site..."
                className="w-full px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-8">
          Still stuck? <a href="mailto:support@example.com" className="text-purple-600 hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;