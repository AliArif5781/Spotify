import { useParams } from "react-router-dom";
import { albumsData, songsData } from "../../assets/assets";
import { AlbimChart, SongDAta } from "../../types/type";
import img from "/Spotify_Primary_Logo.png";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaPlay } from "react-icons/fa6";
import { IoMdPause } from "react-icons/io";
import "../../style/sound.css";
import { VolumeX, Volume1, Volume2 } from "lucide-react";

const DisplayAlbumData = () => {
  const [currentSong, setCurrentSong] = useState<SongDAta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Progress in percentage (0-100)
  const [volume, setVolume] = useState(50); // volume in range 0-100
  const [currentTime, setCurrentTime] = useState("0:00"); // Current time of song
  const [totalTime, setTotalTime] = useState("0:00"); // Total duration of song

  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);
  const albumId = id ? parseInt(id) : NaN;

  const data = useMemo(() => {
    return albumsData.filter((item: AlbimChart) => item.id === albumId);
  }, [albumId, albumsData]);

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

  const handleSongTrack = useCallback((track: SongDAta) => {
    if (audioRef.current) {
      audioRef.current.src = track.file;
      audioRef.current.play();
      setCurrentSong(track);
      setIsPlaying(true);
    }
  }, []); // Empty dependency array means this function won't change after initial render

  const tooglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = parseFloat(e.target.value);
    if (isNaN(volumeValue)) return; // Ignore invalid values

    setVolume(volumeValue); // Store volume as a number in the range 0-100
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
        setCurrentTime(formatTime(currentTime));
        setTotalTime(formatTime(duration));
      }
    }
  };

  const sliderBackground = `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #b3b3b3 ${volume}%, #b3b3b3 100%)`;

  const handleMutetoggle = () => {
    const newVolume = volume === 0 ? 50 : 0;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100; // Update the volume of the audio element
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

  return (
    <div className="rightSection custom-scrollbar h-[100vh] overflow-y-auto w-full pb-[100px] p-6 transition-all bg-black-100">
      <div className="px-5 sm:py-9 grid grid-cols-1 sm:grid-cols-1">
        {data.map((item: AlbimChart) => (
          <div key={item.id} className="flex justify-center items-center py-8">
            <div className="container max-w-screen-lg px-6 mx-auto">
              {/* Album Info Section */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
                {/* Album Image */}
                <div className="flex justify-center lg:justify-start lg:mr-8 lg:w-1/3">
                  <img
                    src={item.image}
                    alt={`${item.name} cover`}
                    className="max-w-full h-auto object-contain w-64 md:w-48 lg:w-64"
                    loading="lazy"
                  />
                </div>

                {/* Album Text Info */}
                <div className="flex flex-col justify-center items-center lg:items-start px-6 md:px-10 space-y-4 lg:w-2/3 text-left">
                  <p className="text-sm uppercase text-gray-400 tracking-wider">
                    {item.type}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white lg:text-left text-center">
                    {item.name}
                  </h1>

                  {/* Spotify Logo and Info */}
                  <div className="flex items-center space-x-3">
                    <img src={img} alt="Spotify Logo" className="w-8 h-8" />
                    <p className="text-lg text-white font-medium">Spotify</p>
                  </div>

                  {/* Song Count and Duration */}
                  <div className="text-sm text-gray-300">
                    <p>
                      <strong>Number of Songs:</strong> {item.song}
                    </p>
                    <p>
                      <strong>Total Duration:</strong> {item.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Songs Table Section */}
      <div className="relative overflow-x-auto">
        <table className="min-w-full text-lg text-left text-gray-300">
          <thead>
            <tr className="text-md text-gray-500 uppercase">
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                Date Added
              </th>
              <th scope="col" className="px-6 py-3">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {songsData.length > 0 ? (
              songsData.map((track, index) => (
                <tr
                  key={track.id}
                  className="hover:bg-gray-600 hover:rounded-lg"
                  onClick={() => handleSongTrack(track)}
                >
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    <div className="flex">
                      <img
                        src={track.image}
                        className="h-[60px] w-max object-cover rounded-lg"
                        alt={track.name}
                      />
                      <div className="px-5 cursor-pointer">
                        <p className="text-md text-white font-bold">
                          {track.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {track.date}
                  </td>
                  <td className="px-6 py-4">{track.duration}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-white">
                  Loading songs...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
                    Artist Name
                  </span>
                </div>
              </div>

              {/* Center section - Player Controls */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={tooglePlayPause}
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
                  <span className="text-xs text-gray-400">{currentTime}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-400">{totalTime}</span>
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

      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}></audio>
    </div>
  );
};

export default DisplayAlbumData;
