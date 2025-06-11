
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { recipeChat } from '@/ai/flows/recipe-chat-flow';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialGreetingMessage: ChatMessage = {
  id: 'greeting-initial',
  text: "Hi there! I'm CalSnap AI. How can I help you with recipes, ingredients, or calorie info today?",
  sender: 'bot',
  timestamp: Date.now(),
};

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialGreetingMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added or when chat opens
    if (isOpen && scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        // Timeout to allow DOM to update before scrolling
        setTimeout(() => scrollableViewport.scrollTop = scrollableViewport.scrollHeight, 0);
      }
    }
  }, [messages, isOpen]);
  
  // Manage initial greeting and clearing history based on isOpen
  useEffect(() => {
    if (isOpen) {
      // If chat is opened and messages are empty or only contain a placeholder, set the initial greeting.
      // This handles the case where chat was closed (messages cleared) and then reopened.
      if (messages.length === 0 || (messages.length === 1 && messages[0].id === 'closed-chat-placeholder')) {
        setMessages([{...initialGreetingMessage, id: `greeting-${Date.now()}`, timestamp: Date.now()}]);
      }
    } else {
      // When chat is closed, reset messages to a placeholder state.
      // This effectively clears the session's conversational memory.
      setMessages([{id: 'closed-chat-placeholder', text:'', sender: 'bot', timestamp: 0}]); 
    }
  }, [isOpen]);


  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: Date.now(),
    };

    // Prepare history from messages *before* adding the new userMessage
    // This history is what the AI will see as prior context.
    const conversationHistoryForAPI = messages
      .filter(msg => msg.id !== 'closed-chat-placeholder') // Don't send placeholder
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : ('model' as 'user' | 'model'),
        parts: [{ text: msg.text }],
      }));
    
    const currentQuery = inputValue; // Capture current input value before clearing
    setMessages((prevMessages) => [...prevMessages.filter(msg => msg.id !== 'closed-chat-placeholder'), userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await recipeChat({ 
        userQuery: currentQuery,
        conversationHistory: conversationHistoryForAPI
      });
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: response.botResponse,
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const displayedMessages = messages.filter(msg => msg.id !== 'closed-chat-placeholder');

  return (
    <div className="fixed bottom-20 right-4 md:right-6 w-[350px] h-[500px] bg-card shadow-xl rounded-lg border border-border flex flex-col z-50">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="text-primary h-6 w-6" />
          <h3 className="font-semibold text-primary">CalSnap AI Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {displayedMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-end gap-2',
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.sender === 'bot' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-[75%] rounded-lg px-3 py-2 text-sm shadow',
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {msg.text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
             {msg.sender === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User size={18} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
             <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
            <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm shadow flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Typing...
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about recipes, ingredients..."
            className="flex-grow"
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
         <p className="text-xs text-muted-foreground mt-1 text-center">
            CalSnap AI can make mistakes. Verify important information.
          </p>
      </div>
    </div>
  );
}

