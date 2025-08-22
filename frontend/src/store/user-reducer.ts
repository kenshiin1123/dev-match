import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: undefined,
  name: undefined,
  email: undefined,
  role: "anonymous",
  location: undefined,
  skills: [],
  company: "",
  avatar: {
    buffer: undefined,
    mimetype: undefined,
  },
  resume: {
    buffer: undefined,
    mimetype: undefined,
  },
  created_at: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(_, action) {
      const payload = action.payload;

      const data = {
        user_id: payload.user_id || undefined,
        name: payload.name || undefined,
        email: payload.email || undefined,
        role: payload.role || "anonymous",
        location: payload.location || undefined,
        skills: payload.skills || [],
        company: payload.company || undefined,
        avatar: {
          buffer: payload.avatar || undefined,
          mimetype: payload.avatar_content_type || undefined,
        },
        resume: {
          buffer: payload.resume || undefined,
          mimetype: payload.resume_content_type || undefined,
        },
        created_at: payload.created_at || undefined,
      };
      return data;
    },
    logOutUser() {
      return initialState;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
