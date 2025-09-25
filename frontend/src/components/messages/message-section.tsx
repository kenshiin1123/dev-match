import { MessageContext, type ContactType } from "@/pages/messages";
import getAvatarUrl from "@/util/getAvatarUrl";
import { useContext, useEffect, useRef, type PropsWithChildren } from "react";
import MessageBox from "./message-box";
import MessageBubbles from "./message-bubbles";
import { ScrollArea } from "../ui/scroll-area";
import { Settings } from "lucide-react";

const MessageSection: React.FC<
  PropsWithChildren<{ contact: ContactType | null }>
> = ({ children, contact }) => {
  let avatarUrl = "";
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  if (contact) {
    avatarUrl = getAvatarUrl(contact.avatar, contact.avatar_content_type);
  }

  const { messages } = useContext(MessageContext);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="pt-6 max-sm:p-3 max-sm:pt-6 sm:pr-6 flex flex-col py-5 flex-grow w-[75%]">
      {children}
      {contact && (
        <>
          <ScrollArea className="h-0 grow" viewportRef={scrollAreaRef}>
            <header className="flex text-xl sticky top-0 bg-card/90 pb-5">
              <img src={avatarUrl} className="mx-2 size-8 rounded-full" />
              <h1>{contact.name}</h1>
              <button className="ml-auto">
                <Settings />
              </button>
            </header>
            <MessageBubbles />
          </ScrollArea>
          <MessageBox />
        </>
      )}
    </section>
  );
};

export default MessageSection;
