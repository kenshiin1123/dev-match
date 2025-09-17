import type { PropsWithChildren } from "react";

const ChatContent: React.FC<PropsWithChildren> = ({ children }) => {
  return <section className="pt-5">{children}</section>;
};

export default ChatContent;
