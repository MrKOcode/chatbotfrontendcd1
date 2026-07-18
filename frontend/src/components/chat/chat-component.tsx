import ChatDisplay from "@src/components/chat/chatbox/chat-display";
import ChatInput from "@src/components/chat/chatInput/chat-input";
import React from "react";

const ChatComponent: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      <ChatDisplay />
      <ChatInput />
    </div>
  );
};

export default ChatComponent;
