"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  // Get current time in military format if no timestamp provided
  const displayTime = timestamp || new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + " ZULU";

  return (
    <div className={`mb-6 ${isUser ? "text-right" : "text-left"}`}>
      {/* Timestamp */}
      <div className="text-[10px] text-foreground/30 font-mono uppercase tracking-wider mb-1">
        {displayTime} // {isUser ? "AGENT TRANSMISSION" : "BUREAU DISPATCH"}
      </div>

      {/* Message Bubble */}
      <div
        className={`inline-block max-w-[80%] p-4 text-sm leading-relaxed ${
          isUser
            ? "bg-background border-2 border-foreground/20 text-foreground"
            : "bg-accent-green/10 border-2 border-accent-green/30 text-foreground"
        }`}
      >
        <div className="whitespace-pre-wrap font-mono">{content}</div>
      </div>
    </div>
  );
}
