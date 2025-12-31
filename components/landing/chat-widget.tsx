"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-8 sm:right-8">
      {isOpen && (
        <Card className="mb-4 w-[300px] sm:w-[350px] shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-300">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-xl p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <div className="relative h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                </div>
                TAC Support
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] p-4">
              <div className="flex flex-col gap-3">
                <div className="self-start rounded-lg bg-muted px-3 py-2 text-sm">
                  Hello! 👋 I can help you track your shipment, get a quote, or connect you with support.
                </div>
                <div className="self-start rounded-lg bg-muted px-3 py-2 text-sm">
                  How can I assist you today?
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form className="flex w-full gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Type a message..." className="flex-1 h-9" />
              <Button type="submit" size="icon" className="h-9 w-9">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        size="lg"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Toggle Chat</span>
      </Button>
    </div>
  )
}
