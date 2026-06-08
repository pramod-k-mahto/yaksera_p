import React from "react";

function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      
      {/* Big 404 */}
      <h1 className="text-7xl font-extrabold text-gray-900">
        404
      </h1>

      {/* Title */}
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="mt-2 text-gray-500 max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <a
        href="/"
        className="mt-6 inline-block px-6 py-3 text-white bg-red-600 hover:bg-blue-700 rounded-xl shadow-md transition"
      >
        Go Back Home
      </a>
    </div>
  );
}

export default PageNotFound;