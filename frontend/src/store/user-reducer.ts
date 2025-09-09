import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
  user_id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  role: string;
  location: string | undefined;
  skills: string[];
  company: string | undefined;
  avatar: {
    buffer: any;
    mimetype: string | undefined;
  };
  resume: {
    buffer: any;
    mimetype: string | undefined;
  };
  created_at: string | undefined;
};

const initialState = {
  user_id: undefined,
  name: undefined,
  email: undefined,
  role: "anonymous",
  location: undefined,
  skills: [],
  company: undefined,
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
