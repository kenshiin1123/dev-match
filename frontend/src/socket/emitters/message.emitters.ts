import { useSubmit } from "react-router-dom";
import { toast } from "sonner";

const messageEmitters = () => {
  const submit = useSubmit();

  const handlePostMessage = (content: string, receiver_id: string) => {
    if (!receiver_id || !content) {
      return toast.error("Receiver ID and Message Content is required!");
    }

    const formData = new FormData();
    formData.set("receiver_id", receiver_id);
    formData.set("content", content);

    submit(formData, { method: "POST" });
  };

  return { handlePostMessage };
};

export default messageEmitters;
