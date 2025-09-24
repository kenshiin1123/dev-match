import { Textarea } from "@/components/ui/textarea";
import { MessageContext } from "@/pages/messages";
import { SendHorizonal } from "lucide-react";
import { useContext, useState, type ChangeEvent } from "react";
const MessageBox = () => {
  const [message, setMessage] = useState<string>("");
  const { handlePostMessage, activeContact } = useContext(MessageContext);

  const handleChatChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setMessage(value);
  };

  const handleSubmit = () => {
    if (!message.length || !activeContact!.user_id) return;
    handlePostMessage(message, activeContact!.user_id);
    setMessage("");
  };

  return (
    <footer className="mt-auto flex gap-3">
      <Textarea
        className="min-h-12 max-h-40 resize-none p-3 shadow-none"
        value={message}
        placeholder="Send message"
        onChange={handleChatChange}
      />
      <button onClick={handleSubmit} className="mt-auto mb-3 active:scale-80">
        <SendHorizonal size={29} />
      </button>
    </footer>
  );
};

export default MessageBox;
