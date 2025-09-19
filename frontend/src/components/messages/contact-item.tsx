import getAvatarUrl from "@/util/getAvatarUrl";
import { MessageContext, type ContactType } from "@/pages/messages";
import { motion } from "motion/react";
import { useContext } from "react";

const ContactItem: React.FC<{
  contact: ContactType;
}> = ({ contact }) => {
  const { name, recent_message, avatar, avatar_content_type } = contact;
  const avatarUrl = getAvatarUrl(avatar, avatar_content_type);
  const { handleSetActiveContact } = useContext(MessageContext);

  return (
    <motion.li
      className="flex p-0.5 h-15 items-center cursor-pointer"
      whileHover={{ scale: 0.97 }}
      onClick={() => {
        handleSetActiveContact(contact);
      }}
    >
      <img src={avatarUrl} className="mx-2 size-8 rounded-full" />
      <div>
        <h1 className="truncate w-48">{name}</h1>
        <p className="text-sm opacity-80 truncate w-47">{recent_message}</p>
      </div>
    </motion.li>
  );
};

export default ContactItem;
