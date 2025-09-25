import { toast } from "sonner";
import { getSocket } from "../socket";
import { type ContactType, type MessageType } from "@/pages/messages";

const postMessageListener = (
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  setContacts: React.Dispatch<React.SetStateAction<ContactType[]>>
) => {
  const socket = getSocket();
  const listener = (resData: any) => {
    const { success, message, data } = resData;

    if (!success) {
      return toast.error(message);
    }

    setMessages((prevMessages: MessageType[]) => {
      return [...prevMessages, data];
    });

    setContacts((prevContacts: ContactType[]) => {
      // Current contact
      const currentContact = prevContacts.filter(
        (prevContact) =>
          prevContact.user_id === data.sender_id ||
          prevContact.user_id === data.receiver_id
      )[0];

      // Exclude the currentContact in the list of contacts
      const filteredContacts = prevContacts.filter(
        (prevContact) => prevContact.user_id !== currentContact.user_id
      );

      // Bring currentContact to the top
      const sortedContacts = [currentContact, ...filteredContacts];

      // Update recent message of the currentContact
      return sortedContacts.map((prevContact) => {
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

  socket?.on("send_message_response", listener);
  return () => {
    socket?.off("send_message_response", listener);
  };
};

export { postMessageListener };
