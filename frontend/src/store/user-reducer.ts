import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: undefined,
  name: undefined,
  email: undefined,
  role: "anonymous",
  location: undefined,
  skills: [],
  company: "",
  avatar: undefined,
  resume: undefined,
  created_at: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
