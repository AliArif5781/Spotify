import { useNavigate } from "react-router-dom";
import { albumsData } from "../../assets/assets";
import { AlbimChart } from "../../types/type";
import { memo } from "react";
import { useDispatch } from "react-redux";
import { setAddSong } from "../../features/Song/AddSongSlice";
// import { RootState } from "../../app/store";

const PlayListData = memo(() => {
  const dispatch = useDispatch();
  // const abc = useSelector((state: RootState) => state.add.addSong);
  // console.log("abc", abc);

  const navigate = useNavigate();

  const AlbumDatas = (song: AlbimChart) => {
    dispatch(setAddSong(song));
    // localStorage.setItem("PlayListData", JSON.stringify(song));
    navigate("/albumSong");
  };

  return (
    <div className="rightSection custom_scrollbar h-dvh w-dvw overflow-auto bg-black-200 pb-[100px] p-6 flex justify-center items-start">
      <div className="w-full max-w-7xl ">
        <h1 className="text-4xl font-extrabold text-white px-11  my-8">
          Featured Chart
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albumsData.length === 0 ? (
            <div className="text-center text-white text-xl">
              No albums available.
            </div>
          ) : (
            albumsData.map((albumData: AlbimChart) => (
              <div
                key={albumData.id}
                className="group cursor-pointer  rounded-lg overflow-hidden  transition-all"
                onClick={() => AlbumDatas(albumData)}
              >
                <div className="relative">
                  <img
                    src={albumData.image}
                    alt={albumData.name}
                    className="w-full h-[200px] object-contain group-hover:opacity-80 transition-opacity duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {albumData.name}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">
                    {albumData.desc}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export default PlayListData;
