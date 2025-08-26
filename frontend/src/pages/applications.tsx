import { Button } from "@/components/ui/button";
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

  const handleCancelApplication = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    console.log("Canceled Application");
  };

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
              whileHover={{ scale: 0.98 }}
              className="flex flex-col justify-center rounded-md border bg-accent px-3 py-5"
              key={application.application_id}
            >
              <Link to={`/jobs/${application.jobpost_id}`}>
                <div className="text-sm mb-1 opacity-80">
                  Applied {timeAgo(application.created_at)}
                </div>
                <h1 className="text-xl font-bold">{application.job}</h1>
                <section className="mt-4">
                  <p>
                    <span className="font-semibold">Your message:</span>{" "}
                    {application.message}
                  </p>
                  {application.note_from_employer && (
                    <p>
                      <b>Employer&apos;s message:</b>{" "}
                      {application.note_from_employer}
                    </p>
                  )}
                </section>
                <section>
                  <p>
                    <b>Status:</b> {application.status}
                  </p>
                </section>
              </Link>
              <Button
                onClick={handleCancelApplication}
                size={"sm"}
                variant={"destructive"}
                className="ml-auto"
              >
                Cancel Application
              </Button>
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
