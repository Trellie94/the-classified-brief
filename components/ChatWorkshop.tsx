"use client";

import { useState, useRef, useEffect } from "react";
import { Conspiracy } from "@/types/conspiracy";
import ChatMessage from "./ChatMessage";
import SlidePreview from "./SlidePreview";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface Slide {
  slide_number: number;
  title: string;
  talking_points: string[];
  speaker_notes: string;
  suggested_image: string;
}

interface ChatWorkshopProps {
  conspiracy: Conspiracy;
  onSlidesGenerated?: (slides: Slide[]) => void;
}

export default function ChatWorkshop({ conspiracy, onSlidesGenerated }: ChatWorkshopProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send initial message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      handleSendMessage("Let's begin.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (messageContent?: string) => {
    const contentToSend = messageContent || input;
    if (!contentToSend.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: contentToSend,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + " ZULU",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conspiracy: messages.length === 0 ? conspiracy : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  assistantMessage += parsed.text;
                  // Update message in real-time
                  setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.role === "assistant") {
                      return [
                        ...prev.slice(0, -1),
                        { ...lastMessage, content: assistantMessage },
                      ];
                    } else {
                      return [
                        ...prev,
                        {
                          role: "assistant",
                          content: assistantMessage,
                          timestamp: new Date().toLocaleTimeString('en-US', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          }) + " ZULU",
                        },
                      ];
                    }
                  });
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }

        // Check if the message contains a JSON slide outline
        const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          try {
            const slideData = JSON.parse(jsonMatch[1]);
            if (slideData.slides && Array.isArray(slideData.slides)) {
              setSlides(slideData.slides);
              // Notify parent component
              if (onSlidesGenerated) {
                onSlidesGenerated(slideData.slides);
              }
            }
          } catch (e) {
            console.error("Failed to parse slide JSON:", e);
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ TRANSMISSION INTERCEPTED. The Bureau is experiencing technical difficulties. Try again, Agent.",
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }) + " ZULU",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProceedToEvidence = () => {
    // Scroll to evidence fabricator section (will be built in Phase 4)
    const element = document.getElementById("evidence-fabricator");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="chat-workshop"
      className="min-h-screen py-20 px-6 relative z-10"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-impact text-5xl md:text-6xl uppercase text-accent-green mb-4 tracking-wide">
            Workshop Your Bit
          </h2>
          <p className="text-foreground/60 text-sm md:text-base">
            Your handler is ready. Secure channel established.
          </p>
          <div className="mt-4 inline-block px-4 py-2 border border-accent-yellow/50 bg-accent-yellow/10">
            <p className="text-xs font-mono uppercase text-accent-yellow">
              Selected Truth: {conspiracy.title}
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="bg-background/80 border-2 border-accent-green/30 p-6 mb-4 h-[500px] overflow-y-auto"
        >
          {messages.map((message, idx) => (
            <ChatMessage
              key={idx}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}

          {isLoading && (
            <div className="text-center py-4">
              <p className="text-xs text-accent-green font-mono uppercase tracking-widest loading-dots">
                TRANSMISSION INCOMING
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="TYPE YOUR MESSAGE, AGENT..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-background border-2 border-foreground/20 text-foreground font-mono text-sm focus:border-accent-green focus:outline-none transition-colors placeholder:text-foreground/30 disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-8 py-3 bg-accent-green hover:bg-accent-green/80 text-background font-mono font-bold uppercase text-sm tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SEND
          </button>
        </div>

        {/* Slide Preview */}
        {slides && (
          <SlidePreview slides={slides} onProceed={handleProceedToEvidence} />
        )}
      </div>
    </section>
  );
}
