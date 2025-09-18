import type { ContactType } from "@/pages/messages";
import getAvatarUrl from "@/util/getAvatarUrl";
import type { PropsWithChildren } from "react";

const MessageSection: React.FC<
  PropsWithChildren<{ contact: ContactType | null }>
> = ({ children, contact }) => {
  let avatarUrl = "";

  if (contact) {
    avatarUrl = getAvatarUrl(contact.avatar, contact.avatar_content_type);
  }

  return (
    <section className="pt-6">
      {children}
      {contact && (
        <>
          <header className="flex text-xl">
            <img src={avatarUrl} className="mx-2 size-8 rounded-full" />
            <h1>{contact.name}</h1>
          </header>
          <footer></footer>
        </>
      )}
    </section>
  );
};

export default MessageSection;
