import type { ConversationState, UserPreferences } from "@/types/chat";
import { type ButtonOptions, type MessageWithoutId } from "@/types/message";
import { type Laptop, laptops } from "@/types/laptops";

export function getNextBotResponse (
  currentState: ConversationState,
  userResponse: string,
  userPreferences: UserPreferences
) : {
  botResponse: MessageWithoutId,
  newState: ConversationState,
  newUserPreferences: UserPreferences
} {
  switch (currentState) {
    case "greeting":
      return createBotResponse(
        "Hi! I'll help you find the perfect laptop. What's your budget?",
        "asking_budget",
        userPreferences,
        [
          { label: "Under 800" },
          { label: "800 - 1500" },
          { label: "Over 1500" },
          { label: "None" },
        ]
      )

    case "asking_budget":
      return createBotResponse(
        "Now that I have your intended budget. Can you explain what your main use case would be?",
        "asking_usecase",
        {...userPreferences, budget: userResponse}
      )

    case "asking_usecase": {
      const parsedUseCase = parseUseCase(userResponse);
      if (!parsedUseCase) {
        return createBotResponse(
          "I couldn't parse your main use case. Please Select one below.",
          "asking_usecase_retry",
          userPreferences,
          [
            { label: "General" },
            { label: "Work" },
            { label: "Media" },
            { label: "Development" },
            { label: "Gaming" }
          ]
        )
      } else {
        return createBotResponse(
          "I'm getting a better idea of your needs. Do you have a preference for the operating system?",
          "asking_os",
          {...userPreferences, useCase: parsedUseCase},
          parsedUseCase === "Gaming"
            ? [{ label: "Windows" }]
            : ["Media", "Development"].includes(parsedUseCase)
            ? [{ label: "MacOS" }, { label: "Windows" }]
            : [{ label: "MacOS" }, { label: "Windows" }, { label: "ChromeOS" }]
        )
      }
    }

    case "asking_usecase_retry":
        return createBotResponse(
          "I'm getting a better idea of your needs. Do you have a preference for the operating system?",
          "asking_os",
          {...userPreferences, useCase: userResponse},
          userResponse === "Gaming"
            ? [{ label: "Windows" }]
            : ["Media", "Development"].includes(userResponse)
            ? [{ label: "MacOS" }, { label: "Windows" }]
            : [{ label: "MacOS" }, { label: "Windows" }, { label: "ChromeOS" }]
        )

    case "asking_os":
      return createBotResponse(
        "Do you have a preference in screen size? Please specify your ideal screen size in inches or N/A for no preference.",
        "asking_screensize",
        {...userPreferences, os: userResponse}
      )

    case "asking_screensize": {
      const parsedScreenSize = parseScreenSize(userResponse);

      if (!parsedScreenSize) {
        return createBotResponse(
          "I wasn't able to parse your screen size. Please specify a screen size in inches between 11 and 18 or N/A.",
          "asking_screensize_retry",
          userPreferences
        )
      } else {
        return createBotResponse(
          "How much storage do you need",
          userPreferences.os === "Windows" ? "asking_storage" : "showing_recommendations",
          {...userPreferences, screenSize: userResponse},
          [
            { label: "Under 512 GB"},
            { label: "512 GB - 1.5TB"},
            { label: "1.5TB+"}
          ]
        )
      }
    }

    case "asking_screensize_retry": {
      const parsedScreenSize = parseScreenSize(userResponse);

      return createBotResponse(
        parsedScreenSize ? "How much storage do you need" 
          : "Failed parsing screen size again, defaulting to no preference. How much storage do you need?",
        userPreferences.os === "Windows" ? "asking_storage" : "showing_recommendations",
        {...userPreferences, screenSize: parsedScreenSize ? parsedScreenSize : "n/a"},
        [
          { label: "Under 512 GB"},
          { label: "512 GB - 1.5TB"},
          { label: "1.5TB+"}
        ]
      )
    }

    case "asking_storage":
      return createBotResponse(
        "Do you want a discrete GPU? If so choose one of choices below.",
        userPreferences.os === "Windows" ? "asking_gpu" : "showing_recommendations",
        {...userPreferences, storage: userResponse},
        [
          { label: "RTX 4050" },
          { label: "RTX 4060" },
          { label: "RTX 4070" },
          { label: "Any" }
        ]
      )

    case "asking_gpu": {
      const recommended_laptops = filterLaptops({...userPreferences, gpu: userResponse});
      return {
        botResponse: {
          timestamp: Date.now(),
          text: `Found ${recommended_laptops.length} laptop recommendations. Send another message to restart the chat.`,
          isUser: false,
          LaptopRecommendations: recommended_laptops,
        },
        newState: "done",
        newUserPreferences: {...userPreferences, gpu: userResponse}
      }
    }

    case "showing_recommendations": {
      const recommended_laptops = filterLaptops(userPreferences);
      return {
        botResponse: {
          timestamp: Date.now(),
          text: `Found ${recommended_laptops.length} laptop recommendations. Send another message to restart the chat.`,
          isUser: false,
          LaptopRecommendations: recommended_laptops,
        },
        newState: "done",
        newUserPreferences: userPreferences
      }
    }
    case "done":
      return createBotResponse("Laptop recommendation is complete. Restarting chat.", "greeting", {});
    default:
      return createBotResponse("Internal Server Error: Restarting Chat", "greeting", {});
  }
}

function createBotResponse(
  text: string,
  nextState: ConversationState, 
  newUserPreferences: UserPreferences,
  buttonOptions?: ButtonOptions[]
) : {
  botResponse: MessageWithoutId,
  newState: ConversationState,
  newUserPreferences: UserPreferences
} {
  return {
    botResponse: {
      timestamp: Date.now(),
      text: text,
      isUser: false,
      buttonOptions: buttonOptions ? buttonOptions : undefined,
    },
    newState: nextState,
    newUserPreferences: newUserPreferences
  }
}

function parseUseCase(userInput: string): string | null {
  const sanitizedInput = userInput.toLowerCase();

  const keywordMap: Record<string, string[]> = {
    Gaming: ["game", "gaming", "video games"],
    General: ["school", "homework", "student", "college", "uni", "general", "day", "watch"],
    Work: ["office", "job", "work"],
    Development: ["code", "dev", "program", "coding"],
    Media: ["video", "media", "edit", "photo", "rendering"],
  };

  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => sanitizedInput.includes(keyword))) {
      return category;
    }
  }

  return null;
}

function parseScreenSize(userInput: string): string | null {
  const sanitizedInput = userInput.toLowerCase();
  if ((["na", "n/a"]).some(e => sanitizedInput.includes(e))) return "n/a";

  const match = userInput.match(/(\d+)/);
  if (!match) return null;
  
  const size = parseInt(match[1]);
  if (size < 11 || size > 18) return null;

  return size.toString();
}

function filterLaptops(userPreferences: UserPreferences): Laptop[] {
  console.log(userPreferences);
   return laptops.filter(laptop => {
    if (userPreferences.budget && userPreferences.budget !== "None") {
      if (userPreferences.budget === "Under 800" && laptop.price >= 800) return false;
      if (userPreferences.budget === "800 - 1500" && (laptop.price < 800 || laptop.price > 1500)) return false;
      if (userPreferences.budget === "Over 1500" && laptop.price <= 1500) return false;
    }

    if (userPreferences.useCase && !laptop.useCase.includes(userPreferences.useCase)) return false;

    if (userPreferences.os && laptop.os !== userPreferences.os) return false;

    if (userPreferences.screenSize && userPreferences.screenSize !== "n/a") {
      const preferredSize = parseInt(userPreferences.screenSize);
      if (Math.abs(laptop.screenSize - preferredSize) > 1) return false;
    }

    if (userPreferences.storage) {
      if (userPreferences.storage === "Under 512 GB" && laptop.storage >= 512) return false;
      if (userPreferences.storage === "512 GB - 1.5TB" && (laptop.storage < 512 || laptop.storage >= 1536)) return false;
      if (userPreferences.storage === "1.5TB+" && laptop.storage < 1536) return false;
    }

    if (userPreferences.gpu && userPreferences.gpu !== "Any") {
      if (!laptop.gpu) return false; 
      if (userPreferences.gpu === "RTX 4050" && !laptop.gpu.includes("4050")) return false;
      if (userPreferences.gpu === "RTX 4060" && !laptop.gpu.includes("4060")) return false;
      if (userPreferences.gpu === "RTX 4070" && !laptop.gpu.includes("4070")) return false;
    }

    return true;
  });
}
