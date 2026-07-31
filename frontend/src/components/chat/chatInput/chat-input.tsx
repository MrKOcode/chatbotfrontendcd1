import React, { useRef, useState } from "react";
import { AutosizeTextarea } from "@/components/chat/ui/autosize-textarea";
import { Button } from "@/components/chat/ui/button";
import { Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "@/redux/api/chat-state-api";
import type { AppDispatch, RootState } from "@/redux/store/store";
import type { AutosizeTextAreaRef } from "@/components/chat/ui/autosize-textarea";

export default function ChatInput() {
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConId,
  );
  const inputRef = useRef<AutosizeTextAreaRef>(null);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  
  const resetInput = (): void => {
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.textArea.value = "";
    }
  };
  
  const submitMessage = (): void => {
    const messageText = inputRef.current?.textArea.value;
    if (messageText && messageText !== "") {
      console.log("Dispatching sendMessage thunk");
      dispatch(sendMessage(currentConversationId, messageText));
      resetInput();
    }
  };
  
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(event.target.value);
  };

  return (
    <div className="campus-composer-dock">
      <div className="campus-composer-wrap">
          <div className="campus-composer">
            <AutosizeTextarea
              className="campus-composer-input"
              placeholder="Ask anything over a cup of coffee..."
              ref={inputRef}
              minHeight={48}
              maxHeight={160}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
            <Button onClick={submitMessage} className="campus-send-button" aria-label="Send message">
              <Send size={17} /> <span>Send</span>
            </Button>
          </div>
          <p className="campus-composer-note">Enter to send · Shift + Enter for a new line</p>
      </div>
    </div>
  );
}
