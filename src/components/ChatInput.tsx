import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import type { MessageWithoutId } from "@/types/message";


interface ChatInputProps {
  onMessageSend: (message: MessageWithoutId) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onMessageSend, disabled }) => {

  const [messageText, setMessageText] = useState<string>("");

  const handleSend = () => {
    if (!messageText.trim()) return;
    const message: MessageWithoutId = {
      text: messageText,
      timestamp: Date.now(),
      isUser: true,
    };
    setMessageText("");
    onMessageSend(message);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      if (!disabled && messageText.trim()) {
        handleSend();
      }
    }
  };
  
  return (
    <div className="grid w-full gap-2 p-4 border rounded-md bg-card">
      <Textarea 
        placeholder="Type your message here."
        disabled={disabled}
        value={messageText}
        onChange={(e) => {setMessageText(e.target.value)}}
        onKeyDown={handleKeyDown}
      />
      <Button
        className="justify-self-end"
        variant="outline"
        disabled={disabled || messageText.trim().length === 0}
        onClick={() => {handleSend()}}
      >
        Send
      </Button>
    </div>
  );
}
