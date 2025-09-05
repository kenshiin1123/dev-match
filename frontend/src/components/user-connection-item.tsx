import { ConnectionContext, type UserProfileType } from "@/pages/connections";
import { useContext } from "react";
import { Button } from "./ui/button";
import { useNavigation } from "react-router-dom";

const UserConnectionItem: React.FC<{ user: UserProfileType }> = ({ user }) => {
  const navigation = useNavigation();
  const { handleConnectUser, handleRemoveConnection, handleAcceptConnection } =
    useContext(ConnectionContext);

  const avatarUrl =
    user.avatar && user.avatar_content_type
      ? `data:${user.avatar_content_type};base64,${user.avatar}`
      : "images/default_pic.png";

  const isLoading = navigation.state === "loading";

  return (
    <li
      key={user.user_id}
      className="bg-card flex border p-4 rounded-md items-center gap-3"
    >
      <img src={avatarUrl} className="size-10" />
      <section>
        <h1 className="text-lg font-semibold line-clamp-1" title={user.name}>
          {user.name}
        </h1>
        <p className="text-sm">{user.role}</p>
      </section>
      {!user.status ? (
        <Button
          onClick={() => handleConnectUser(user.user_id)}
          className="ml-auto font-bold"
          disabled={isLoading}
        >
          Connect
        </Button>
      ) : user.connect_type === "receiver" && user.status === "pending" ? (
        <Button
          className="ml-auto font-bold"
          onClick={() =>
            handleRemoveConnection(user.connection_id!, user.user_id)
          }
          disabled={isLoading}
        >
          Cancel Request
        </Button>
      ) : user.connect_type === "sender" && user.status === "pending" ? (
        <div className="ml-auto flex flex-col sm:flex-row gap-2">
          <Button
            size={"sm"}
            variant={"destructive"}
            className="font-bold"
            disabled={isLoading}
            onClick={() =>
              handleRemoveConnection(user.connection_id!, user.user_id)
            }
          >
            Reject Request
          </Button>
          <Button
            onClick={() =>
              handleAcceptConnection(user.connection_id!, user.user_id)
            }
            size={"sm"}
            className=" font-bold"
            disabled={isLoading}
          >
            Accept Request
          </Button>
        </div>
      ) : (
        user.connect_type === "sender" &&
        user.status === "accepted" && (
          <Button
            onClick={() =>
              handleRemoveConnection(user.connection_id!, user.user_id)
            }
            className="ml-auto font-bold"
            disabled={isLoading}
            size={"sm"}
            variant={"ghost"}
          >
            Remove Connection
          </Button>
        )
      )}
    </li>
  );
};

export default UserConnectionItem;
