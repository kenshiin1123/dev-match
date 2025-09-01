import { useState } from "react";
import LabelWithParagraphItem from "./label-with-paragraph-item";
import { Button } from "./ui/button";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";
import { Expand, Shrink } from "lucide-react";
import type { ApplicationType } from "@/pages/applications";
import timeAgo from "@/util/timeAgo";
import { Link } from "react-router-dom";

export type EmployerResponseType = {
  status: string;
  note_from_employer: string;
};

const ApplicationItem: React.FC<{ application: ApplicationType }> = ({
  application,
}) => {
  const [expanded, setExpanded] = useState(false);

  const unorderedListVariant: Variants = {
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        delayChildren: stagger(0.2),
        duration: 0.55,
        ease: "easeOut",
      },
    },
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
        delayChildren: stagger(0.15),
      },
    },
  };

  return (
    <motion.li
      key={application.application_id}
      className="px-3 py-3 border rounded bg-card w-full flex gap-5 flex-col"
    >
      <section>
        <h1 className="text-lg font-semibold">
          <Link to={`/jobs/${application.jobpost_id}`}>{application.job}</Link>
        </h1>
        <h1 className="text-md">Applied {timeAgo(application.created_at)}</h1>
        <LabelWithParagraphItem
          label="Status"
          paragraph={application.status}
          isItemTag={false}
        />
      </section>
      <section className="w-full flex">
        <motion.div>
          <Button
            className="w-40 font-bold"
            variant={"secondary"}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Shrink" : "Expand"} Contents{" "}
            {expanded ? <Shrink /> : <Expand />}
          </Button>
          <motion.ul
            variants={unorderedListVariant}
            initial="hidden"
            className="overflow-hidden"
            animate={expanded ? "visible" : "hidden"}
          >
            <AnimatePresence>
              {expanded && (
                <>
                  <LabelWithParagraphItem
                    label="Your Message"
                    paragraph={application.message}
                    className="flex-col divide-x-0 divide-y [&>*]:py-2 [&>*]:px-1"
                  />

                  {application.status !== "applied" && (
                    <LabelWithParagraphItem
                      label="Employer's message"
                      paragraph={application.note_from_employer}
                    />
                  )}
                </>
              )}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      </section>
    </motion.li>
  );
};

export default ApplicationItem;
