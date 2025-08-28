import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { ApplicantType, JobType } from "@/pages/applicants";
import ApplicantItem from "./applicant-item";

const JobWithApplicants: React.FC<{ job: JobType }> = ({ job }) => {
  const MotionLink = motion.create(Link);

  return (
    <li key={job.jobpost_id}>
      <MotionLink
        to={"/jobs/" + job.jobpost_id}
        className="border p-3 flex justify-between items-center bg-card rounded "
        whileHover={{ scale: 0.99 }}
      >
        <h1 className="text-2xl font-bold">{job.title}</h1>
        {job.applicants.length > 0 && (
          <p>
            Applicant{job.applicants.length > 1 ? "s" : ""}:{" "}
            {job.applicants.length}
          </p>
        )}
      </MotionLink>
      {/* Applicants */}
      {job.applicants.length > 0 && (
        <>
          <h1 className="indent-2 opacity-80 my-4">Applicants</h1>
          <ul className="mt-3 flex">
            {job.applicants.map((applicant: ApplicantType) => {
              return (
                <ApplicantItem
                  applicant={applicant}
                  key={applicant.applicant_id}
                />
              );
            })}
          </ul>
        </>
      )}
    </li>
  );
};

export default JobWithApplicants;
