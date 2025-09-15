import type { UserProfileType } from "@/pages/connections";
import { socket } from "@/socket/socket";
import { toast } from "sonner";

const establishConnectionListener = (setUsers: React.Dispatch<any>) => {
  const listener = (resData: any) => {
    const { message, success, data } = resData;
    if (!success) {
      return toast.error(message);
    }

    const { sender_id, receiver_id, connection_id, status } = data;

    setUsers((prevUsers: UserProfileType[]) =>
      prevUsers.map((user) => {
        if (user.user_id === sender_id || user.user_id === receiver_id) {
          // Figure out if the current user is sender or receiver
          const connect_type =
            user.user_id === sender_id ? "sender" : "receiver";

          return {
            ...user,
            connection_id,
            status,
            connect_type,
          };
        }
        return user;
      })
    );
  };

  socket.on("establish_connection_response", listener);

  // return cleanup for useEffect
  return () => socket.off("establish_connection_response", listener);
};

const removeConnectionListener = (setUsers: React.Dispatch<any>) => {
  const listener = (resData: any) => {
    const { success, message, data } = resData;
    if (!success) {
      return toast.error(message);
    }

    const { connection_id } = data;

    setUsers((prevUsers: UserProfileType[]) =>
      prevUsers.map((user) => {
        if (user.connection_id === connection_id) {
          return {
            ...user,
            status: undefined,
            connect_type: undefined,
            connection_id: undefined,
          };
        }
        return user;
      })
    );
  };

  socket.on("remove_connection_response", listener);

  // return cleanup
  return () => socket.off("remove_connection_response", listener);
};

export { establishConnectionListener, removeConnectionListener };
