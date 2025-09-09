import { ConnectionContext, type UserProfileType } from "@/pages/connections";
import { useContext } from "react";
import UserConnectionItem from "./user-connection-item";

const Users: React.FC<{}> = () => {
  const { users, currentUser } = useContext(ConnectionContext);

  return (
    <ul className="flex flex-col mt-5 gap-3">
      {users.map((user: UserProfileType) => {
        // Do not include current user
        if (user.user_id === currentUser.user_id) return;
        return <UserConnectionItem user={user} key={user.user_id} />;
      })}
    </ul>
  );
};

export default Users;
