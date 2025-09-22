import { useContext } from "react";
import { MessageContext } from "@/pages/messages";

import MessageBubble from "./message-bubble";
import { motion } from "motion/react";

export type MessageType = {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const Messages = () => {
  const { messages, isMobile, expandContacts } = useContext(MessageContext);

  return (
    <motion.ul
      className="mt-5 space-y-3 h-full py-5"
      animate={{
        marginLeft: !isMobile && !expandContacts ? 40 : 0,
        marginRight: !isMobile && !expandContacts ? 40 : 0,
      }}
    >
      {messages.map((message) => {
        return <MessageBubble message={message} key={message.message_id} />;
      })}
    </motion.ul>
  );
};

export default Messages;
