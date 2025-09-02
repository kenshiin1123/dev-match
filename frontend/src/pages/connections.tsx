import { redirect, useLoaderData, type LoaderFunction } from "react-router-dom";
import { toast } from "sonner";
import Users from "@/components/users";

export type UserProfileType = {
  user_id: string;
  avatar?: string;
  avatar_content_type?: string;
  created_at: string;
  name: string;
  role: string;
};

const ConnectionsPage: React.FC<{}> = () => {
  const users = useLoaderData();

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

export default ConnectionsPage;
