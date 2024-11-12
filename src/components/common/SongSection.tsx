import { useRef, useState, useEffect } from "react";
import { songsData } from "../../assets/assets";
import { SongDAta } from "../../types/type";
import { FaPlay } from "react-icons/fa6";
import { IoMdPause } from "react-icons/io";
import { VolumeX, Volume1, Volume2 } from "lucide-react";

const SongSection = () => {
  const [currentSong, setCurrentSong] = useState<SongDAta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedSong = localStorage.getItem("currentSong");
    const savedIsPlaying = localStorage.getItem("isPlaying");

    if (savedSong) {
      const song = JSON.parse(savedSong);
      setCurrentSong(song);
      setIsPlaying(savedIsPlaying === "true");
    }
  }, []);

  // Save state to localStorage when changes happen
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }
  }, [currentSong]);

  // Handle song selection and playback
  const handleSongTrack = (song: SongDAta) => {
    if (audioRef.current) {
      // Stop the currently playing song
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0); // Reset progress when changing song

      // Set up and play the new song
      audioRef.current.src = song.file;
      audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  // Toggle play/pause
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

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = parseFloat(e.target.value);
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  // Handle progress bar change
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progressValue = parseFloat(e.target.value);
    setProgress(progressValue);
    if (audioRef.current) {
      audioRef.current.currentTime =
        (progressValue / 100) * audioRef.current.duration;
    }
  };

  // Update progress bar during playback
  const handleTimeUpdate = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  // Render volume icon based on the volume level
  const renderVolumeIcon = () => {
    if (volume === 0) return <VolumeX />;
    if (volume < 40) return <Volume1 />;
    return <Volume2 />;
  };

  // Set volume when the volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="w-full pb-[100px]">
      {/* Heading for Songs Section */}
      <h1 className="text-3xl font-bold text-white mb-6 p-3">
        Today’s Biggest Hits
      </h1>

      {/* Songs Grid with horizontal scroll and custom scrollbar */}
      <div className="overflow-x-auto custom_scrollbar">
        <div className="flex gap-6">
          {songsData && songsData.length > 0 ? (
            songsData.map((song: SongDAta) => (
              <div
                key={song.id}
                className="song-card group relative hover:shadow-2xl rounded-lg overflow-hidden flex-none w-[200px]"
                onClick={() => handleSongTrack(song)}
              >
                {/* Song Image with Hover Effect */}
                <img
                  src={song.image}
                  alt={song.name}
                  className="h-[150px] object-contain group-hover:opacity-80 transition-all duration-300 rounded-xl"
                />
                {/* Overlay Effect */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-40 transition-all duration-300 rounded-lg"></div>
                {/* Text Content */}
                <div className="text-content mt-2 p-2 flex justify-center flex-col">
                  <h3 className="text-white font-bold group-hover:text-gray-300 transition-all duration-300">
                    {song.name}
                  </h3>
                  <p className="text-white text-sm group-hover:text-gray-400 transition-all duration-300">
                    {song.desc}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-lg">Loading...</p>
          )}
        </div>
      </div>

      {/* Current Song Info and Player Controls */}
      {currentSong && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 h-24 mt-[100px]">
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
                  <span className="text-xs text-gray-400">0:00</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-400">3:45</span>
                </div>
              </div>

              {/* Right section - Volume Controls */}
              <div className="flex justify-end items-center space-x-3">
                <button
                  onClick={() => setVolume(volume === 0 ? 50 : 0)}
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
                    style={{
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #b3b3b3 ${volume}%, #b3b3b3 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
    </div>
  );
};

export default SongSection;
