import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlbimChart, SongDAta } from "../../types/type";
import { songsData } from "../../assets/assets";
interface SongData {
  addSong: AlbimChart | SongData | null;
  selectSong: SongDAta | null;
  SavedSong: SongDAta | null;
  favouritesong: SongDAta[];
}
const initialState: SongData = {
  addSong: null,
  selectSong: null,
  SavedSong: null,
  favouritesong: [],
};

export const AddSong = createSlice({
  name: "song",
  initialState,
  reducers: {
    setAddSong: (state, action: PayloadAction<AlbimChart | null>) => {
      state.addSong = action.payload;
      // localStorage.setItem("PlayListData", JSON.stringify(action.payload));
      if (action.payload) {
        localStorage.setItem("PlayListData", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("PlayListData"); // Clear if null
      }
    },

    songData: (state, action: PayloadAction<SongDAta | null>) => {
      state.selectSong = action.payload;
    },
    SavedSongData: (state, action: PayloadAction<SongDAta | null>) => {
      state.selectSong = action.payload;
      if (action.payload) {
        localStorage.setItem("currentSong", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("currentSong");
      }
    },
    addFavouriteSong: (state, action: PayloadAction<SongDAta>) => {
      const isAlreadyFavourite = state.favouritesong.some(
        (song) => song.id === action.payload.id
      );
      if (!isAlreadyFavourite) {
        state.favouritesong.push(action.payload);
        localStorage.setItem(
          "favouriteSong",
          JSON.stringify(state.favouritesong)
        );
      }
    },
    removeFromFavourite: (state, action: PayloadAction<SongDAta>) => {
      state.favouritesong = state.favouritesong.filter(
        (song) => song.id !== action.payload.id
      );
      localStorage.setItem(
        "favouriteSong",
        JSON.stringify(state.favouritesong)
      );
    },
  },
});
export const {
  setAddSong,
  songData,
  SavedSongData,
  addFavouriteSong,
  removeFromFavourite,
} = AddSong.actions;
export default AddSong.reducer;
