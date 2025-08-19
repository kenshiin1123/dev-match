import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarItems: [],
  },
  reducers: {
    setSidebarItems(state, action) {
      const items = action.payload;
      state.sidebarItems = items;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
