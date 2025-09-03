import type { UserProfileType } from "@/pages/connections";
import { Button } from "./ui/button";
import { useSubmit } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Users: React.FC<{ users: UserProfileType[] }> = ({ users }) => {
  const submit = useSubmit();
  const currentUserId = useSelector((state: any) => state.user.user_id);

  const handleConnectUser = (user_id: UserProfileType["user_id"]) => {
    const formData = new FormData();
    if (!user_id) {
      return toast.error(user_id);
    }
    formData.append("user_id", user_id);
    submit(formData, { method: "POST" });
  };

  return (
    <ul className="flex flex-col mt-5 gap-3">
      {users.map((user: UserProfileType) => {
        const avatarUrl =
          user.avatar && user.avatar_content_type
            ? `data:${user.avatar_content_type};base64,${user.avatar}`
            : "images/default_pic.png";

        // Do not include current user
        if (user.user_id === currentUserId) return;

        return (
          <li
            key={user.user_id}
            className="bg-card flex border p-4 rounded-md items-center gap-3"
          >
            <img src={avatarUrl} className="size-10" />
            <section>
              <h1
                className="text-lg font-semibold line-clamp-1"
                title={user.name}
              >
                {user.name}
              </h1>
              <p className="text-sm">{user.role}</p>
            </section>
            {/*
               Replace connect button with "cancel connect" if the sender 
               is the currentUser otherwise make it "reject request" 
            */}
            {!user.status ? (
              <Button
                onClick={() => handleConnectUser(user.user_id)}
                className="ml-auto font-bold"
              >
                Connect
              </Button>
            ) : user.connect_type === "receiver" &&
              user.status === "pending" ? (
              <Button className="ml-auto font-bold">Cancel Request</Button>
            ) : (
              user.connect_type === "sender" &&
              user.status === "pending" && (
                <Button className="ml-auto font-bold">Accept Request</Button>
              )
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Users;
