import { useEffect, useState, memo } from "react";
import { Button } from "./ui/Button";

interface ChatPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const allPrompts = [
  "Tell me about Sahil's experience",
  "What projects has Sahil worked on?",
  "What technologies does Sahil use?",
  "What is Sahil's current role?",
  "Tell me about Sahil's skills",
  "What companies has Sahil worked at?",

  // Portfolio & career
  "What is Sahil currently working on?",
  "What kind of engineer is Sahil?",
  "What problems does Sahil like solving?",
  "What areas is Sahil strongest in?",
  "What is Sahil focusing on learning now?",

  // Projects & work
  "Which project best represents Sahil's work?",
  "What was the motivation behind Sahil's projects?",
  "What technical challenges has Sahil tackled?",
  "What tools or frameworks does Sahil frequently use?",
  "What has Sahil built at work?",

  // Engineering approach
  "How does Sahil approach infrastructure design?",
  "What does Sahil care about in DevOps?",
  "How does Sahil balance speed vs reliability?",
  "What engineering principles does Sahil follow?",
  "What tradeoffs does Sahil often discuss?",

  // Practical / conversational
  "What can you help me with?",
  "Where should I start if I want to explore Sahil's work?",
  "What should I know about Sahil's expertise?",
  "Is Sahil more DevOps or backend focused?",
  "How can I contact Sahil?"
];

function getRandomPrompts(prompts: string[], count: number): string[] {
  const shuffled = [...prompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default memo(function ChatPrompts({ onPromptClick }: ChatPromptsProps) {
  const [randomPrompts, setRandomPrompts] = useState<string[]>([]);

  useEffect(() => {
    setRandomPrompts(getRandomPrompts(allPrompts, 3));
  }, []);

  return (
    <div className="mt-2 flex w-full max-w-[200px] flex-col gap-1.5 sm:mt-3 sm:max-w-[250px] sm:gap-2">
      <p className="text-center text-xs font-medium text-muted-foreground">Try asking:</p>
      <div className="flex flex-col gap-1 sm:gap-1.5">
        {randomPrompts.map((prompt, idx) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="group h-auto min-h-[32px] w-full justify-start whitespace-normal break-words px-2 py-1.5 text-left text-xs leading-normal sm:min-h-[36px] sm:px-3 sm:py-2 rounded-lg border border-primary/20 bg-primary/5 text-foreground hover:bg-primary/15 hover:border-primary/40 transition-all duration-200 ease-out hover:shadow-md hover:shadow-primary/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="line-clamp-2 relative z-10">{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
