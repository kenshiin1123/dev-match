import { toast } from "sonner";
import { socket } from "../socket";
import { type MessageType } from "@/pages/messages";

const postMessageListener = (
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  const listener = (resData: any) => {
    const { success, message, data } = resData;

    if (!success) {
      return toast.error(message);
    }

    setMessages((prevMessages: MessageType[]) => {
      return [...prevMessages, data];
    });
  };

  socket.on("send_message_response", listener);
  return () => {
    socket.off("send_message_response", listener);
  };
};

export { postMessageListener };
