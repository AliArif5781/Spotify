import { Globe, ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PlayListData from "./PlayListData";
import { songsData } from "../../assets/assets";
import { SongDAta } from "../../types/type";
import { FaPlay } from "react-icons/fa6";
import { IoMdPause } from "react-icons/io";
import { VolumeX, Volume1, Volume2 } from "lucide-react";

const PlayListSection = () => {
  const [isLeftSectionVisible, setIsLeftSectionVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongDAta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);

  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleLeftSection = () => {
    setIsLeftSectionVisible(!isLeftSectionVisible);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

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

  const handleSongTrack = (track: SongDAta) => {
    // Reset volume to avoid NaN on song change
    if (audioRef.current) {
      audioRef.current.src = track.file;
      audioRef.current.play();
      setCurrentSong(track);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = parseFloat(e.target.value);
    if (!isNaN(volumeValue)) return; // Ignore invalid values

    setVolume(volumeValue); // Store volume as a number in the range 0-100
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  const handleMutetoggle = () => {
    const newVolume = volume === 0 ? 50 : 0;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const renderVolumeIcon = () => {
    if (volume === 0) return <VolumeX />;
    if (volume < 40) return <Volume1 />;
    return <Volume2 />;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progressValue = parseFloat(e.target.value);
    setProgress(progressValue);
    if (audioRef.current) {
      audioRef.current.currentTime =
        (progressValue / 100) * audioRef.current.duration;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle audio loading
  // const handleLoadedMetadata = () => {
  //   if (audioRef.current) {
  //     setDuration(audioRef.current.duration);
  //   }
  // };

  const sliderBackground = `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #b3b3b3 ${volume}%, #b3b3b3 100%)`;
  const progressBackground = `linear-gradient(to right, #1db954 0%, #1db954 ${progress}%, #b3b3b3 ${progress}%, #b3b3b3 100%)`;

  return (
    <div>
      {/* Toggle Button */}
      <div
        className={`absolute top-1/4 -translate-y-1/2 left-4 z-20 cursor-pointer ${
          isLeftSectionVisible ? "hidden" : "block"
        }`}
        onClick={toggleLeftSection}
      >
        <ChevronRight className="h-8 w-8 text-white" />
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
                {songsData.map((track: SongDAta, index) => (
                  <div
                    key={track.id}
                    className="flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                    onClick={() => handleSongTrack(track)}
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
                          {track.duration}
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

      {/* Player Footer */}
      {currentSong && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 h-24">
          <div className="max-w-screen-2xl mx-auto px-4 h-full">
            <div className="grid grid-cols-3 h-full items-center gap-4">
              {/* Left section - Song Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={currentSong.image}
                  alt={currentSong.name}
                  className="h-14 w-14 object-cover rounded-md shadow-lg"
                />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm hover:underline cursor-pointer">
                    {currentSong.name}
                  </span>
                  <span className="text-gray-400 text-xs hover:text-white cursor-pointer">
                    {currentSong.duration}
                  </span>
                </div>
              </div>

              {/* Center section - Player Controls */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 text-white hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                      <IoMdPause className="w-8 h-8" />
                    ) : (
                      <FaPlay className="w-8 h-8" />
                    )}
                  </button>
                </div>
                <div className="w-full flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleProgressChange}
                    className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{ background: progressBackground }}
                  />
                  <span className="text-xs text-gray-400">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Right section - Volume Controls */}
              <div className="flex justify-end items-center space-x-3">
                <button
                  onClick={handleMutetoggle}
                  className="text-gray-400 hover:text-white"
                >
                  {renderVolumeIcon()}
                </button>
                <div className="w-24 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{ background: sliderBackground }}
                  />
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        // onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

export default PlayListSection;
