import {
  redirect,
  useLoaderData,
  useSubmit,
  type ActionFunction,
  type LoaderFunction,
} from "react-router-dom";
import { toast } from "sonner";
import Users from "@/components/users";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/util/auth";
import { useSelector } from "react-redux";
import { createContext } from "react";

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
  handleConnectUser: (user_id: UserProfileType["user_id"]) => {
    user_id;
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
    user_id: UserProfileType["user_id"]
  ) => {
    connection_id;
    user_id;
  },
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
  const submit = useSubmit();
  const loadedUsers = useLoaderData();
  const currentUser = useSelector((state: any) => state.user);
  const [users, setUsers] = useState(loadedUsers);

  const determineDevOrEmp = () => {
    derivedDetermineDevOrEmp(currentUser, setUsers);
  };

  const handleConnectUser = async (user_id: string) => {
    if (!["developer", "employer"].includes(currentUser.role)) {
      return toast.error("You are unauthorized. Please login first");
    }

    // Optimistic update
    setUsers((prev: UserProfileType[]) =>
      prev.map((u) =>
        u.user_id === user_id
          ? { ...u, status: "pending", connect_type: "receiver" } // assume current user sent request
          : u
      )
    );

    const formData = new FormData();
    formData.append("user_id", user_id);
    await submit(formData, { method: "POST" });

    derivedDetermineDevOrEmp(currentUser, setUsers);
  };

  const handleRemoveConnection = async (
    connection_id: string,
    connected_user_id: string
  ) => {
    if (!["developer", "employer"].includes(currentUser.role)) {
      return toast.error("You are unauthorized. Please login first");
    }

    // Optimistic update
    setUsers((prev: UserProfileType[]) =>
      prev.map((u) =>
        u.user_id === connected_user_id
          ? {
              ...u,
              status: undefined,
              connect_type: undefined,
              connection_id: undefined,
            }
          : u
      )
    );

    const formData = new FormData();
    formData.append("connection_id", connection_id);
    formData.append("connected_user_id", connected_user_id);
    await submit(formData, { method: "DELETE" });

    derivedDetermineDevOrEmp(currentUser, setUsers);
  };

  const handleAcceptConnection = async (
    connection_id: ConnectionType["connection_id"],
    user_id: UserProfileType["user_id"]
  ) => {
    if (!["developer", "employer"].includes(currentUser.role)) {
      return toast.error("You are unauthorized. Please login first");
    }

    // Optimistic update
    setUsers((prev: UserProfileType[]) =>
      prev.map((u) =>
        u.user_id === user_id
          ? {
              ...u,
              status: undefined,
              connect_type: undefined,
              connection_id: undefined,
            }
          : u
      )
    );

    const formData = new FormData();
    formData.append("connection_id", connection_id);
    formData.append("sender_id", user_id);
    await submit(formData, { method: "PATCH" });

    derivedDetermineDevOrEmp(currentUser, setUsers);
  };

  useEffect(() => {
    determineDevOrEmp();
  }, [currentUser]);

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
  const { VITE_API_BASE_URL } = import.meta.env;
  const formData = await request.formData();

  let URL = `${VITE_API_BASE_URL}/connections/connect`;
  let payload: any = {};
  let loadingMsg = "Sending connection request...";

  if (request.method === "POST") {
    payload.receiver_id = formData.get("user_id");
  }

  if (request.method === "DELETE") {
    const connection_id = formData.get("connection_id");
    payload.connected_user_id = formData.get("connected_user_id");
    URL = `${VITE_API_BASE_URL}/connections/${connection_id}/remove`;
    loadingMsg = "Removing connection...";
  }

  if (request.method === "PATCH") {
    const connection_id = formData.get("connection_id");
    payload.sender_id = formData.get("sender_id");
    URL = `${VITE_API_BASE_URL}/connections/${connection_id}/accept`;
    loadingMsg = "Accepting connection...";
    console.log(payload);
  }

  toast.promise(
    (async () => {
      const response = await fetch(URL, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const { success, message } = await response.json();
      if (!success) throw new Error(message);
      return message;
    })(),
    {
      loading: loadingMsg,
      success: (msg) =>
        typeof msg === "string" ? msg : "Connection successful",
      error: (msg) => (typeof msg === "string" ? msg : "Connection failed"),
    }
  );

  return null; // no redirect, state refresh happens in component
};

export default ConnectionsPage;
