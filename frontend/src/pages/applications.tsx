import { getAuthToken } from "@/util/auth";
import { Link, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "motion/react";
import timeAgo from "@/util/timeAgo";

type ApplicationType = {
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
      <ul className="flex flex-col p-2">
        {applications.map((application: ApplicationType) => {
          return (
            <motion.li
              whileHover={{ scale: 0.98, boxShadow: "none" }}
              className="flex flex-col justify-center rounded-md border bg-card px-3 py-5 shadow"
              key={application.application_id}
            >
              <Link to={`/jobs/${application.jobpost_id}`}>
                <div className="text-sm opacity-80 bg-accent w-fit p-1.5 rounded border mb-3">
                  Applied {timeAgo(application.created_at)}
                </div>
                <h1 className="text-2xl font-bold">{application.job}</h1>
                <div className="flex flex-col [&>section>p]:border [&>section>p]:p-2 [&>section]:space-y-2 [&>section>p]:bg-accent [&>section>p]:rounded-md [&>section]:w-fit gap-3 mt-5">
                  <section>
                    <h2>Status</h2>
                    <p>{application.status}</p>
                  </section>
                  <section>
                    <h2>Your message</h2>
                    <p>{application.message}</p>
                  </section>
                  {application.note_from_employer && (
                    <section>
                      <h2>Note from employer</h2>
                      <p>{application.note_from_employer}</p>
                    </section>
                  )}
                </div>
              </Link>
            </motion.li>
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
