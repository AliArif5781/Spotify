import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa6";
import { Volume2, VolumeX } from "lucide-react";
import { SongDAta } from "../../types/type";
import { SavedSongData } from "../../features/Song/AddSongSlice";
import "../../style/sound.css";
const Footer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const songData = useSelector((state: RootState) => state.add.selectSong);
  const dispatch = useDispatch();
  // console.log(songData, "footer");

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing the song:", error);
        });
      }
      setIsPlaying((prev) => !prev); // Use function updater form to avoid dependency on isPlaying    }
    }
  }, [isPlaying]);

  const handleProgressChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setProgress(value);
      if (audioRef.current) {
        audioRef.current.currentTime =
          (value / 100) * audioRef.current.duration;
      }
    },
    []
  );

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setVolume(value);
      if (audioRef.current) {
        audioRef.current.volume = value / 100;
      }
    },
    []
  );

  const handleVolumeToggle = useCallback(() => {
    if (isMuted) {
      // Restore to the default volume (50%) when unmuting
      setVolume(50);
    } else {
      // Set volume to 0 when muting
      setVolume(0);
    }
    setIsMuted(!isMuted); // Toggle mute state
  }, [isMuted]);

  useEffect(() => {
    if (songData && audioRef.current) {
      audioRef.current.src = songData.file;
      // audioRef.current.play().catch((error) => {
      //   console.error("Error playing the song:", error);
      // });
      dispatch(SavedSongData(songData));
      setIsPlaying(false);
    }
  }, [songData]);

  useEffect(() => {
    const storedSongData = localStorage.getItem("currentSong");
    if (storedSongData) {
      const parsedSongData: SongDAta = JSON.parse(storedSongData);
      dispatch(SavedSongData(parsedSongData));
      setIsPlaying(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // Update audio element volume
    }
  }, [volume]); // Re-run when volume changes

  if (!songData) {
    return null; // If no song data, don't render the footer
  }

  const sliderBackground = `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #b3b3b3 ${volume}%, #b3b3b3 100%)`;

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() =>
          setProgress(
            ((audioRef.current?.currentTime || 0) /
              (audioRef.current?.duration || 1)) *
              100
          )
        }
      />

      <footer className="rightSection fixed bottom-0 left-0 right-0 bg-black-300 from-gray-900 to-black border-t border-gray-800 h-24 mt-[100px]">
        <div className="max-w-screen-2xl mx-auto px-4 h-full">
          <div className="grid grid-cols-3 h-full items-center gap-4">
            {/* Song Info */}
            <div className="flex items-center space-x-4">
              <img
                src={songData?.image}
                alt={songData?.name}
                className="h-14 w-14 object-cover rounded-md shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium text-sm hover:underline cursor-pointer">
                  {songData?.name}
                </span>
                <span className="text-gray-400 text-xs hover:text-white cursor-pointer">
                  {songData?.duration}
                </span>
              </div>
            </div>

            {/* Playback Controls */}
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

            {/* Volume Controls */}
            <div className=" flex justify-end items-center space-x-3">
              <button
                onClick={handleVolumeToggle} // This button toggles volume mute/unmute
                className="text-gray-400 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" /> // Show mute icon when muted
                ) : (
                  <Volume2 className="w-6 h-6" /> // Show unmute icon when volume is not 0
                )}
              </button>
              <div className="sound w-24 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{ background: sliderBackground }} // Apply dynamic background
                  className=" w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
