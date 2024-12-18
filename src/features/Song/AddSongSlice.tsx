import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlbimChart, SongDAta } from "../../types/type";

interface SongData {
  addSong: AlbimChart | SongData | null;
  selectSong: SongDAta | null;
  SavedSong: SongDAta | null;
  favouritesong: SongDAta[];
  skipToPrevious: SongDAta | null;
  currentSongIndex: number;
}
const savedFavouriteSong = localStorage.getItem("favouriteSong");
const initialState: SongData = {
  addSong: null,
  selectSong: null,
  SavedSong: null,
  favouritesong: savedFavouriteSong ? JSON.parse(savedFavouriteSong) : [],
  skipToPrevious: null,
  currentSongIndex: 0,
};

export const AddSong = createSlice({
  name: "song",
  initialState,
  reducers: {
    setAddSong: (state, action: PayloadAction<AlbimChart | null>) => {
      state.addSong = action.payload;
      state.selectSong = null; ///
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

    SkipPrevious: (state, action: PayloadAction<SongDAta | null>) => {
      // state.skipToPrevious = action.payload;
      if (action.payload) {
        state.skipToPrevious = action.payload;
      } else {
        state.skipToPrevious = null;
      }
    },
    setCurrentSongIndex: (state, action: PayloadAction<number>) => {
      state.currentSongIndex = action.payload;
    },
  },
});
export const {
  setAddSong,
  songData,
  SavedSongData,
  addFavouriteSong,
  removeFromFavourite,
  SkipPrevious,
  setCurrentSongIndex,
  // setCurrentSong,
  // setPlaying,
} = AddSong.actions;
export default AddSong.reducer;
