import type { UserProfileType } from "@/pages/connections";
import { getSocket } from "@/socket/socket";
import { toast } from "sonner";

const establishConnectionListener = (setUsers: React.Dispatch<any>) => {
  const socket = getSocket();
  const listener = (resData: any) => {
    const { message, success, data } = resData;
    if (!success) return toast.error(message);

    const { sender_id, receiver_id, connection_id, status } = data;

    setUsers((prevUsers: UserProfileType[]) =>
      prevUsers.map((user) => {
        if (user.user_id === sender_id || user.user_id === receiver_id) {
          const connect_type =
            user.user_id === sender_id ? "sender" : "receiver";
          return { ...user, connection_id, status, connect_type };
        }
        return user;
      })
    );
  };

  socket?.on("establish_connection_response", listener);

  // cleanup function
  return () => socket?.off("establish_connection_response", listener);
};

const removeConnectionListener = (setUsers: React.Dispatch<any>) => {
  const socket = getSocket();
  const listener = (resData: any) => {
    const { success, message, data } = resData;
    if (!success) return toast.error(message);

    const { connection_id } = data;
    setUsers((prevUsers: UserProfileType[]) =>
      prevUsers.map((user) =>
        user.connection_id === connection_id
          ? {
              ...user,
              status: undefined,
              connect_type: undefined,
              connection_id: undefined,
            }
          : user
      )
    );
  };

  socket?.on("remove_connection_response", listener);
  return () => socket?.off("remove_connection_response", listener);
};

const acceptConnectionListener = (setUsers: React.Dispatch<any>) => {
  const socket = getSocket();
  const listener = (resData: any) => {
    const { success, message, data } = resData;
    if (!success) return toast.error(message);

    setUsers((prevUsers: UserProfileType[]) =>
      prevUsers.map((prevUser) =>
        prevUser.connection_id === data.connection_id
          ? { ...prevUser, status: "accepted" }
          : prevUser
      )
    );
  };

  socket?.on("accept_connection_response", listener);
  return () => socket?.off("accept_connection_response", listener);
};

export {
  establishConnectionListener,
  removeConnectionListener,
  acceptConnectionListener,
};
