import type { ContactType } from "@/pages/messages";
import ContactItem from "./contact-item";
import { motion } from "motion/react";

const Contacts: React.FC<{
  contacts: ContactType[];
  expandContacts: boolean;
  handleSetActiveContact: (contact: ContactType) => void;
}> = ({ contacts, expandContacts, handleSetActiveContact }) => {
  return (
    <motion.aside
      className={`h-full rounded-2xl overflow-hidden max-sm:absolute left-0 top-0 bg-primary-foreground z-auto ${
        expandContacts ? "border-r" : ""
      }`}
      animate={{
        width: expandContacts ? 250 : 0,
        opacity: expandContacts ? 1 : 0,
        paddingTop: 25,
      }}
    >
      <h1 className="mb-10 font-bold ml-4">Contacts</h1>
      <ul>
        {contacts.map((contact, i) => (
          <ContactItem
            contact={contact}
            key={i}
            handleSetActiveContact={handleSetActiveContact}
          />
        ))}
      </ul>
    </motion.aside>
  );
};

export default Contacts;
