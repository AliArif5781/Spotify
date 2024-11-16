import { configureStore } from "@reduxjs/toolkit";
import songReducer from "../features/Song/SongSlice";
import AddReducer from "../features/Song/AddSongSlice";
const store = configureStore({
  reducer: {
    song: songReducer,
    add: AddReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
