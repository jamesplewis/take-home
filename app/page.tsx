"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { v4 as uuid } from "uuid";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Wordmark } from "@/components/logo";

import { LandingPage } from "./landing-page";

interface LangChainMessage {
  id?: string;
  type: "human" | "ai" | "system" | "tool";
  content: string;
}

const LandingInput = ({
  onSubmit,
  isProcessing,
  submittedPrompt,
}: {
  onSubmit: (message: string) => void;
  isProcessing: boolean;
  submittedPrompt: string;
}) => {
  const [input, setInput] = useState("Build a landing page like google.com");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      const input = inputRef.current;
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  }, [isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput("");
    }
  };

  return (
    <div className="relative h-[calc(100vh-70px)] overflow-hidden bg-gradient-to-tr from-codemod-lime-400/40 via-white to-codemod-lime-400/40">
      {/* Heading Section */}
      <AnimatePresence>
        {!isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-x-0 top-[20%] mx-2 flex -translate-y-1/2 flex-col items-center text-center"
          >
            <h1 className="mb-7 text-5xl font-bold">
              What do you want to build?
            </h1>
            <h2 className="mb-12 text-lg">
              Prompt, run, edit, and deploy changes.
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Box */}
      <motion.div
        initial={{ x: "-50%", y: "-50%", top: "65%", opacity: 0 }}
        animate={{
          x: "-50%",
          y: "-50%",
          top: isProcessing ? "25%" : "60%",
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0 }}
        whileHover={{ y: "-52%" }}
        className="absolute left-1/2 z-10 rounded-2xl border border-codemod-lime-500/50 bg-gradient-to-tr from-codemod-lime-100 to-white p-2 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="relative w-96">
          <Textarea
            ref={inputRef}
            value={isProcessing ? submittedPrompt : input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Ask Codemod to build..."
            className="min-h-48 resize-none  bg-white pb-12 pr-12 text-lg"
            disabled={isProcessing}
          />
          {!isProcessing && (
            <Button
              type="submit"
              size="sm"
              className="group absolute bottom-2 right-2 flex items-center gap-2 "
              disabled={!input.trim()}
            >
              Start building
              <SendHorizontal className="size-4 text-white transition-transform duration-100 group-hover:translate-x-0.5" />
            </Button>
          )}
        </form>
      </motion.div>

      {/* Processing Message */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center"
          >
            <div className="max-w-2xl rounded-lg border border-codemod-lime-500/30 bg-white p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="size-6 rounded-full border-2 border-codemod-lime-500 border-t-transparent"
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Understanding your request...
                  </h3>
                  <p className="text-gray-600">
                    Based on your request, you&apos;ve asked me to create a
                    landing page like google.com. I&apos;ll set up a new
                    project.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Chat message component
const Message = ({
  message,
  index,
}: {
  message: LangChainMessage;
  index: number;
}) => {
  const isAi = message.type === "ai";

  return (
    <div
      className={cn(
        " mb-2 w-full items-start space-y-2 px-0",
        isAi
          ? "ml-2 pt-4"
          : "shadow-xs rounded-lg border border-codemod-gray-100 bg-white p-4 dark:bg-white/5"
      )}
    >
      <div className="space-y-2">
        {isAi ? <Wordmark mode="light" height={12} className="block" /> : ""}
        <p className="whitespace-pre-wrap text-sm/6">{message.content}</p>
      </div>
    </div>
  );
};

const ChatInterface = ({
  messages,
  isLoading,
  onSendMessage,
  isVisible,
}: {
  messages: LangChainMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  isVisible: boolean;
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
      className="h-[calc(100vh-70px)] w-full px-0 py-2 md:px-2"
    >
      {/* Main two-pane layout container */}
      <div className="h-calc(100%-40px)] relative flex w-full flex-row gap-x-2 md:h-full">
        {/* Left pane - Chat */}
        <div
          className={cn("relative flex h-full w-96 overflow-hidden", "mx-auto")}
        >
          <div className="flex-1 overflow-y-auto ">
            {messages.map((message, i) => (
              <Message key={i} message={message} index={i} />
            ))}
            {isLoading && (
              <div className="ml-2 mt-2 flex items-center gap-x-2">
                <div className="shrink-0">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="size-4 rounded-full border-2 border-codemod-lime-500 border-t-transparent"
                  />
                </div>
                <p className="text-sm">Building...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="absolute bottom-0 w-full">
            <div className="">
              <Textarea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
                placeholder="What shall we build next?"
                className=" min-h-48 resize-none pb-12 pr-12 text-lg"
              />
              <Button
                type="submit"
                size="sm"
                className="group absolute bottom-2 right-4 flex items-center gap-2 "
                disabled={!input.trim()}
              >
                <SendHorizontal className="size-4 text-white transition-transform duration-100 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </form>
        </div>

        <div className="flex h-full flex-1 overflow-hidden">
          <Card className="flex size-full flex-col overflow-hidden">
            <CardContent className="flex-1 p-0 pt-2">
              {isLoading ? (
                <div className="flex size-full items-center justify-center">
                  <p>Loading...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="h-full"
                >
                  <LandingPage />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default function IndexPage() {
  const [messages, setMessages] = useState<LangChainMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [submittedPrompt, setSubmittedPrompt] = useState("");

  const handleSendMessage = async (content: string) => {
    // Store the submitted prompt
    setSubmittedPrompt(content);

    // Start processing animation
    setIsProcessing(true);

    // Wait for processing message to show (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Set chat as started and show chat interface
    setChatStarted(true);
    setShowChatInterface(true);

    // Add user message to chat
    const userMessage: LangChainMessage = {
      id: uuid(),
      type: "human",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // In a real implementation, this would call the streamWorkflow function
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Simulate AI response
      const aiMessage: LangChainMessage = {
        id: uuid(),
        type: "ai",
        content:
          "I've created a landing page based on your request. You can see it visualised on the right.",
      };

      // Simulate workflow data (in real implementation, this would come from the streamWorkflow function)
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: LangChainMessage = {
        id: uuid(),
        type: "ai",
        content:
          "Sorry, there was an error processing your request. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative">
      {/* Landing screen with processing state */}
      <AnimatePresence>
        {!chatStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingInput
              onSubmit={handleSendMessage}
              isProcessing={isProcessing}
              submittedPrompt={submittedPrompt}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface - slides up from bottom */}
      {chatStarted && (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          isVisible={showChatInterface}
        />
      )}
    </section>
  );
}
