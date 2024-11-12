import React, { useState, useEffect } from "react";
import { Search, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import img2 from "/spotifylogo1.webp";
import img1 from "/spotify.png";

const Navbar = () => {
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");
  const [isNameSet, setIsNameSet] = useState(!!localStorage.getItem("name"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem("name", userName.trim());
      setIsNameSet(true);
      setIsDialogOpen(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  // Clear name functionality
  const handleClearName = () => {
    localStorage.removeItem("name");
    setUserName("");
    setIsNameSet(false);
  };

  return (
    <>
      <div className="main-section">
        <div className="one-section flex items-center justify-between p-4">
          {/* Logo */}
          <Link to="/" className="spotify-logo">
            <img src={img1} alt="Spotify-logo" className="h-8" />
          </Link>

          {/* Center logo */}
          <div>
            <img src={img2} alt="" className="h-16" />
          </div>

          {/* User section */}
          <div className="user-section flex items-center">
            <div
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer relative group"
            >
              {isNameSet ? (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold hover:bg-green-700 transition-colors">
                  {userName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="login-in-section p-1 rounded-full hover:bg-gray-100">
                  <UserRound />
                </div>
              )}
              {/* Tooltip */}
              {isNameSet && (
                <div className="absolute hidden group-hover:block top-full mt-1 right-0 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                  {userName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isNameSet ? "Update Your Name" : "Enter Your Name"}
              </h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Save
                </button>
                {isNameSet && (
                  <button
                    type="button"
                    onClick={handleClearName}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
