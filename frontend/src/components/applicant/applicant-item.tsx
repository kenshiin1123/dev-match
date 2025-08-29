import type { ApplicantType } from "@/pages/applicants";
import { EmployerResponseDialog } from "./employer-response-dialog";
import { useSubmit } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import LabelWithParagraphItem from "../label-with-paragraph-item";
import { Button } from "../ui/button";
import { motion } from "motion/react";

export type EmployerResponseType = {
  status: string;
  note_from_employer: string;
};

const ApplicantItem: React.FC<{ applicant: ApplicantType }> = ({
  applicant,
}) => {
  const initialValue: EmployerResponseType = {
    status: applicant.status || "shortlisted",
    note_from_employer: applicant.note_from_employer || "",
  };

  const [employerResponse, setEmployerResponse] =
    useState<EmployerResponseType>(initialValue);

  const [expanded, setExpanded] = useState(false);

  const submit = useSubmit();
  const avatarUrl =
    applicant.avatar && applicant.avatar_content_type
      ? `data:${applicant.avatar_content_type};base64,${applicant.avatar}`
      : "images/default_pic.png";

  const handleResponseSubmit = () => {
    const { status, note_from_employer }: EmployerResponseType =
      employerResponse;
    const application_id = applicant.application_id;

    if (
      !note_from_employer ||
      !status ||
      !application_id ||
      status.length < 1 ||
      note_from_employer.length < 1
    ) {
      return toast.error("Please fill all fields");
    }

    const formData = new FormData();
    formData.append("status", status);
    formData.append("note_from_employer", note_from_employer);
    formData.append("application_id", application_id);
    submit(formData, { method: "PATCH" });
    setEmployerResponse(initialValue);
  };

  return (
    <motion.li
      key={applicant.applicant_id}
      className="ml-2 px-3 py-3 border rounded bg-card w-full flex gap-5 flex-col"
    >
      <div className="w-full flex flex-row-reverse">
        <img
          src={avatarUrl}
          alt="user_profile"
          className={`${
            expanded ? "size-30" : "size-15"
          } mb-auto aspect-square border ml-auto`}
        />
        <div>
          <p className="text-xl font-semibold">{applicant.name}</p>
          <p>{applicant.email}</p>
          <Button
            className="w-40 font-bold mt-3"
            variant={"secondary"}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Shrink" : "Expand"} Contents
          </Button>
          {expanded && (
            <>
              <LabelWithParagraphItem
                label="Developer's Message"
                paragraph={applicant.message}
                className="flex-col divide-x-0 divide-y [&>*]:py-2 [&>*]:px-1"
              />
              <LabelWithParagraphItem
                label="Status"
                paragraph={applicant.status}
              />
              {applicant.status !== "applied" && (
                <LabelWithParagraphItem
                  label="Your message"
                  paragraph={applicant.note_from_employer}
                />
              )}
            </>
          )}
        </div>
      </div>
      {/* Respond Button */}
      <div className="flex justify-end">
        {applicant.status === "applied" ? (
          <EmployerResponseDialog
            employerResponse={employerResponse}
            setEmployerResponse={setEmployerResponse}
            handleResponseSubmit={handleResponseSubmit}
          >
            Respond
          </EmployerResponseDialog>
        ) : (
          <EmployerResponseDialog
            employerResponse={employerResponse}
            setEmployerResponse={setEmployerResponse}
            disabled
          >
            Responded Already
          </EmployerResponseDialog>
        )}
      </div>
    </motion.li>
  );
};

export default ApplicantItem;
