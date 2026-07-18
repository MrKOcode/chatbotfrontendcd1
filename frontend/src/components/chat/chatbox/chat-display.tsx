import React, { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useSelector } from "react-redux";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "@src/components/chat/ui/chat-bubble";
import { ChatMessageList } from "@src/components/chat/ui/chat-message-list";
import type { RootState } from "@src/redux/store/store";
import type { Message } from "@src/redux/store/chat-state";
import "katex/dist/katex.min.css";

export default function ChatDisplay() {
  const conversationId = useSelector(
    (state: RootState) => state.chat.currentConId,
  );
console.log("Current conversation ID:", conversationId) 

  const messageLog =
    useSelector((state: RootState) => state.chat.conList[conversationId]) ||
    null;
  console.log("Message Log:", messageLog);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const messageDisplay = (message: Message) => {
    return (
      <ChatBubbleMessage>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {message.msgContent}
        </ReactMarkdown>
      </ChatBubbleMessage>
    );
  };

  const displayConverationContent = useMemo(() => {
    if (!messageLog) {
      return [];
    }
    return messageLog.messages.map((message: Message, index) => {
      const variant = message.role === "send" ? "sent" : "received";
      return (
        <ChatBubble key={index} variant={variant}>
          {messageDisplay(message)}
        </ChatBubble>
      );
    });
  }, [messageLog]);

  useEffect(() => {
    const offset = 20;
    const topPosition =
      (endOfMessagesRef.current?.getBoundingClientRect().top || 0) +
      ((chatContainerRef.current?.scrollTop || 0) - offset);
    chatContainerRef.current?.scrollTo({
      top: topPosition,
      behavior: "smooth",
    });
  }, [displayConverationContent]);

  return (
    <div className="h-screen w-full ">
      <ChatMessageList ref={chatContainerRef}>
        {displayConverationContent}
        <div className="min-h-screen" />
      </ChatMessageList>
    </div>
  );
}
