'use client'

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RiMessage3Line, RiCloseLine, RiSendPlane2Line, RiCustomerService2Line } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean }>>([
    { id: 'welcome-1', text: 'Hello! 👋 Welcome to TAC Infrastructure.', isUser: false },
    { id: 'welcome-2', text: 'I can help you track a shipment, view rate cards, or connect with our logistics team.', isUser: false },
  ])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    const userMsgId = `user-${Date.now()}`
    setMessages(prev => [...prev, { id: userMsgId, text: trimmedMessage, isUser: true }])
    setMessage('')

    // Simulate bot response with cleanup
    timeoutRef.current = setTimeout(() => {
      const botMsgId = `bot-${Date.now()}`
      setMessages(prev => [...prev, {
        id: botMsgId,
        text: 'Thank you for your message. Our team will respond shortly.',
        isUser: false
      }])
    }, 1000)
  }, [message])

  // Cleanup timeout on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <div id="chat-widget-panel" className="glass-card w-[320px] sm:w-[380px] overflow-hidden border border-white/10 shadow-elevation-2 rounded-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b border-white/5 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-2 w-2 absolute -right-0.5 -bottom-0.5 bg-success rounded-full ring-2 ring-background animate-pulse" />
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-white/10">
                      <RiCustomerService2Line className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">TAC Support</h3>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Online • Avg 2m Reply</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <RiCloseLine className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {/* Chat Area */}
              <div className="bg-background/60 backdrop-blur-xl h-[350px] flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="flex flex-col gap-4" role="log" aria-live="polite" aria-label="Chat messages">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.isUser
                            ? 'self-end rounded-tr-none bg-primary/20 border border-primary/20 text-foreground'
                            : 'self-start rounded-tl-none bg-secondary/50 border border-white/5 text-foreground/90'
                          }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-md">
                  <form className="relative flex items-center" onSubmit={handleSubmit}>
                    <Input
                      placeholder="Type your query..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pr-12 bg-background/50 border-white/10 focus-visible:ring-primary/50 h-11 rounded-xl"
                      aria-label="Chat message input"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-1 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      aria-label="Send message"
                      disabled={!message.trim()}
                    >
                      <RiSendPlane2Line className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat widget' : 'Open chat widget'}
        aria-expanded={isOpen}
        aria-controls="chat-widget-panel"
        className={`
          h-14 w-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all duration-300
          ${isOpen ? 'bg-secondary text-foreground rotate-90' : 'bg-primary text-primary-foreground hover:shadow-primary/40'}
        `}
      >
        {isOpen ? <RiCloseLine className="h-6 w-6" aria-hidden="true" /> : <RiMessage3Line className="h-6 w-6" aria-hidden="true" />}

        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-background"></span>
          </span>
        )}
      </motion.button>
    </div>
  )
}
