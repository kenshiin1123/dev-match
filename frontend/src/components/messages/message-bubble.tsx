import getAvatarUrl from "@/util/getAvatarUrl";
import { type MessageType } from "./message-bubbles";
import { MessageContext } from "@/pages/messages";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format, formatDistance } from "date-fns";

const MessageBubble: React.FC<{ message: MessageType }> = ({ message }) => {
  const { activeContact } = useContext(MessageContext);
  const currentUserId = useSelector((state: any) => state.user.user_id);
  const [time, setTime] = useState(new Date());
  const avatarUrl = getAvatarUrl(
    activeContact?.avatar,
    activeContact?.avatar_content_type
  );
  const isCurrUser = message.sender_id === currentUserId;
  const isOlderThenOneDay =
    time.getTime() - new Date(message.created_at).getTime() >
    24 * 60 * 60 * 1000;

  useEffect(() => {
    // Only use timed re-render when its not older than a day.
    if (isOlderThenOneDay) return;

    const interval = setInterval(() => {
      setTime(new Date());
    }, 60_000); // every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <li
      className={`w-fit flex gap-4 items-center ${
        isCurrUser ? "ml-auto" : ""
      } max-w-[70%]`}
    >
      {!isCurrUser && (
        <img src={avatarUrl ?? "/default-avatar.png"} className="size-8" />
      )}
      <div className="w-full flex flex-col">
        <p
          className={`border rounded bg-secondary px-3 py-2 w-fit ${
            isCurrUser ? "ml-auto" : "mr-auto"
          }`}
        >
          {message.content}
        </p>
        <small
          className={`text-muted-foreground text-xs mt-1 ${
            isCurrUser ? "ml-auto mr-1" : "mr-auto ml-1"
          }`}
        >
          {/* Time > Day && Use format instead of formatDistance */}
          {isOlderThenOneDay
            ? format(new Date(message.created_at), "PPpp")
            : formatDistance(new Date(message.created_at), time, {
                includeSeconds: true,
              })}
        </small>
      </div>
    </li>
  );
};

export default MessageBubble;
