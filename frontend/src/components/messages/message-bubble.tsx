import getAvatarUrl from "@/util/getAvatarUrl";
import { type MessageType } from "./message-bubbles";
import { MessageContext } from "@/pages/messages";
import { useContext } from "react";
import { useSelector } from "react-redux";

const MessageBubble: React.FC<{ message: MessageType }> = ({ message }) => {
  const { activeContact } = useContext(MessageContext);
  const currentUserId = useSelector((state: any) => state.user.user_id);

  const avatarUrl = getAvatarUrl(
    activeContact?.avatar,
    activeContact?.avatar_content_type
  );

  const isCurrUser = message.sender_id === currentUserId;

  return (
    <li
      key={message.message_id}
      className={`w-fit flex gap-4 items-center ${
        isCurrUser ? "ml-auto" : ""
      } max-w-[70%]`}
    >
      {!isCurrUser && <img src={avatarUrl} className="size-8" />}
      <p className="border rounded bg-secondary px-3 py-2">{message.content}</p>
    </li>
  );
};

export default MessageBubble;
