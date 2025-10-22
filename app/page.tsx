"use client";

/**
 * DEVELOPMENT MODE INSTRUCTIONS:
 * ===============================
 * To work on styling for specific stages, scroll down to line ~325 and change DEV_STAGE:
 *
 * const DEV_STAGE: 1 | 2 | 3 | null = 1  // Change this number!
 *
 * Stage 1: Initial landing page with centered prompt
 * Stage 2: Processing state (prompt moved up, showing "Understanding your request...")
 * Stage 3: Chat interface with messages and workflow visualization
 * null: Normal flow with animations (default)
 */
import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { v4 as uuid } from "uuid";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Wordmark } from "@/components/logo";
import { Workflow } from "@/components/types";

interface LangChainMessageContent {
  type: "text";
  text: string;
}

interface LangChainMessage {
  id?: string;
  type: "human" | "ai" | "system" | "tool";
  content: string | LangChainMessageContent[];
  tool_call_id?: string;
  complete?: boolean;
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
        className="absolute left-1/2 z-10 rounded-2xl border border-codemod-lime-500/50 bg-white p-2 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="relative w-96">
          <Textarea
            ref={inputRef}
            value={isProcessing ? submittedPrompt : input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Ask Codemod to build..."
            className="min-h-48 resize-none pb-12 pr-12 text-lg"
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
        " w-full items-start space-y-2 px-0",
        isAi
          ? "pt-4"
          : "shadow-xs rounded-lg border border-codemod-gray-100 bg-white p-4 dark:bg-white/5"
      )}
    >
      {isAi ? <Wordmark mode="light" height={12} className="block" /> : ""}
      <div className="whitespace-pre-wrap text-sm/6">
        {typeof message.content === "string" ? (
          <p className="whitespace-pre-wrap text-sm/6">{message.content}</p>
        ) : (
          <p className="whitespace-pre-wrap text-sm">
            {message.content.map((c) => c.text).join("")}
          </p>
        )}
      </div>
    </div>
  );
};

const ChatInterface = ({
  messages,
  isLoading,
  onSendMessage,
  workflow,
  isVisible,
}: {
  messages: LangChainMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  workflow: Workflow | null;
  isVisible: boolean;
}) => {
  const [input, setInput] = useState("");
  const [showMobileView, setShowMobileView] = useState<"chat" | "workflow">(
    "chat"
  );
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

  const hasWorkflow = workflow !== null;

  // These values control the animation positions and widths
  const leftPaneWidth = hasWorkflow ? "40%" : "min(100%, 800px)";
  const leftPaneTranslate = hasWorkflow ? "0%" : "0%";
  const rightPaneWidth = hasWorkflow ? "60%" : "0%";
  const rightPaneOpacity = hasWorkflow ? 1 : 0;
  const rightPaneTranslate = hasWorkflow ? "0%" : "5%";

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut", delay: 0.2 }}
      className="h-[calc(100vh-70px)] w-full px-0 py-2 md:px-4"
    >
      {/* Mobile Toggle - Only on mobile */}
      <div className="mb-2 flex md:hidden">
        <Button
          variant={showMobileView === "chat" ? "default" : "outline"}
          onClick={() => setShowMobileView("chat")}
          className="flex-1 rounded-none"
        >
          Chat
        </Button>
        <Button
          variant={showMobileView === "workflow" ? "default" : "outline"}
          onClick={() => setShowMobileView("workflow")}
          className="flex-1 rounded-none"
          disabled={!hasWorkflow}
        >
          Workflow
          {hasWorkflow && <Badge className="ml-2">1</Badge>}
        </Button>
      </div>

      {/* Main two-pane layout container */}
      <div className="h-calc(100%-40px)] relative flex w-full flex-row gap-x-3 md:h-full">
        {/* Left pane - Chat */}
        <div
          className={cn(
            "relative flex h-full w-96 overflow-hidden",
            hasWorkflow ? "" : "mx-auto",
            showMobileView === "workflow" ? "hidden md:block" : "block"
          )}
        >
          <div className="flex-1 overflow-y-auto px-2">
            {messages.map((message, i) => (
              <Message key={i} message={message} index={i} />
            ))}
            {isLoading && "..."}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="absolute bottom-0 w-full">
            <div className="mx-2">
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

        {/* Right pane - Workflow visualization */}
        <div
          className={cn(
            "flex h-full flex-1 overflow-hidden ",
            showMobileView === "chat" ? "hidden md:block" : "block"
          )}
        >
          <Card className="flex size-full flex-col overflow-hidden">
            <CardContent className="flex-1 p-0 pt-2">
              <div className="flex size-full flex-col items-center justify-center bg-white px-4">
                {/* Google-like Landing Page */}
                <div className="flex size-full flex-col items-center justify-center py-12">
                  {/* Logo Area */}
                  <div className="mb-12 flex flex-col items-center gap-8">
                    <div className="text-6xl font-bold tracking-tight">
                      <span className="text-blue-500">G</span>
                      <span className="text-red-500">o</span>
                      <span className="text-yellow-500">o</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-green-500">l</span>
                      <span className="text-red-500">e</span>
                    </div>
                  </div>

                  {/* Search Box */}
                  <div className="mb-8 w-full max-w-2xl">
                    <div className="flex rounded-full border border-gray-300 bg-white px-6 py-3 shadow-sm transition-shadow hover:shadow-md">
                      <input
                        type="text"
                        placeholder="Search the web..."
                        className="flex-1 text-base text-gray-900 outline-none placeholder:text-gray-500"
                      />
                      <svg
                        className="size-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center gap-4">
                    <button className="rounded-md bg-gray-100 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-200">
                      Google Search
                    </button>
                    <button className="rounded-md bg-gray-100 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-200">
                      I&apos;m Feeling Lucky
                    </button>
                  </div>

                  {/* Suggestions */}
                  <div className="mt-12 text-center text-sm text-gray-600">
                    <p className="mb-3">Popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
                        React tips
                      </button>
                      <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
                        TypeScript
                      </button>
                      <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
                        Web design
                      </button>
                      <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
                        JavaScript
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default function IndexPage() {
  // ============================================================
  // DEVELOPMENT MODE: Set this to control which stage to display
  // Stage 1: Initial landing page
  // Stage 2: Processing (prompt submitted, showing processing message)
  // Stage 3: Chat interface visible
  // Set to null for normal flow
  const DEV_STAGE: 1 | 2 | 3 | null = null;
  // ============================================================

  const [messages, setMessages] = useState<LangChainMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(DEV_STAGE === 3);
  const [isProcessing, setIsProcessing] = useState(DEV_STAGE === 2);
  const [showChatInterface, setShowChatInterface] = useState(DEV_STAGE === 3);
  const [submittedPrompt, setSubmittedPrompt] = useState(
    DEV_STAGE === 2 || DEV_STAGE === 3
      ? "Build me a todo app with React and TypeScript"
      : ""
  );
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const _threadId = useRef(uuid());

  // Set up mock data for dev stages
  useEffect(() => {
    if (DEV_STAGE === 3) {
      // Add some mock messages for stage 3
      const mockMessages: LangChainMessage[] = [
        {
          id: uuid(),
          type: "human",
          content: "Build me a todo app with React and TypeScript",
        },
        {
          id: uuid(),
          type: "ai",
          content:
            "I've created a workflow based on your request. You can see it visualized on the right.",
        },
      ];
      setMessages(mockMessages);

      // Set mock workflow
      const mockWorkflow: Workflow = {
        version: "1.0",
        nodes: [
          {
            id: "start",
            name: "Start Node",
            type: "automatic",
            steps: [],
          },
          {
            id: "process",
            name: "Process Data",
            type: "automatic",
            depends_on: ["start"],
            steps: [],
          },
          {
            id: "decision",
            name: "Make Decision",
            type: "manual",
            depends_on: ["process"],
            steps: [],
          },
          {
            id: "success",
            name: "Success Path",
            type: "automatic",
            depends_on: ["decision"],
            steps: [],
          },
          {
            id: "failure",
            name: "Failure Path",
            type: "automatic",
            depends_on: ["decision"],
            steps: [],
          },
          {
            id: "end",
            name: "End Node",
            type: "automatic",
            depends_on: ["success", "failure"],
            steps: [],
          },
        ],
      };
      setWorkflow(mockWorkflow);
    }
  }, [DEV_STAGE]);

  const handleSendMessage = async (content: string) => {
    // Skip animation flow if in dev stage mode
    if (DEV_STAGE !== null) {
      return;
    }

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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate AI response
      const aiMessage: LangChainMessage = {
        id: uuid(),
        type: "ai",
        content:
          "I've created a workflow based on your request. You can see it visualised on the right.",
      };

      // Simulate workflow data (in real implementation, this would come from the streamWorkflow function)
      const mockWorkflow: Workflow = {
        version: "1.0",
        nodes: [
          {
            id: "start",
            name: "Start Node",
            type: "automatic",
            steps: [],
          },
          {
            id: "process",
            name: "Process Data",
            type: "automatic",
            depends_on: ["start"],
            steps: [],
          },
          {
            id: "decision",
            name: "Make Decision",
            type: "manual",
            depends_on: ["process"],
            steps: [],
          },
          {
            id: "success",
            name: "Success Path",
            type: "automatic",
            depends_on: ["decision"],
            steps: [],
          },
          {
            id: "failure",
            name: "Failure Path",
            type: "automatic",
            depends_on: ["decision"],
            steps: [],
          },
          {
            id: "end",
            name: "End Node",
            type: "automatic",
            depends_on: ["success", "failure"],
            steps: [],
          },
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setWorkflow(mockWorkflow);
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
          workflow={workflow}
          isVisible={showChatInterface}
        />
      )}
    </section>
  );
}
