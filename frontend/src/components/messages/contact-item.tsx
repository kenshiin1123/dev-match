import { MessageContext, type ContactType } from "@/pages/messages";
import getCloudinaryImage from "@/util/getCloudinaryImage";
import { motion } from "motion/react";
import { useContext } from "react";

const ContactItem: React.FC<{
  contact: ContactType;
}> = ({ contact }) => {
  const { name, recent_message, avatar } = contact;
  const { handleSetActiveContact } = useContext(MessageContext);

  return (
    <motion.li
      className="flex p-0.5 h-15 items-center cursor-pointer"
      whileHover={{ scale: 0.97 }}
      onClick={() => {
        handleSetActiveContact(contact);
      }}
    >
      <img
        src={
          avatar
            ? getCloudinaryImage(avatar, { w: 80, h: 80 })
            : "images/default_pic.png"
        }
        className="mx-2 size-8 rounded-full"
      />
      <div>
        <h1 className="truncate w-48">{name}</h1>
        <p className="text-sm opacity-80 truncate w-47">{recent_message}</p>
      </div>
    </motion.li>
  );
};

export default ContactItem;
