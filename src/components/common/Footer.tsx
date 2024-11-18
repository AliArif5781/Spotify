import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa6";
import { Volume2, VolumeX } from "lucide-react";
import { SongDAta } from "../../types/type";
import {
  SavedSongData,
  setCurrentSongIndex,
  SkipPrevious,
} from "../../features/Song/AddSongSlice";
import "../../style/sound.css";
import { songsData } from "../../assets/assets";
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5";

const Footer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const songData = useSelector((state: RootState) => state.add.selectSong);
  const currentSongIndex = useSelector(
    (state: RootState) => state.add.currentSongIndex
  );

  const dispatch = useDispatch();

  // Toggle Play/Pause
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing the song:", error);
        });
      }
      setIsPlaying((prev) => !prev);
    }
  }, [isPlaying]);

  // Handle progress change (seeking through the track)
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

  // Handle volume change (slider)
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

  // Toggle mute/unmute
  const handleVolumeToggle = useCallback(() => {
    if (isMuted) {
      setVolume(50);
    } else {
      setVolume(0);
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  // On song change (e.g., selecting a song from the playlist)
  useEffect(() => {
    if (songData && audioRef.current) {
      audioRef.current.src = songData.file;
      dispatch(SavedSongData(songData)); // Save the selected song in Redux

      setIsPlaying(false);
    }
  }, [songData, dispatch]);

  // Load previously saved song
  useEffect(() => {
    const storedSongData = localStorage.getItem("currentSong");
    if (storedSongData) {
      const parsedSongData: SongDAta = JSON.parse(storedSongData);
      dispatch(SavedSongData(parsedSongData));
      setIsPlaying(false);
    }
  }, [dispatch]);

  // Update volume on change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Play previous song
  const PlayPrevious = useCallback(() => {
    if (currentSongIndex > 0) {
      // Go to previous song
      const prevSong = songsData[currentSongIndex - 1];
      dispatch(SkipPrevious(prevSong)); // Update the skip to previous song
      dispatch(setCurrentSongIndex(currentSongIndex - 1)); // Update the song index to previous
      dispatch(SavedSongData(prevSong)); // Ensure the song data is saved in Redux
    } else {
      // If it's the first song, loop back to the last song
      const lastSong = songsData[songsData.length - 1];
      dispatch(SkipPrevious(lastSong)); // Set the last song as previous
      dispatch(setCurrentSongIndex(songsData.length - 0)); // Update the index to the last song
    }
  }, [currentSongIndex, dispatch, songsData]); // Add dependencies for memoization

  // Play next song (forward)
  const PlayForward = useCallback(() => {
    if (currentSongIndex < songsData.length - 1) {
      // Go to next song
      const nextSong = songsData[currentSongIndex + 1];
      dispatch(SkipPrevious(nextSong)); // Dispatch to update next song state
      dispatch(setCurrentSongIndex(currentSongIndex + 1)); // Update the song index
      dispatch(SavedSongData(nextSong)); // Ensure the song data is saved in Redux
    } else {
      // If it's the last song, loop back to the first song
      const firstSong = songsData[0];
      dispatch(SkipPrevious(firstSong)); // Dispatch to update next song state
      dispatch(setCurrentSongIndex(0)); // Update the song index to the first song
      dispatch(SavedSongData(firstSong)); // Ensure the song data is saved in Redux
    }
  }, [currentSongIndex, dispatch, songsData]); // Add dependencies for memoization

  // If no song is selected, render nothing
  if (!songData || songsData.length === 0) {
    return null;
  }

  const sliderBackground = `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #b3b3b3 ${volume}%, #b3b3b3 100%)`;

  return (
    <>
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
      <footer className="rightSection fixed bottom-0 left-0 right-0 bg-black-300 from-gray-900 to-black border-t border-gray-800 h-24 ">
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
                <span className="text-gray-400 text-xs hover:text-white cursor-pointer hidden md:flex">
                  {songData?.duration}
                </span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex flex-col justify-center items-center space-y-2  w-[220px] md:w-full">
              <div className="flex md:items-center justify-end  md:justify-center space-x-4 text-white">
                <div className="flex">
                  <button onClick={PlayPrevious}>
                    <IoPlaySkipBackSharp className="h-6 w-6 " />
                  </button>
                </div>
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
                <div className="flex">
                  <button onClick={PlayForward}>
                    <IoPlaySkipForwardSharp className="h-6 w-6" />
                  </button>
                </div>
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
            <div className=" md:flex justify-end items-center space-x-3 hidden">
              <button
                onClick={handleVolumeToggle} // Toggle mute/unmute
                className="text-gray-400 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" /> // Mute icon
                ) : (
                  <Volume2 className="w-6 h-6" /> // Unmute icon
                )}
              </button>
              <div className="sound w-24 items-center ">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{ background: sliderBackground }} // Apply dynamic background
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
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
