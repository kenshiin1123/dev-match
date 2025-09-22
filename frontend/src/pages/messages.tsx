import MessageSection from "@/components/messages/message-section";
import Contacts from "@/components/messages/contacts";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { createContext, useEffect, useState } from "react";
import ContactPanelToggle from "../components/messages/contact-panel-toggle";
import {
  Link,
  useLoaderData,
  type ActionFunction,
  type LoaderFunction,
} from "react-router-dom";
import { getAuthToken } from "@/util/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import messageEmitters from "@/socket/emitters/message.emitters";
import { socket } from "@/socket/socket";
import { postMessageListener } from "../socket/listeners/message.listeners";

export type ContactType = {
  name: string;
  avatar?: string;
  avatar_content_type?: string;
  recent_message: string;
  created_at: string;
  user_id: string;
};

export type MessageType = {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export const MessageContext = createContext({
  handlePostMessage: (message: string, receiver_id: string) => {
    message;
    receiver_id;
  },
  contacts: [] as ContactType[],
  expandContacts: true,
  handleSetActiveContact: (contact: ContactType) => {
    contact;
  },
  activeContact: null as ContactType | null | undefined,
  messages: [] as MessageType[],
  setMessages: (_: React.SetStateAction<MessageType[]>) => {},
  isMobile: false,
});

const MessagesPage = () => {
  const loadedContacts: ContactType[] = useLoaderData();
  const [contacts, setContacts] = useState<ContactType[]>(loadedContacts);
  const [isMobile, setIsmobile] = useState(window.innerWidth < 640);
  const [expandContacts, setExpandContacts] = useState(true);
  const [activeContact, setActiveContact] = useState<ContactType | null>(
    contacts.length > 0 ? contacts[0] : null
  );
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { handlePostMessage } = messageEmitters();

  useEffect(() => {
    // Set initial state for expandContacts based on isMobile
    setExpandContacts(!isMobile);

    const handleResize = () => {
      setIsmobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  useEffect(() => {
    return postMessageListener(setMessages, setContacts);
  }, [socket]);

  useEffect(() => {
    if (!activeContact!.user_id) return;
    const fetchMessages = async () => {
      const { VITE_API_BASE_URL } = import.meta.env;
      const response = await fetch(
        `${VITE_API_BASE_URL}/messages/${activeContact!.user_id}`,
        { headers: { Authorization: "Bearer " + getAuthToken() } }
      );

      const { message, success, data } = await response.json();

      if (!success) return toast.error(message);

      setMessages(data);
    };
    fetchMessages();
  }, [activeContact]);

  const toggleContactDisplay = () => {
    setExpandContacts((prev) => !prev);
  };

  const handleSetActiveContact = (contact: ContactType) => {
    setActiveContact(contact);
  };

  if (!loadedContacts.length) {
    return (
      <motion.div
        animate={{ opacity: [0, 1], y: [30, 0] }}
        className="w-full h-70 flex justify-center items-center flex-col gap-5"
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold">No conversations yet.</h1>
        <Link to={"/connections"}>
          <Button>Start a new connection</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <MessageContext.Provider
      value={{
        activeContact,
        contacts,
        expandContacts,
        handlePostMessage,
        handleSetActiveContact,
        messages,
        setMessages,
        isMobile,
      }}
    >
      <motion.div
        animate={{ opacity: [0, 1], y: [30, 0] }}
        className="w-full h-[92vh] p-5"
        transition={{ duration: 0.3 }}
      >
        <Card className="flex flex-row p-0 w-full h-full relative">
          <Contacts />
          <MessageSection contact={activeContact || null}>
            <ContactPanelToggle
              toggleContactDisplay={toggleContactDisplay}
              state={{ expandContacts, isMobile }}
            />
          </MessageSection>
        </Card>
      </motion.div>
    </MessageContext.Provider>
  );
};

export default MessagesPage;

export const loader: LoaderFunction = async () => {
  const { VITE_API_BASE_URL } = import.meta.env;
  const response = await fetch(`${VITE_API_BASE_URL}/messages`, {
    headers: {
      Authorization: "Bearer " + getAuthToken(),
    },
  });

  const { message, success, data } = await response.json();

  if (!success) {
    return toast.error(message);
  }

  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const payload: { receiver_id?: string; content?: string } = {};
  let event = "";

  if (request.method === "POST") {
    const receiver_id = formData.get("receiver_id");
    const content = formData.get("content");

    payload.receiver_id = receiver_id!.toString();
    payload.content = content!.toString();

    event = "send_message";

    if (!receiver_id || !content) return;
  }

  socket.emit(event, payload);

  return null;
};
