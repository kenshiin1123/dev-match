import MessageSection from "@/components/messages/message-section";
import Contacts from "@/components/messages/contacts";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import ContactPanelToggle from "../components/messages/contact-panel-toggle";

export type ContactType = {
  name: string;
  avatar?: string;
  avatar_content_type?: string;
  recent_message: string;
  created_at: string;
  user_id: string;
};

const contacts: ContactType[] = [
  {
    name: "Lance Ivan Gil Fernandez",
    recent_message: "hello world",
    created_at: "2024-06-10T09:30:00",
    user_id: "user1",
  },
  {
    name: "Angelie",
    recent_message: "hello world",
    created_at: "2024-06-10T08:15:00",
    user_id: "user2",
  },
  {
    name: "Rex",
    recent_message: "hello worldhello worldhello worldhello worldhello world",
    created_at: "2024-06-09T22:45:00",
    user_id: "user3",
  },
];

type StateType = {
  contacts: ContactType[];
  activeContact?: ContactType | null;
};

const initialState: StateType = {
  contacts,
  activeContact: null,
};

const MessagesPage = () => {
  const [state, setState] = useState<StateType>(initialState);
  const [isMobile, setIsmobile] = useState(window.innerWidth < 640);
  const [expandContacts, setExpandContacts] = useState(true);

  useEffect(() => {
    // Set initial state for expandContacts based on isMobile
    setExpandContacts(!isMobile);

    const handleResize = () => {
      setIsmobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  const toggleContactDisplay = () => {
    setExpandContacts((prev) => !prev);
  };

  const handleSetActiveContact = (contact: ContactType) => {
    setState((prevState) => {
      return { ...prevState, activeContact: contact };
    });
  };

  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [30, 0] }}
      className="w-full h-screen p-5"
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-row p-0 w-full h-full relative">
        <Contacts
          contacts={contacts}
          expandContacts={expandContacts}
          handleSetActiveContact={handleSetActiveContact}
        />
        <MessageSection contact={state.activeContact || null}>
          <ContactPanelToggle
            toggleContactDisplay={toggleContactDisplay}
            state={{ expandContacts, isMobile }}
          />
        </MessageSection>
      </Card>
    </motion.div>
  );
};

export default MessagesPage;
