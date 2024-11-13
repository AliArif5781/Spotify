import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSong,
  setIsPlaying,
  setVolume,
  setProgress,
} from "../../features/Song/SongSlice";
import { FaPlay } from "react-icons/fa6";
import { IoMdPause } from "react-icons/io";
import { VolumeX, Volume1, Volume2 } from "lucide-react";
import { RootState } from "../../app/store";
import { useEffect, useRef } from "react";
import { SongDAta } from "../../types/type";
import { songsData } from "../../assets/assets";

const SongSection = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume, progress } = useSelector(
    (state: RootState) => state.song
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSongTrack = (song: SongDAta) => {
    if (audioRef.current) {
      // Stop the currently playing song
      audioRef.current.pause();
      dispatch(setIsPlaying(false));
      // dispatch(setProgress(0)); // Reset progress when changing song

      // Set up and play the new song
      audioRef.current.src = song.file;
      audioRef.current.play();
      dispatch(setCurrentSong(song));
      dispatch(setIsPlaying(true));
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        dispatch(setIsPlaying(false));
      } else {
        audioRef.current.play();
        dispatch(setIsPlaying(true));
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = parseFloat(e.target.value);
    dispatch(setVolume(volumeValue));
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progressValue = parseFloat(e.target.value);
    dispatch(setProgress(progressValue));
    if (audioRef.current) {
      audioRef.current.currentTime =
        (progressValue / 100) * audioRef.current.duration;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      dispatch(
        setProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        )
      );
    }
  };

  const renderVolumeIcon = () => {
    if (volume === 0) return <VolumeX />;
    if (volume < 40) return <Volume1 />;
    return <Volume2 />;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Save state to localStorage when changes happen
  useEffect(() => {
    if (currentSong) {
      localStorage.removeItem("currentSong");
      localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }
  }, [currentSong]);

  return (
    <div className="w-full pb-[100px]">
      <h1 className="text-3xl font-bold text-white mb-6 p-3">
        Today’s Biggest Hits
      </h1>

      <div className="overflow-x-auto custom_scrollbar">
        <div className="flex gap-6">
          {songsData && songsData.length > 0 ? (
            songsData.map((song) => (
              <div
                key={song.id}
                className="song-card group relative hover:shadow-2xl rounded-lg overflow-hidden flex-none w-[200px]"
                onClick={() => handleSongTrack(song)}
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="h-[150px] object-contain group-hover:opacity-80 transition-all duration-300 rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-40 transition-all duration-300 rounded-lg"></div>
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

      {currentSong && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 h-24 mt-[100px]">
          <div className="max-w-screen-2xl mx-auto px-4 h-full">
            <div className="grid grid-cols-3 h-full items-center gap-4">
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

              <div className="flex justify-end items-center space-x-3">
                <button
                  onClick={() => dispatch(setVolume(volume === 0 ? 50 : 0))}
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
                  />
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
    </div>
  );
};

export default SongSection;
