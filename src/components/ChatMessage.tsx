import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/message';
import { LaptopCard } from './LaptopCard';

interface ChatMessageProps {
  message: Message;
  onButtonClick?: (value: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onButtonClick }) => {
  const { text: messageText, isUser = false, timestamp, avatar, name = isUser ? 'You' : 'Bot', buttonOptions } = message;

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className={cn(
          "text-xs",
          isUser ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
        )}>
          {name}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {name}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(timestamp)}
            </span>
          )}
        </div>
        
        <Card className={cn(
          "shadow-sm",
          isUser 
            ? "bg-blue-500 text-white border-blue-600" 
            : "bg-card text-card-foreground border-border"
        )}>
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap break-words">
              {messageText}
            </p>
          </CardContent>
        </Card>
        {buttonOptions && buttonOptions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {buttonOptions.map((button) => (
              <Button 
                key={button.label} 
                onClick={() => onButtonClick?.(button.label)} 
                disabled={message.responded}
                className="flex items-center gap-2"
                variant="outline"
              >
                {button.imageUrl && (
                  <img src={button.imageUrl} alt={button.label} className="w-4 h-4 rounded" />
                )}
                {button.label}
              </Button>
            ))}
          </div>
        )}
        {message.LaptopRecommendations && message.LaptopRecommendations.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.LaptopRecommendations.map((laptop, index) => (
              <LaptopCard key={index} laptop={laptop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
