import { type Laptop } from "./laptops"; 

export interface MessageWithoutId {
  text: string;
  isUser?: boolean;
  timestamp?: number;
  avatar?: string;
  name?: string;
  responded?: boolean;
  selectedButton?: string;
  buttonOptions?: ButtonOptions[];
  LaptopRecommendations?: Laptop[];
}

export interface Message extends MessageWithoutId {
  id: string;
} 

export interface ButtonOptions {
  label: string;
  imageUrl?: string;
}
