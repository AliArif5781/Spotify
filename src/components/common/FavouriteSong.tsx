import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { AlbimChart, SongDAta } from "../../types/type";
import img from "/Spotify_Primary_Logo.png";

const FavouriteSong = () => {
  const albumData = useSelector(
    (state: RootState) => state.add.addToFavourite
  ) as SongDAta;
  return (
    <div className="rightSection h-[100vh] overflow-y-auto pb-[100px] p-6 transition-all bg-black-100">
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
                  className="max-w-full h-auto object-contain w-64 md:w-48 lg:w-64"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-center items-center lg:items-start px-6 md:px-10 space-y-4 lg:w-2/3 text-left">
                <p className="text-sm uppercase text-gray-400 tracking-wider mt-2 sm:pt-0">
                  {/* {albumData.type} */}
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
                    {/* <strong>Number of Songs:</strong> {albumData.song} */}
                  </p>
                  <p>
                    <strong>Total Duration:</strong> {albumData.duration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavouriteSong;
