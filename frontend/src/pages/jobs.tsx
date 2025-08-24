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
                className="border min-h-35 p-2 flex gap-4 h-20"
                whileHover={{ scale: 1.01 }}
              >
                <img
                  src="/images/default_pic.png"
                  alt=""
                  className="h-full aspect-square"
                />
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold">
                    {jobpost.title}{" "}
                    {jobpost.remote && (
                      <span className="text-lg opacity-88 ml-2">(Remote)</span>
                    )}
                  </h1>
                  <p>{jobpost.company}</p>
                  <p>{jobpost.location}</p>
                  <div className="mt-auto text-md font-bold">
                    <span title="Salary Min" className="cursor-help">
                      ${jobpost.salary_min}
                    </span>{" "}
                    -{" "}
                    <span title="Salary Max" className="cursor-help">
                      {jobpost.salary_max}
                    </span>
                  </div>
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
