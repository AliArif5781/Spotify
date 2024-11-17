import { Globe, ChevronLeft, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import PlayListData from "./PlayListData";
import { albumsData } from "../../assets/assets";
import { AlbimChart, SongDAta } from "../../types/type";
import { useNavigate } from "react-router-dom";
import { setAddSong } from "../../features/Song/AddSongSlice";
import { useDispatch } from "react-redux";

const PlayListSection = () => {
  const [isLeftSectionVisible, setIsLeftSectionVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongDAta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("albumsdata", albumsData);
  console.log(isPlaying);

  const toggleLeftSection = () => {
    setIsLeftSectionVisible(!isLeftSectionVisible);
  };

  useEffect(() => {
    const savedSong = localStorage.getItem("currentSong");
    const savedIsPlaying = localStorage.getItem("isPlaying");

    if (savedSong) {
      const song = JSON.parse(savedSong);
      setCurrentSong(song);
      setIsPlaying(savedIsPlaying === "true");
    }
    return () => {
      localStorage.removeItem("currentSong");
      localStorage.removeItem("isPlaying");
    };
  }, []);

  // Save state to localStorage when changes happen
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }
  }, [currentSong]);

  const AlbumNavigate = (id: AlbimChart) => {
    dispatch(setAddSong(id));
    // localStorage.setItem("PlayListData", JSON.stringify(song));
    navigate("/albumSong");
  };
  return (
    <div>
      {/* Toggle Button */}
      <div
        className={`absolute top-10 -translate-y-1/2 left-4 z-20 cursor-pointer ${
          isLeftSectionVisible ? "hidden" : "block"
        }`}
        onClick={toggleLeftSection}
      >
        <Menu className="h-8 w-8 text-white" />
      </div>

      <div className="section flex bg-black-200">
        {/* Left Section */}
        <div
          className={`left-section fixed top-0 left-0 h-full transform ${
            isLeftSectionVisible ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out w-64 bg-black-150 z-30 flex flex-col`}
        >
          {/* Toggle Close Button */}
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={toggleLeftSection}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </div>

          {/* Top header */}
          <div className="top-header p-4">
            <div className="svg-icon flex items-center gap-2">
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="icon h-6 w-6"
              >
                <path
                  fill="#F6F6F6"
                  d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"
                ></path>
              </svg>
              <span className="header-text text-white font-semibold">
                Your Library
              </span>
            </div>
          </div>
          {/* Main Content Area with Flex Grow */}
          <div className="flex-grow overflow-hidden">
            <div className="playlist-container h-[calc(100vh-240px)] px-2">
              <h3 className="text-white font-semibold px-4 py-2">
                Your Playlist
              </h3>
              <div className="overflow-y-auto pb-10 h-full custom-scrollbar">
                {albumsData.map((track: AlbimChart, index) => (
                  <div
                    key={track.id}
                    className="flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                    // onClick={() => handleSongTrack(track)}
                    onClick={() => AlbumNavigate(track)}
                  >
                    <div className="w-12 text-center text-gray-400">
                      {index + 1}
                    </div>
                    <div className="flex items-center flex-1">
                      <img
                        src={track.image}
                        alt={track.name}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                      <div>
                        <div className="text-white text-sm font-medium">
                          {track.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {/* {track.duration} */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-auto p-4 border-t border-gray-800">
            <div className="footer-links text-sm text-gray-400">
              <ul className="grid grid-cols-2 gap-2">
                <li className="hover:text-white cursor-pointer">Legal</li>
                <li className="hover:text-white cursor-pointer">
                  Safety & Privacy
                </li>
                <li className="hover:text-white cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer">Cookies</li>
                <li className="hover:text-white cursor-pointer">About Ads</li>
                <li className="hover:text-white cursor-pointer">
                  Accessibility
                </li>
              </ul>
            </div>

            <div className="language-selector mt-4">
              <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="text-sm">English</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <PlayListData />
      </div>
    </div>
  );
};

export default PlayListSection;
