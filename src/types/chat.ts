export type ConversationState = 
  | "greeting"
  | "asking_budget"
  | "asking_usecase"
  | "asking_usecase_retry"
  | "asking_os"
  | "asking_screensize"
  | "asking_screensize_retry"
  | "asking_storage"
  | "asking_gpu"
  | "showing_recommendations"
  | "done";

export interface UserPreferences {
  budget?: string;
  useCase?: string;
  os?: string;
  screenSize?: string;
  storage?: string;
  gpu?: string;
}
