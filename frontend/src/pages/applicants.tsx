import { getAuthToken } from "@/util/auth";
import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import JobWithApplicants from "@/components/applicant/job-with-applicants";

export type ApplicantType = {
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

export type JobType = {
  title: string;
  jobpost_id: string;
  applicants: ApplicantType[];
};

const ApplicantsPage = () => {
  const jobsWithApplicants: JobType[] = useLoaderData();

  return (
    <div className="p-3">
      <ul className="flex flex-col gap-10">
        {jobsWithApplicants.map((job) => {
          return <JobWithApplicants job={job} key={job.jobpost_id} />;
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

  return data;
};

export default ApplicantsPage;
