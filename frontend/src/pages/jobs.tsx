import { jobpostAction } from "@/store/jobpost-reducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";
import JobItem from "@/components/job-item";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAuthToken } from "@/util/auth";

type JobpostType = {
  company: string;
  description: string;
  employment_type: string;
  jobpost_id: string;
  location: string;
  posted_by: string;
  remote: boolean;
  required_skills: string[];
  salary_max: number;
  salary_min: number;
  timestamp: number;
  title: string;
};

const JobsPage = () => {
  const dispatch = useDispatch();
  const jobposts = useSelector((state: any) => state.jobpost.jobposts);
  // const user_id = useSelector((state: any) => state.user.user_id);
  const role = useSelector((state: any) => state.user.role);
  const [jobFilter, setJobFilter] = useState("all");

  const listVariant: Variants = {
    visible: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.15), // Stagger children by .3 seconds
      },
    },
    hidden: { opacity: 0, transition: { when: "afterChildren" } },
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const { VITE_API_BASE_URL } = import.meta.env;

      let fetchInput = VITE_API_BASE_URL + "/jobposts";

      if (role === "employer" && jobFilter === "posted") {
        fetchInput = VITE_API_BASE_URL + "/users/jobs";
      }

      const response = await fetch(fetchInput, {
        headers: {
          Authorization: "Bearer " + getAuthToken(),
        },
      });

      const { message, success, data } = await response.json();

      if (!success) {
        console.log(message);
        return toast.error(message);
      }

      dispatch(jobpostAction.setJobposts(data));
    };

    fetchJobs();
  }, [jobFilter]);

  return (
    <div>
      <h1 className="text-2xl mt-5 ml-5 font-bold">Job Filter</h1>
      {/* Filter */}
      <RadioGroup
        defaultValue={jobFilter}
        onValueChange={(value) => setJobFilter(value)}
        className="ml-5 my-5"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">All available Jobs</Label>
        </div>
        {role === "employer" && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="posted" id="posted" />
            <Label htmlFor="posted">Posted Jobs</Label>
          </div>
        )}
      </RadioGroup>

      <motion.ul
        variants={listVariant}
        initial="hidden"
        animate="visible"
        className="flex flex-col p-5 gap-3 "
      >
        <AnimatePresence>
          {jobposts.map((jobpost: JobpostType) => (
            <JobItem jobpost={jobpost} key={jobpost.jobpost_id} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};

export default JobsPage;
