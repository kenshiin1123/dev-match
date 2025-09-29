import getCloudinaryImage from "@/util/getCloudinaryImage";
import { motion, type Variants } from "motion/react";
import { Link } from "react-router-dom";

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
  avatar?: string;
};

const JobItem: React.FC<{ jobpost: JobpostType }> = ({ jobpost }) => {
  const elementVariant: Variants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -30 },
  };

  return (
    <motion.li variants={elementVariant} whileHover={{ scale: 1.01 }}>
      <Link
        to={jobpost.jobpost_id}
        className="border min-h-35 p-2 flex gap-4 h-20 bg-card"
      >
        <img
          src={
            jobpost.avatar
              ? getCloudinaryImage(jobpost.avatar, { w: 200, h: 200 })
              : "images/default_pic.png"
          }
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
      </Link>
    </motion.li>
  );
};

export default JobItem;
