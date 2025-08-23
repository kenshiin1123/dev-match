import { jobpostAction } from "@/store/jobpost-reducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";

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

  const listVariant: Variants = {
    visible: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.15), // Stagger children by .3 seconds
      },
    },
    hidden: { opacity: 0, transition: { when: "afterChildren" } },
  };
  const elementVariant: Variants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -30 },
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const { VITE_API_BASE_URL } = import.meta.env;
      const response = await fetch(VITE_API_BASE_URL + "/jobposts");
      const { message, success, data } = await response.json();

      if (!success) {
        console.log(message);
        return toast.error(message);
      }

      dispatch(jobpostAction.setJobposts(data));
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <motion.ul
        variants={listVariant}
        initial="hidden"
        animate="visible"
        className="flex flex-col p-5 gap-3 "
      >
        <AnimatePresence>
          {jobposts.map((jobpost: JobpostType) => {
            return (
              <motion.li
                variants={elementVariant}
                key={jobpost.jobpost_id}
                className="border min-h-30 p-2"
              >
                <div></div>
                <div>
                  <h1>{jobpost.title}</h1>
                  <p>{jobpost.description}</p>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};

export default JobsPage;
