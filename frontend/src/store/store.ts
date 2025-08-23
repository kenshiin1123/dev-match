import { configureStore } from "@reduxjs/toolkit";

// Reducers
import userReducer from "./user-reducer";
import uiReducer from "./ui-reducer";
import jobpostReducer from "./jobpost-reducer";

const store = configureStore({
  reducer: { user: userReducer, ui: uiReducer, jobpost: jobpostReducer },
});

export default store;
