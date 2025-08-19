import { configureStore } from "@reduxjs/toolkit";

// Reducers
import userReducer from "./user-reducer";
import uiReducer from "./ui-reducer";

const store = configureStore({
  reducer: { user: userReducer, ui: uiReducer },
});

export default store;
