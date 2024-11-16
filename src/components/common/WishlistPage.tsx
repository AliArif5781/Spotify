// WishlistPage.tsx
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Trash2 } from "lucide-react";
import { SongDAta } from "../../types/type";
import { removeFromFavourite } from "../../features/Song/AddSongSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const favoriteSongs = useSelector(
    (state: RootState) => state.add.favouritesong
  );

  const handleRemoveFromFavorite = (track: SongDAta) => {
    dispatch(removeFromFavourite(track));
  };

  return (
    <div className="p-6 h-dvh bg-black-100 overflow-y-auto pb-[100px]">
      <h1 className="text-3xl text-white font-bold mb-6">Favorite Songs</h1>

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
              <th scope="col" className="px-6 py-3 md:flex hidden">
                Song
              </th>
              <th scope="col" className="px-6 py-3">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {favoriteSongs.length > 0 ? (
              favoriteSongs.map((track, index) => (
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
                      <div className="px-5 cursor-pointer">
                        <p className="text-md text-white font-bold">
                          {track.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap md:flex hidden">
                    {track.name}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRemoveFromFavorite(track)}
                      className="flex justify-center items-center hover:bg-red-600 px-[30px] border border-red-300 rounded-lg hover:border-none py-4"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-white">
                  No favorite songs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishlistPage;
