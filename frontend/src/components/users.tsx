import type { UserProfileType } from "@/pages/connections";
import { Button } from "./ui/button";

const Users: React.FC<{ users: UserProfileType[] }> = ({ users }) => {
  return (
    <ul className="flex flex-col mt-5 gap-3">
      {users.map((user: UserProfileType) => {
        const avatarUrl =
          user.avatar && user.avatar_content_type
            ? `data:${user.avatar_content_type};base64,${user.avatar}`
            : "images/default_pic.png";

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
            <Button className="ml-auto font-bold">Connect</Button>
          </li>
        );
      })}
    </ul>
  );
};

export default Users;
