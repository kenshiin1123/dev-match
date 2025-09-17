import getAvatarUrl from "@/util/getAvatarUrl";
import type { ContactType } from "@/pages/messages";
import { motion } from "motion/react";

const Chat: React.FC<ContactType> = ({
  name,
  avatar,
  avatar_content_type,
  recent_chat,
}) => {
  const avatarUrl = getAvatarUrl(avatar, avatar_content_type);

  return (
    <motion.li
      className="flex p-0.5 h-15 items-center cursor-pointer"
      whileHover={{ scale: 0.97 }}
    >
      <img src={avatarUrl} className="mx-2 size-8 rounded-full" />
      <div>
        <h1>{name}</h1>
        <p className="text-sm opacity-80 truncate w-40">{recent_chat}</p>
      </div>
    </motion.li>
  );
};

export default Chat;
