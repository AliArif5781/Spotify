import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { SongDAta } from "../../types/type"; // Import SongDAta
import img from "/Spotify_Primary_Logo.png";

const FavouriteSong = () => {
  // Access the favouritesong array from Redux store
  const favouriteSongs = useSelector(
    (state: RootState) => state.add.favouritesong
  ) as SongDAta[];

  if (favouriteSongs.length === 0) {
    return <div className="text-white">No favourite songs yet.</div>;
  }

  return (
    <div className="rightSection h-[100vh] overflow-y-auto pb-[100px] p-6 transition-all bg-black-100">
      <div className="px-5 sm:py-9 grid grid-cols-1 sm:grid-cols-1">
        <div className="flex justify-center items-center py-8">
          <div className="container max-w-screen-lg px-6 mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
              <div className="flex justify-center lg:justify-start lg:mr-8 lg:w-1/3">
                <img
                  src={img}
                  alt="Spotify Logo"
                  className="max-w-full h-auto object-contain w-64 md:w-48 lg:w-64"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-center items-center lg:items-start px-6 md:px-10 space-y-4 lg:w-2/3 text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white lg:text-left text-center">
                  Favourite Songs
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List of favourite songs */}
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
            {favouriteSongs.length > 0 ? (
              favouriteSongs.map((track, index) => (
                <tr
                  key={track.id}
                  className="hover:bg-gray-600 hover:rounded-lg"
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
                      <div className="px-5">
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
                  No favourite songs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FavouriteSong;
