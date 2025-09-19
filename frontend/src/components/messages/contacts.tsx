import { MessageContext } from "@/pages/messages";
import ContactItem from "./contact-item";
import { motion } from "motion/react";
import { ScrollArea } from "../ui/scroll-area";
import { useContext } from "react";

const Contacts = () => {
  const { contacts, expandContacts } = useContext(MessageContext);

  return (
    <motion.aside
      className={`h-full rounded-2xl overflow-hidden max-sm:absolute left-0 top-0 bg-primary-foreground z-auto ${
        expandContacts ? "border-r" : ""
      }`}
      animate={{
        width: expandContacts ? 250 : 0,
        opacity: expandContacts ? 1 : 0,
      }}
    >
      <ScrollArea className="h-full pt-5">
        <h1 className="mb-10 font-bold ml-4">Contacts</h1>
        <ul>
          {contacts.map((contact, i) => (
            <ContactItem contact={contact} key={i} />
          ))}
        </ul>
      </ScrollArea>
    </motion.aside>
  );
};

export default Contacts;
