"use client"

import { Send, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { Wordmark } from "@/components/logo";
import { Workflow } from "@/components/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ButterflowWorkflowVisualization } from "@/components/workflow-visualization";
import { cn } from "@/lib/utils";

interface LangChainMessageContent {
  type: "text"
  text: string
}

interface LangChainMessage {
  id?: string
  type: "human" | "ai" | "system" | "tool"
  content: string | LangChainMessageContent[]
  tool_call_id?: string
  complete?: boolean
}

const LandingInput = ({
  onSubmit,
}: {
  onSubmit: (message: string) => void
}) => {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input)
      setInput("")
    }
  }

  return (
    <div className="id flex h-[calc(100vh-70px)] flex-col items-center justify-center bg-gradient-to-tr from-codemod-lime-400/40 via-white to-codemod-lime-400/40 p-4">
      <h1 className="mb-7 text-5xl font-bold">What do you want to build?</h1>
      <h2 className="mb-12 text-lg">Prompt, run, edit, and deploy changes.</h2>
      <div className="rounded-2xl border border-codemod-lime-500/50 bg-white p-2 shadow-2xl">
        <form onSubmit={handleSubmit} className="relative w-96">
          {/* focus-within:scale-105" */}
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Ask Codemod to build..."
            className="min-h-48 resize-none pb-12 pr-12 text-lg"
          />
          <Button
            type="submit"
            size="sm"
            className="group absolute bottom-2 right-2 flex items-center gap-2 "
            disabled={!input.trim()}
          >
            Start building
            <SendHorizontal className="size-4 text-white transition-transform duration-100 group-hover:translate-x-0.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// Chat message component
const Message = ({
  message,
  index,
}: {
  message: LangChainMessage
  index: number
}) => {
  const isAi = message.type === "ai"

  return (
    <div
      className={cn(
        "my-4 w-full items-start space-y-2 px-0",
        isAi ? "pt-4" : "shadow-xs rounded-lg bg-white p-4 dark:bg-white/5"
      )}
    >

      {/* {isAi ? <Logo mode="light" width={16} height={16} /> : ""} */}
      {isAi ? <Wordmark mode="light"  height={12} className="block" /> : ""}
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
  )
}

const ChatInterface = ({
  messages,
  isLoading,
  onSendMessage,
  workflow,
}: {
  messages: LangChainMessage[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  workflow: Workflow | null
}) => {
  const [input, setInput] = useState("")
  const [showMobileView, setShowMobileView] = useState<"chat" | "workflow">(
    "chat"
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  const hasWorkflow = workflow !== null

  // These values control the animation positions and widths
  const leftPaneWidth = hasWorkflow ? "40%" : "min(100%, 800px)"
  const leftPaneTranslate = hasWorkflow ? "0%" : "0%"
  const rightPaneWidth = hasWorkflow ? "60%" : "0%"
  const rightPaneOpacity = hasWorkflow ? 1 : 0
  const rightPaneTranslate = hasWorkflow ? "0%" : "5%"

  return (
    <div className="h-[calc(100vh-70px)] w-full px-0 py-2 md:px-4">
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
            "flex h-full w-96 overflow-hidden",
            hasWorkflow ? "" : "mx-auto",
            showMobileView === "workflow" ? "hidden md:block" : "block"
          )}
        >
          {/* <Card className="flex size-full flex-col overflow-hidden"> */}
            {/* <CardHeader className="pb-0">
              <CardTitle>Chat</CardTitle>
            </CardHeader> */}
            {/* <CardContent className="flex flex-1 flex-col overflow-hidden pb-0"> */}
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-2">
                {messages.map((message, i) => (
                  <Message key={i} message={message} index={i} />
                ))}
                {isLoading && "..."}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    placeholder="Type your message..."
                    className="min-h-[60px] resize-none"
                  />
                  <Button
                    type="submit"
                    disabled={input.trim() === "" || isLoading}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </form>
            {/* </CardContent> */}
          {/* </Card> */}
        </div>

        {/* Right pane - Workflow visualization */}
        <div
          className={cn(
            "flex h-full flex-1 overflow-hidden",
            showMobileView === "chat" ? "hidden md:block" : "block"
          )}
        >
          <Card className="flex size-full flex-col overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Workflow Diagram</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 pt-2">
              {workflow && (
                <ButterflowWorkflowVisualization
                  workflow={{ workflow }}
                  tasks={[]}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function IndexPage() {
  const [messages, setMessages] = useState<LangChainMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const _threadId = useRef(uuid())

  const handleSendMessage = async (content: string) => {
    // Set chat as started
    if (!chatStarted) {
      setChatStarted(true)
    }

    // Add user message to chat
    const userMessage: LangChainMessage = {
      id: uuid(),
      type: "human",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // In a real implementation, this would call the streamWorkflow function
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate AI response
      const aiMessage: LangChainMessage = {
        id: uuid(),
        type: "ai",
        content:
          "I've created a workflow based on your request. You can see it visualized on the right.",
      }

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
      }

      setMessages((prev) => [...prev, aiMessage])
      setWorkflow(mockWorkflow)
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage: LangChainMessage = {
        id: uuid(),
        type: "ai",
        content:
          "Sorry, there was an error processing your request. Please try again.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section>
      {!chatStarted ? (
        <LandingInput onSubmit={handleSendMessage} />
      ) : (
        <div>
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            workflow={workflow}
          />
        </div>
      )}
    </section>
  )
}
