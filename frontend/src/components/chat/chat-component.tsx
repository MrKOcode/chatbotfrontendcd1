import ChatDisplay from "@src/components/chat/chatbox/chat-display";
import ChatInput from "@src/components/chat/chatInput/chat-input";
import React from "react";
import { Coffee, Sparkles } from "lucide-react";

const ChatComponent: React.FC = () => {
  return (
    <div className="campus-chat-shell">
      <header className="campus-chat-header">
        <div className="campus-chat-heading">
          <span className="campus-chat-heading-icon"><Coffee size={18} /></span>
          <div>
            <h1>Study Break Chat</h1>
            <p><Sparkles size={12} /> Your AI companion is ready</p>
          </div>
        </div>
      </header>
      <div className="campus-chat-body">
        <ChatDisplay />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatComponent;
