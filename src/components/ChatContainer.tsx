import { useEffect, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { Message, MessageWithoutId } from "@/types/message";
import { type UserPreferences, type ConversationState } from "@/types/chat";
import { getNextBotResponse } from "@/logic/chatEngine";

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextId, setNextId] = useState<number>(2);

  const [conversationState, setConversationState] = useState<ConversationState>("greeting");
  const [userPreference, setUserPreference] = useState<UserPreferences>({});
  const disabledChatInput = ["asking_budget", "asking_usecase_retry",
    "asking_os", "asking_storage", "asking_gpu"].includes(conversationState); 

  useEffect(() => {
    if (conversationState === "greeting") {
      const response = getNextBotResponse("greeting", "", {});
      setConversationState(response.newState);
      setMessages([{...response.botResponse, id: "1"}]);
      setNextId(2);
    }
  }, [conversationState])

  const addBotMessage = (botMessage: MessageWithoutId) => {
    const messageWithId: Message = {...botMessage, id: nextId.toString()};
    setMessages((prevMessages) => [...prevMessages, messageWithId]);
    setNextId((prev) => prev + 1);
  }

  const handleButtonClick = (choosenButtonValue: string, messageId: string) => {
    setMessages((prevMessages) => 
      prevMessages.map((msg) => 
        msg.id === messageId ? { ...msg, responded: true } : msg
      )
    );
    const response = getNextBotResponse(conversationState, choosenButtonValue, userPreference);
    addBotMessage(response.botResponse);
    setConversationState(response.newState);
    setUserPreference(response.newUserPreferences);
  }
   
  const handleSendMessage = (newMessage: MessageWithoutId) => {
    const response = getNextBotResponse(conversationState, newMessage.text, userPreference);

    setMessages((prevMessages) => [
      ...prevMessages,
      {...newMessage, id: nextId.toString()},
      {...response.botResponse, id: (nextId + 1).toString()}
    ]);

    setNextId((prev) => prev + 2);
    setConversationState(response.newState);
    setUserPreference(response.newUserPreferences);
  }

  const handleReset = () => {
    setConversationState("greeting");
    setMessages([]);
    setUserPreference({});
  }

  return (
    <div className="flex justify-center h-screen bg-background p-4 overflow-hidden">
      <div className="flex flex-col gap-4 max-w-3xl min-w-[40vw] h-[80vh] bg-card overflow-hidden">
        <ChatHeader onReset={handleReset}/>
        <MessageList messages={messages} onButtonClick={handleButtonClick}/>
        <ChatInput disabled={disabledChatInput} onMessageSend={handleSendMessage}/>
      </div>
    </div>
  );

}
