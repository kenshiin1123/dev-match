import LabelWithParagraphItem from "@/components/label-with-paragraph-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAuthToken, tokenLoader } from "@/util/auth";
import getAvatarUrl from "@/util/getAvatarUrl";
import {
  redirect,
  useLoaderData,
  type ActionFunction,
  type LoaderFunction,
} from "react-router-dom";
import { toast } from "sonner";
import EditProfileSheet from "@/components/edit-profile-sheet";

export type UserProfile = {
  user_id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  skills: string[];
  company: string;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  avatar_content_type: string | null;
} | null;

const ProfilePage = () => {
  const userData: UserProfile = useLoaderData();
  const userAvatar = getAvatarUrl(
    userData?.avatar || undefined,
    userData?.avatar_content_type || undefined
  );

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-[95%] h-[95%] rounded-md p-0 flex">
        <ScrollArea className="h-0 grow p-5">
          <section className="flex flex-col w-fit justify-center items-center mb-5 max-sm:mx-auto">
            <img
              src={userAvatar}
              alt="User avatar"
              className="border size-40 mb-1"
            />
            <Button className="w-full rounded-none" variant={"outline"}>
              {userAvatar === "images/default_pic.png"
                ? "Upload your avatar"
                : "Change Avatar"}
            </Button>
            <EditProfileSheet userData={userData} />
          </section>
          <section className="flex flex-col max-sm:items-center">
            <h1 className="text-xl font-semibold">{userData?.name}</h1>
            <p className="text-muted-foreground mt-3">
              <b>Email:</b> {userData?.email}
            </p>
            <p className="text-muted-foreground">
              <b>Location:</b> {userData?.location}
            </p>
            <LabelWithParagraphItem
              label={"Account type"}
              paragraph={userData!.role}
              className="p-2 w-60 mt-5 text-sm font-medium justify-center bg-secondary"
              animate={false}
            />
            {userData!.role === "employer" && (
              <LabelWithParagraphItem
                label={"Company"}
                paragraph={userData!.company}
                className={`p-2 mt-2 text-sm font-medium bg-secondary ${
                  userData!.company.length > 15
                    ? "justify-start w-fit"
                    : "justify-center w-60"
                }`}
                animate={false}
              />
            )}
          </section>
          <section className="mt-5">
            <h1 className="text-lg font-semibold indent-3">
              {userData!.skills.length > 1 ? "Skills" : "Skill"}
            </h1>
            <ul className="border min-h-30 mt-3 p-5 flex gap-3 rounded flex-wrap">
              {userData!.skills.map((skill, i) => {
                return (
                  <li
                    key={i}
                    className="card border w-fit px-4 py-2 rounded h-fit bg-secondary"
                  >
                    {skill}
                  </li>
                );
              })}
            </ul>
          </section>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ProfilePage;

export const loader: LoaderFunction = async () => {
  // Redirect if role is neither employer or developer
  const loadedToken = tokenLoader();
  if (!["developer", "employer"].includes(loadedToken.role)) {
    return redirect("/jobs");
  }

  const token = getAuthToken();

  const { VITE_API_BASE_URL } = import.meta.env;
  const response = await fetch(`${VITE_API_BASE_URL}/users/me`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const { success, message, data } = await response.json();

  if (!success) {
    toast.error(message);
    return null;
  }

  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { VITE_API_BASE_URL } = import.meta.env;
  const toastPosition = window.innerWidth < 640 ? "top-right" : "bottom-right";

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    location: formData.get("location"),
    skills: JSON.parse(formData.get("skills")!.toString()),
  };

  const response = await fetch(`${VITE_API_BASE_URL}/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAuthToken(),
    },
    body: JSON.stringify(payload),
  });

  const { message, success } = await response.json();

  if (!success) {
    toast.error(message, { position: toastPosition });
    return success;
  }

  toast.success(message, { position: toastPosition });

  return success;
};
