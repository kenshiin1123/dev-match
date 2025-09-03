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

export type UserProfileType = {
  user_id: string;
  avatar?: string;
  avatar_content_type?: string;
  created_at: string;
  name: string;
  role: string;
  status?: string;
  connect_type?: "sender" | "receiver";
};

export type ConnectionType = {
  connection_id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  updated_at: string;
};

const ConnectionsPage: React.FC<{}> = () => {
  const loadedUsers = useLoaderData();
  const currentUser = useSelector((state: any) => state.user);
  const [users, setUsers] = useState(loadedUsers);

  useEffect(() => {
    if (currentUser.role === "developer" || currentUser.role === "employer") {
      const fetchConnections = async () => {
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

              const connectionOfCurrentUser: ConnectionType =
                connections.filter(
                  (connection: ConnectionType) =>
                    connection?.receiver_id === currentUserId ||
                    connection?.sender_id === currentUserId
                )[0];

              if (connectionOfCurrentUser && connectionOfCurrentUser.status) {
                // Determine which is the sender and receiver
                let connect_type = "";

                // prettier-ignore
                if (connectionOfCurrentUser.receiver_id == currentUserId) connect_type = "receiver"
                // prettier-ignore
                if(connectionOfCurrentUser.sender_id == currentUserId) connect_type = "sender"

                return {
                  ...user,
                  status: connectionOfCurrentUser.status,
                  connect_type: connect_type,
                };
              }

              return user;
            });
          });
        }
      };
      fetchConnections();
    }
  }, [currentUser.user_id]);

  return (
    <div className="p-5">
      <section>
        <h1 className="text-2xl font-semibold mb-2">
          Connect with professionals
        </h1>
        <p className="mb-4">
          Browse through the list and start building your network.
        </p>
        <Users users={users} />
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

  const payload = {
    receiver_id: formData.get("user_id"),
  };

  if (!payload.receiver_id) {
    toast.error("Connection receiver ID is required.");
    return redirect("/connections");
  }

  switch (request.method) {
    case "POST":
      toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(
              `${VITE_API_BASE_URL}/connections/connect`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(payload),
              }
            );

            const { success, message } = await response.json();

            if (!success) {
              reject(new Error(message));
            } else {
              resolve(message);
            }
          } catch (error) {
            reject(error);
          }
        }),
        {
          loading: "Connecting...",
          success: (msg) =>
            typeof msg === "string" ? msg : "Connection successful!",
          error: (err) => err.message || "Something went wrong",
        }
      );
      break;

    default:
      break;
  }

  return redirect("/connections");
};

export default ConnectionsPage;
