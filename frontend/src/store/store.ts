import { configureStore } from "@reduxjs/toolkit";

// Reducers
import userReducer from "./user-reducer";

const store = configureStore({
  reducer: { user: userReducer },
});

export default store;
