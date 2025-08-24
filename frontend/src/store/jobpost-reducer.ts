import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobposts: [],
};

type JobpostType = {
  company: string;
  description: string;
  employment_type: string;
  jobpost_id: string;
  location: string;
  posted_by: string;
  remote: boolean;
  required_skills: string[];
  salary_max: string;
  salary_min: string;
  timestamp: string;
  title: string;
};

const jobpostSlice = createSlice({
  name: "jobposts",
  initialState,
  reducers: {
    setJobposts(state, action) {
      const jobposts = action.payload;
      const parsedJobpost = jobposts.map((jobpost: JobpostType) => {
        0;
        const salary_min = parseInt(jobpost.salary_min);
        const salary_max = parseInt(jobpost.salary_max);
        const timestamp = Date.parse(jobpost.timestamp);
        return { ...jobpost, salary_min, salary_max, timestamp };
      });
      state.jobposts = parsedJobpost;
    },
  },
});

export const jobpostAction = jobpostSlice.actions;
export default jobpostSlice.reducer;
