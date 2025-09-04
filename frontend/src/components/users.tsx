import { ConnectionContext, type UserProfileType } from "@/pages/connections";
import { useSelector } from "react-redux";
import { useContext } from "react";
import UserConnectionItem from "./user-connection-item";

const Users: React.FC<{}> = () => {
  const { users } = useContext(ConnectionContext);
  const currentUserId = useSelector((state: any) => state.user.user_id);

  return (
    <ul className="flex flex-col mt-5 gap-3">
      {users.map((user: UserProfileType) => {
        // Do not include current user
        if (user.user_id === currentUserId) return;
        return <UserConnectionItem user={user} key={user.user_id} />;
      })}
    </ul>
  );
};

export default Users;
