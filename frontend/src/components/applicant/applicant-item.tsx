import type { ApplicantType } from "@/pages/applicants";
import { Button } from "../ui/button";
const ApplicantItem: React.FC<{ applicant: ApplicantType }> = ({
  applicant,
}) => {
  const avatarUrl =
    applicant.avatar && applicant.avatar_content_type
      ? `data:${applicant.avatar_content_type};base64,${applicant.avatar}`
      : "images/default_pic.png";

  const RespondButton =
    applicant.status === "applied" ? (
      <Button className="mt-5 font-bold">Respond</Button>
    ) : (
      <Button className="mt-5 font-bold" disabled>
        Responded Already
      </Button>
    );

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
        <p className="text-xl font-semibold">{applicant.name}</p>
        <p>{applicant.email}</p>
        {RespondButton}
      </div>
    </li>
  );
};

export default ApplicantItem;
