import React from "react";
import { Button } from "./ui/button";


interface ChatHeaderProps {
  onReset: () => void; 
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onReset }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md">
      <h2 className="font-bold">Laptop Recommendation Bot</h2>
      <Button size="sm" variant="outline" onClick={() => onReset()}>reset</Button>
    </div>
  );
}
