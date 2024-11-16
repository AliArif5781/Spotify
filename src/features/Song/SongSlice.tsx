import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SongDAta } from "../../types/type";

interface SongState {
  currentSong: SongDAta | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
}

const initialState: SongState = {
  currentSong: null,
  isPlaying: false,
  volume: 50,
  progress: 0,
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<SongDAta>) => {
      state.currentSong = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
  },
});

export const { setCurrentSong, setIsPlaying, setVolume, setProgress } =
  songSlice.actions;
export default songSlice.reducer;
