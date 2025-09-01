import { getAuthToken } from "@/util/auth";
import { useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import ApplicationItem from "@/components/application-item";

export type ApplicationType = {
  application_id: string;
  applicant_id: string;
  jobpost_id: string;
  message: string;
  status: string;
  note_from_employer: string;
  created_at: string;
  job: string;
};

const ApplicationsPage = () => {
  const applications = useLoaderData();
  return (
    <div className="p-4">
      {applications.length < 1 && (
        <h1 className="text-xl font-bold">
          You have not applied to any jobs yet.
        </h1>
      )}
      <ul className="flex flex-col gap-3">
        {applications.map((application: ApplicationType) => {
          return (
            <ApplicationItem
              application={application}
              key={application.application_id}
            />
          );
        })}
      </ul>
    </div>
  );
};

export const loader = async () => {
  const { VITE_API_BASE_URL } = import.meta.env;

  const response = await fetch(`${VITE_API_BASE_URL}/users/applications`, {
    headers: {
      Authorization: "Bearer " + getAuthToken(),
    },
  });

  const { success, message, data } = await response.json();
  if (!success) {
    return toast.error(message);
  }

  return data;
};

export default ApplicationsPage;
