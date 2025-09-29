import { getAuthToken, tokenLoader } from "@/util/auth";
import { redirect, useLoaderData, type ActionFunction } from "react-router-dom";
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
  // Redirect if not employer
  const token = tokenLoader();
  if (token.role !== "employer") {
    return redirect("/jobs");
  }

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const application_id = formData.get("application_id");

  const payload = {
    status: formData.get("status"),
    note_from_employer: formData.get("note_from_employer"),
  };

  if (!(payload.status && payload.note_from_employer && application_id)) {
    console.log(application_id);
    return toast.error("Please fill all fields");
  }

  const { VITE_API_BASE_URL } = import.meta.env;
  const response = await fetch(
    `${VITE_API_BASE_URL}/users/applications/${application_id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAuthToken(),
      },
      body: JSON.stringify(payload),
    }
  );

  const { success, message, data } = await response.json();

  if (!success) {
    console.error(message);
    return toast.error(message);
  }

  return data;
};

export default ApplicantsPage;
