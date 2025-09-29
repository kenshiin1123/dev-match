import type { ConnectionType, UserProfileType } from "@/pages/connections";
import { useSubmit } from "react-router-dom";
import { toast } from "sonner";

const connectionEmitters = (
  currentUser: UserProfileType,
  setUsers: React.Dispatch<any>
) => {
  const submit = useSubmit();

  const handleConnectUser = async (sender_id: string, receiver_id: string) => {
    if (!["developer", "employer"].includes(currentUser.role)) {
      return toast.error("You are unauthorized. Please login first");
    }

    const formData = new FormData();
    formData.append("sender_id", sender_id);
    formData.append("receiver_id", receiver_id);
    await submit(formData, { method: "POST" });
  };

  const handleRemoveConnection = async (
    connection_id: string,
    connected_user_id: string
  ) => {
    if (!["developer", "employer"].includes(currentUser.role)) {
      return toast.error("You are unauthorized. Please login first");
    }

    setUsers((prevUsers: UserProfileType[]) => {
      return prevUsers.map((user) => {
        if (user.connection_id === connection_id) {
          const updatedUser = {
            user_id: user.user_id,
            avatar: user.avatar,
            created_at: user.created_at,
            name: user.name,
            role: user.role,
          };
          return updatedUser;
        }

        return user;
      });
    });

    const formData = new FormData();
    formData.append("connection_id", connection_id);
    formData.append("connected_user_id", connected_user_id);
    await submit(formData, { method: "DELETE" });
  };

  const handleAcceptConnection = async (
    connection_id: ConnectionType["connection_id"],
    sender_id: UserProfileType["user_id"]
  ) => {
    if (!["developer", "employer"].includes(currentUser.role)) {
      return toast.error("You are unauthorized. Please login first");
    }

    const formData = new FormData();
    formData.append("connection_id", connection_id);
    formData.append("sender_id", sender_id);
    await submit(formData, { method: "PATCH" });
  };

  return {
    handleConnectUser,
    handleRemoveConnection,
    handleAcceptConnection,
  };
};

export default connectionEmitters;
