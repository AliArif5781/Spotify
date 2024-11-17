import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AlbimChart, SongDAta } from "../../types/type";
import {
  addFavouriteSong,
  setAddSong,
  songData,
} from "../../features/Song/AddSongSlice"; // Import your action
import { songsData } from "../../assets/assets";
import img from "/Spotify_Primary_Logo.png";
import "../../style/scroller.css";
import { Heart, Play, Pause } from "lucide-react";
import { IoMdHeart } from "react-icons/io";

const AlbumSongData = () => {
  const dispatch = useDispatch();

  const albumData = useSelector(
    (state: RootState) => state.add.addSong
  ) as AlbimChart;

  const favouritesong = useSelector(
    (state: RootState) => state.add.favouritesong
  ); // This is an array of songs in the favorites list
  const currentSong = useSelector(
    (state: RootState) => state.add.selectSong
  ) as SongDAta | null;

  useEffect(() => {
    const storedAlbumData = localStorage.getItem("PlayListData");

    if (storedAlbumData) {
      const parsedAlbumData: AlbimChart = JSON.parse(storedAlbumData);
      dispatch(setAddSong(parsedAlbumData));
    }
  }, [dispatch]);

  if (!albumData) {
    return <div>No album selected</div>;
  }

  const handleSongTrack = (track: SongDAta) => {
    dispatch(songData(track)); // Set selected song in Redux
  };

  const handleAddToFavorite = (track: SongDAta) => {
    dispatch(addFavouriteSong(track)); // Add to favorites
  };

  // Function to check if a song is in the favourites list
  // This function uses the .some() method to check if any song in the favouritesong array matches the track.id.
  const isFavourite = (trackId: any) => {
    return favouritesong.some((song) => song.id === trackId);
  };

  return (
    <div className="rightSection h-[100%] w-[900px] max-w-[1200px] m-auto  pb-[100px] p-6 transition-all bg-black-100">
      <div className="px-5 sm:py-9 grid grid-cols-1 sm:grid-cols-1">
        <div
          key={albumData.id}
          className="flex justify-center items-center py-8"
        >
          <div className="container max-w-screen-lg px-6 mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
              <div className="flex justify-center lg:justify-start lg:mr-8 lg:w-1/3">
                <img
                  src={albumData.image}
                  alt={`${albumData.name} cover`}
                  className=" h-auto object-contain w-64 md:w-48 lg:w-64"
                  loading="lazy"
                  // max-w-full
                />
              </div>

              <div className="flex flex-col justify-center items-center lg:items-start px-6 md:px-10 space-y-4 lg:w-2/3 text-left">
                <p className="text-sm uppercase text-gray-400 tracking-wider mt-2 sm:pt-0">
                  {albumData.type}
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white lg:text-left text-center">
                  {albumData.name}
                </h1>
                <div className="flex items-center space-x-3">
                  <img src={img} alt="Spotify Logo" className="w-8 h-8" />
                  <p className="text-lg text-white font-medium">Spotify</p>
                </div>

                <div className="text-sm text-gray-300">
                  <p>
                    <strong>Number of Songs:</strong> {albumData.song}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs Table Section */}
      <div className="relative ">
        {" "}
        {/* overflow-x-auto*/}
        <table className=" w-[900px] max-w-[1200px] m-auto text-lg text-left text-gray-300">
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
              <th scope="col" className=" py-3">
                Duration
              </th>
              <th scope="col" className="">
                Favourite
              </th>
              <th scope="col" className="">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {songsData.length > 0 ? (
              songsData.map((track, index) => (
                <tr
                  key={track.id}
                  className={`hover:bg-gray-600 hover:rounded-lg ${
                    currentSong?.id === track.id ? "bg-gray-700" : ""
                  }`} // Highlight current song
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAddToFavorite(track)} // Add to favorite
                      className="rounded-lg text-white-50 transition-all duration-300"
                    >
                      {isFavourite(track.id) ? (
                        <IoMdHeart className="h-8 w-7" />
                      ) : (
                        <Heart />
                      )}
                    </button>
                  </td>
                  <td scope="col" className="pl-5">
                    {currentSong?.id === track.id ? <Pause /> : <Play />}
                  </td>
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
    </div>
  );
};

export default AlbumSongData;
