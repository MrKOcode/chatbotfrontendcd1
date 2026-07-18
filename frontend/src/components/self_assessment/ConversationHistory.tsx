import React, { useState } from "react";
import styles from "./ConversationHistory.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { Message } from "@/redux/store/chat-state";

function ConversationHistory() {
  const [isOpen, setIsOpen] = useState(true);
  const conList = useSelector((state: RootState) => state.chat.conList);
  const allMessages: Message[] = Object.values(conList)
    .flatMap((con) => con.messages.map((msg) => ({ ...msg, conId: con.conId })))
    .sort((a, b) => (a.msgId || "").localeCompare(b.msgId || ""));

  if (!isOpen) return null;

  return (
    <div className={styles.floatingWindow}>
      <div className={styles.headerBar}>
        <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
          ≤ Back
        </button>
        <h1 className={styles.banner}>Conversation History</h1>
      </div>
      <div className={styles.messageContainer}>
        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "ai" ? styles.chatbotMsg : styles.userMsg}
          >
            <div>
              <strong>{msg.role === "ai" ? "Chatbot" : "You"}:</strong>
            </div>
            <div>{msg.msgContent}</div>
            <div className={styles.timestamp}>ID: {msg.msgId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationHistory;
