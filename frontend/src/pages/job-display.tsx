import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/util/auth";
import { useSelector } from "react-redux";
import {
  useLoaderData,
  type ActionFunction,
  type LoaderFunction,
} from "react-router-dom";

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

function timeAgo(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}

const JobDisplayPage: React.FC = () => {
  const {
    success,
    message,
    data,
  }: { success: boolean; message: string; data: JobpostType } = useLoaderData();

  const user_id = useSelector((state: any) => state.user.user_id);

  if (!success) {
    return (
      <div className="p-5 ">
        <div className="bg-card rounded w-fit h-fit p-5">
          <h1 className="font-extrabold text-4xl mb-5">
            Failed to find the resource you&apos;re looking for
          </h1>
          <h2 className="text-xl font-bold inline">Error Message: </h2>
          <p className="text-red-500 text-xl font-bold inline ml-1">
            {message}.
          </p>
        </div>
      </div>
    );
  }

  const handleJobApply = () => {
    // TODO: Before posting, allow developers to give a message to the employer when clicking "Apply Now" Button.
    // Then Submit the data
    // submit(null, { method: "POST" });
  };

  return (
    <div className="p-5 pb-20">
      <div className="bg-card rounded w-full min-h-[85vh] p-5 py-10">
        <p className="font-extrabold mb-3 px-3 py-2 border w-fit rounded bg-accent">
          Posted {timeAgo(data.timestamp.toString())}
        </p>
        <h1 className="font-extrabold text-4xl mb-5">{data.title}</h1>
        <h2 className="text-lg">{data.company}</h2>
        {data.remote && <h2 className="text-lg">Remote</h2>}
        <h2 className="text-lg">
          {data.employment_type.charAt(0).toUpperCase() +
            data.employment_type.slice(1)}
        </h2>
        <h2 className="text-xl mt-5">
          ${data.salary_min} - ${data.salary_max}
        </h2>
        {user_id !== data.posted_by && (
          <div>
            <Button className="mt-5 font-bold" onClick={handleJobApply}>
              Apply Now
            </Button>
            <Button className="mt-5 font-bold ml-3">Message</Button>
          </div>
        )}
        <div className="border mt-5" />
        <h2 className="text-xl mt-5 font-bold">Required Skills</h2>
        <ul className="flex gap-3 mt-3 flex-wrap">
          {data.required_skills.map((skill) => {
            return (
              <li
                className="border w-fit rounded-md px-3 py-2 bg-accent"
                key={skill}
              >
                {skill}
              </li>
            );
          })}
        </ul>
        <div className="border mt-5" />
        <h2 className="text-xl mt-5 font-bold">Job Description</h2>
        <p className="text-lg mt-3 p-2">{data.description}</p>
        <div className="border mt-5" />
        <h2 className="text-xl mt-5 font-bold">
          Company Location:
          <span className="font-medium ml-3">{data.location}</span>
        </h2>
      </div>
    </div>
  );
};

export const loader: LoaderFunction = async ({ params }) => {
  const { VITE_API_BASE_URL } = import.meta.env;
  const { jobpost_id } = params;
  const response = await fetch(VITE_API_BASE_URL + "/jobposts/" + jobpost_id);
  const data = await response.json();
  return data;
};

export const action: ActionFunction = async ({ params }) => {
  const { VITE_API_BASE_URL } = import.meta.env;
  const { jobpost_id } = params;
  const response = await fetch(
    VITE_API_BASE_URL + "/jobposts/" + jobpost_id + "/apply",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAuthToken(),
      },
      body: JSON.stringify({ message: "Hello World" }),
    }
  );
  const data = await response.json();
  return data;
};

export default JobDisplayPage;
