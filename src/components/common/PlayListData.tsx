import { useNavigate } from "react-router-dom";
import { albumsData } from "../../assets/assets";
import { AlbimChart } from "../../types/type";
import SongSection from "./SongSection"; // Import SongSection component
import { memo } from "react";

const PlayListData = memo(() => {
  const navigate = useNavigate();

  const AlbumNavigate = (id: Number) => {
    navigate(`/album/${id}`);
  };

  return (
    <div className="rightSection custom_scrollbar h-[100vh] overflow-auto max-w-max pb-[100px] mx-4 rounded-xl p-6 transition-all bg-black-200 flex justify-center">
      <div className="w-full">
        {/* Heading for Albums Section */}
        <h1 className="text-3xl font-bold text-white mb-6 p-3">
          Featured Chart
        </h1>

        {/* Responsive grid for Albums */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 cursor-pointer">
          {albumsData.map((albumData: AlbimChart) => (
            <div
              key={albumData.id}
              className="album-card mb-6 group relative hover:shadow-2xl rounded-lg overflow-hidden"
              onClick={() => AlbumNavigate(albumData.id)}
            >
              {/* Album Image with Hover Effect */}
              <img
                src={albumData.image}
                alt={albumData.name}
                className="h-[200px] w-full object-contain group-hover:opacity-80 transition-all duration-300 rounded-xl"
                loading="lazy"
              />

              {/* Overlay Effect (Optional) */}
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-40 transition-all duration-300 rounded-lg"></div>

              {/* Text Content */}
              <div className="text-content mt-2 p-2">
                <h3 className="text-white font-bold group-hover:text-gray-300 transition-all duration-300">
                  {albumData.name}
                </h3>
                <p className="text-white text-sm group-hover:text-gray-400 transition-all duration-300">
                  {albumData.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Include the SongSection component */}
        <SongSection />
      </div>
    </div>
  );
});

export default PlayListData;
