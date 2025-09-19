import type { ContactType } from "@/pages/messages";
import getAvatarUrl from "@/util/getAvatarUrl";
import type { PropsWithChildren } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBox from "./chat-box";

const MessageSection: React.FC<
  PropsWithChildren<{ contact: ContactType | null }>
> = ({ children, contact }) => {
  let avatarUrl = "";

  if (contact) {
    avatarUrl = getAvatarUrl(contact.avatar, contact.avatar_content_type);
  }

  return (
    <section className="pt-6 max-sm:p-3 max-sm:pt-6 sm:pr-6 flex flex-col py-5 flex-grow w-[75%]">
      {children}
      {contact && (
        <>
          <header className="flex text-xl">
            <img src={avatarUrl} className="mx-2 size-8 rounded-full" />
            <h1>{contact.name}</h1>
          </header>
          <ScrollArea className="w-full flex-grow"></ScrollArea>
          <ChatBox />
        </>
      )}
    </section>
  );
};

export default MessageSection;
