import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Error from "../components/common/Error";
import PlayListSection from "../components/common/PlayListSection";
import DisplayAlbumData from "../components/common/DisplayAlbumData";

const router = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <PlayListSection />,
      },
      {
        path: "album/:id",
        element: <DisplayAlbumData />,
      },
    ],
  },
]);

export default router;
