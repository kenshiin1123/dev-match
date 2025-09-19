import {
  redirect,
  useLoaderData,
  type ActionFunction,
  type LoaderFunction,
} from "react-router-dom";
import { toast } from "sonner";
import Users from "@/components/users";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/util/auth";
import { useSelector } from "react-redux";
import { createContext } from "react";
import { type UserState } from "@/store/user-reducer";
import { socket } from "@/socket/socket";
import {
  acceptConnectionListener,
  establishConnectionListener,
  removeConnectionListener,
} from "@/socket/listeners/connection.listeners";
import connectionEmitters from "@/socket/emitters/connection.emitters";

export type ConnectionType = {
  connection_id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  updated_at: string;
};

export type UserProfileType = {
  user_id: string;
  avatar?: string;
  avatar_content_type?: string;
  created_at: string;
  name: string;
  role: string;
  status?: string;
  connect_type?: "sender" | "receiver";
  connection_id?: ConnectionType["connection_id"]; // this holds the connection id of the current user and to this user
};

export const ConnectionContext = createContext({
  users: [],
  handleConnectUser: (
    sender_id: UserProfileType["user_id"],
    receiver_id: string
  ) => {
    sender_id;
    receiver_id;
  },
  handleRemoveConnection: (
    connection_id: ConnectionType["connection_id"],
    connected_user_id: UserProfileType["user_id"]
  ) => {
    connection_id;
    connected_user_id;
  },

  handleAcceptConnection: (
    connection_id: ConnectionType["connection_id"],
    sender_id: UserProfileType["user_id"]
  ) => {
    connection_id;
    sender_id;
  },
  currentUser: {} as UserState,
});

const derivedDetermineDevOrEmp = async (
  currentUser: UserProfileType,
  setUsers: React.Dispatch<any>
) => {
  if (currentUser.role !== "developer" && currentUser.role !== "employer") {
    return toast.error("You are unauthorized. Please login first");
  }

  const { VITE_API_BASE_URL } = import.meta.env;
  const response = await fetch(`${VITE_API_BASE_URL}/connections`, {
    headers: {
      Authorization: "Bearer " + getAuthToken(),
    },
  });

  const {
    success,
    data: connections,
  }: {
    success: boolean;
    message: string;
    data: ConnectionType[];
  } = await response.json();

  if (success) {
    setUsers((prevUsers: UserProfileType[]) => {
      // Update the user’s entry with the connection status if a match is found
      return prevUsers.map((user: UserProfileType) => {
        const currentUserId = user.user_id;

        const connectionOfCurrentUser: ConnectionType = connections.filter(
          (connection: ConnectionType) =>
            connection?.receiver_id === currentUserId ||
            connection?.sender_id === currentUserId
        )[0];

        // Run this if matched
        if (connectionOfCurrentUser && connectionOfCurrentUser.status) {
          // Determine which is the sender and receiver
          let connect_type = "";

          // prettier-ignore
          if (connectionOfCurrentUser.receiver_id == currentUserId) connect_type = "receiver"
          // prettier-ignore
          if(connectionOfCurrentUser.sender_id == currentUserId) connect_type = "sender"

          // Insert new currentUservalues
          return {
            ...user,
            status: connectionOfCurrentUser.status,
            connect_type: connect_type,
            connection_id: connectionOfCurrentUser.connection_id,
          };
        }

        // If not matched, return the user
        return user;
      });
    });
  }
};

const ConnectionsPage: React.FC<{}> = () => {
  const loadedUsers = useLoaderData();
  const currentUser = useSelector((state: any) => state.user);
  const [users, setUsers] = useState(loadedUsers);

  const determineDevOrEmp = () => {
    derivedDetermineDevOrEmp(currentUser, setUsers);
  };

  // This is the socket emitters for connections
  const { handleConnectUser, handleRemoveConnection, handleAcceptConnection } =
    connectionEmitters(currentUser, setUsers);

  useEffect(() => {
    determineDevOrEmp();
  }, [currentUser]);

  useEffect(() => {
    establishConnectionListener(setUsers);
    removeConnectionListener(setUsers);
    acceptConnectionListener(setUsers);
  }, [socket]);

  return (
    <div className="p-5">
      <section>
        <h1 className="text-2xl font-semibold mb-2">
          Connect with professionals
        </h1>
        <p className="mb-4">
          Browse through the list and start building your network.
        </p>
        <ConnectionContext.Provider
          value={{
            users,
            currentUser,
            handleConnectUser,
            handleRemoveConnection,
            handleAcceptConnection,
          }}
        >
          <Users />
        </ConnectionContext.Provider>
      </section>
    </div>
  );
};

export const loader: LoaderFunction = async () => {
  const { VITE_API_BASE_URL } = import.meta.env;
  const response = await fetch(`${VITE_API_BASE_URL}/users`);

  const { success, message, data } = await response.json();
  if (!success) {
    console.error(message);
    toast.error(message);
    return redirect("/");
  }

  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let event = "";

  const payload: {
    sender_id?: string;
    receiver_id?: string;
    connection_id?: string;
    connected_user_id?: string;
  } = {};

  if (request.method === "POST") {
    event = "establish_connection";
    const sender_id = formData.get("sender_id");
    const receiver_id = formData.get("receiver_id");
    payload.sender_id = sender_id!.toString();
    payload.receiver_id = receiver_id!.toString();

    if (!sender_id || !receiver_id) {
      return toast.error("Sender ID and Receiver ID is required");
    }
  } else if (request.method === "DELETE") {
    event = "remove_connection";
    const connection_id = formData.get("connection_id");
    const connected_user_id = formData.get("connected_user_id");
    payload.connection_id = connection_id!.toString();
    payload.connected_user_id = connected_user_id!.toString();

    if (!connection_id || !connected_user_id) {
      return toast.error("Connection ID and User ID is required");
    }
  } else if (request.method === "PATCH") {
    event = "accept_connection";
    const connection_id = formData.get("connection_id");
    const sender_id = formData.get("sender_id");
    payload.connection_id = connection_id!.toString();
    payload.sender_id = sender_id!.toString();

    if (!connection_id || !sender_id) {
      return toast.error("Connection ID and Sender ID is required");
    }
  }

  socket.emit(event, payload);

  return null;
};

export default ConnectionsPage;
