import React, { useRef, useEffect } from "react";
import type { Message } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";


interface MessageListProps {
  messages: Message[];
  onButtonClick: (value: string, messageId: string) => void;
}

/**
 * Displays chat message history with auto-scroll
 * Uses radix scrollarea viewport to scroll within container
 */
export const MessageList: React.FC<MessageListProps> = ({ messages, onButtonClick}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 border rounded-md">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onButtonClick={(value) => onButtonClick?.(value, message.id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );

}
