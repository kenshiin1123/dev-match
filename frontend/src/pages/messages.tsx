import MessageContent from "@/components/messages/message-content";
import Contacts from "@/components/messages/contacts";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeftRightIcon } from "lucide-react";

export type ContactType = {
  name: string;
  avatar?: string;
  avatar_content_type?: string;
  recent_chat: string;
  date: string;
};

const contacts: ContactType[] = [
  { name: "Lance", recent_chat: "hello world", date: "2024-06-10T09:30:00" },
  { name: "Angelie", recent_chat: "hello world", date: "2024-06-10T08:15:00" },
  {
    name: "Rex",
    recent_chat: "hello worldhello worldhello worldhello worldhello world",
    date: "2024-06-09T22:45:00",
  },
];

type StateType = {
  contacts: ContactType[];
  activeContact?: ContactType | null;
  expandContacts: boolean;
};

const initialState: StateType = {
  contacts,
  activeContact: null,
  expandContacts: true,
};

const MessagesPage = () => {
  const [state, setState] = useState<StateType>(initialState);

  const toggleContactDisplay = () => {
    setState((prevState) => {
      return { ...prevState, expandContacts: !prevState.expandContacts };
    });
  };

  const MotionArrowLeftRightIcon = motion.create(ArrowLeftRightIcon);
  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [30, 0] }}
      className="w-full h-screen p-5"
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-row p-0 w-full h-full relative">
        <Contacts contacts={contacts} expandContacts={state.expandContacts} />
        <MessageContent>
          <motion.button
            onClick={toggleContactDisplay}
            className="flex items-center gap-3 absolute"
            title={state.expandContacts ? "Shrink" : "Expand"}
            animate={{
              marginLeft:
                state.expandContacts && window.innerWidth < 640
                  ? 260
                  : window.innerWidth < 640
                  ? 15
                  : 0,
            }}
          >
            <MotionArrowLeftRightIcon
              size={25}
              animate={{ rotate: state.expandContacts ? 180 : -180 }}
              transition={{ duration: 0.3 }}
            />
            {state.activeContact && (
              <span className="text-xl font-bold">
                {state.activeContact.name}
              </span>
            )}
          </motion.button>
        </MessageContent>
      </Card>
    </motion.div>
  );
};

export default MessagesPage;
