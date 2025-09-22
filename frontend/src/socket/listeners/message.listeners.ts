import { toast } from "sonner";
import { socket } from "../socket";
import { type ContactType, type MessageType } from "@/pages/messages";

const postMessageListener = (
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  setContacts: React.Dispatch<React.SetStateAction<ContactType[]>>
) => {
  const listener = (resData: any) => {
    const { success, message, data } = resData;

    if (!success) {
      return toast.error(message);
    }

    setMessages((prevMessages: MessageType[]) => {
      return [...prevMessages, data];
    });

    setContacts((prevContacts: ContactType[]) => {
      return prevContacts.map((prevContact) => {
        if (
          prevContact.user_id === data.sender_id ||
          prevContact.user_id === data.receiver_id
        ) {
          return { ...prevContact, recent_message: data.content };
        }

        return prevContact;
      });
    });
  };

  socket.on("send_message_response", listener);
  return () => {
    socket.off("send_message_response", listener);
  };
};

export { postMessageListener };
