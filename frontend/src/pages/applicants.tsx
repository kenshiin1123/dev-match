import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/util/auth";
import { Link, redirect, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";

type ApplicantType = {
  applicant_id: string;
  application_id: string;
  jobpost_id: string;
  message: string;
  note_from_employer: string;
  status: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  avatar?: string;
  avatar_content_type?: string;
};

type JobType = {
  title: string;
  jobpost_id: string;
  applicants: ApplicantType[];
};

const ApplicantsPage = () => {
  const jobsWithApplicants: JobType[] = useLoaderData();
  const MotionLink = motion.create(Link);

  return (
    <div className="p-3">
      <ul className="flex flex-col gap-10">
        {jobsWithApplicants.map((job) => {
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
                      const avatarUrl =
                        applicant.avatar && applicant.avatar_content_type
                          ? `data:${applicant.avatar_content_type};base64,${applicant.avatar}`
                          : "images/default_pic.png";

                      return (
                        <li
                          key={applicant.applicant_id}
                          className="ml-2 px-3 py-3 border rounded bg-card w-full flex gap-5"
                        >
                          <img
                            src={avatarUrl}
                            alt="user_profile"
                            className="w-30 aspect-square border"
                          />
                          <div>
                            <p className="text-xl font-semibold">
                              {applicant.name}
                            </p>
                            <p>{applicant.email}</p>
                            {applicant.status === "applied" ? (
                              <Button className="mt-5 font-bold">
                                Respond
                              </Button>
                            ) : (
                              <Button className="mt-5 font-bold" disabled>
                                Responded Already
                              </Button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const loader = async () => {
  const { VITE_API_BASE_URL } = import.meta.env;

  const response = await fetch(`${VITE_API_BASE_URL}/jobposts/applicants`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const { message, success, data } = await response.json();

  if (!success) {
    toast.error(message);
    return redirect("/");
  }

  console.log(data);
  return data;
};

export default ApplicantsPage;
