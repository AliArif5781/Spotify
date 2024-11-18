import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import PlayListSection from "../components/common/PlayListSection";
import AlbumSongData from "../components/common/AlbumSongData";
import WishlistPage from "../components/common/WishlistPage";

const router = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <PlayListSection />,
      },
      {
        path: "albumSong",
        // element: <DisplayAlbumData />,
        element: <AlbumSongData />,
      },
      {
        path: "wishlistpage",
        element: <WishlistPage />,
      },
    ],
  },
]);

export default router;
