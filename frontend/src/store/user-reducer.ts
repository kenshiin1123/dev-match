import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: "",
  name: "",
  email: "",
  role: "",
  location: "",
  skills: "",
  company: "",
  avatar: {
    buffer: "",
    mimetype: "",
  },
  resume: {
    buffer: "",
    mimetype: "",
  },
  created_at: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export default userSlice.reducer;
