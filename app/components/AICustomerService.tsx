"use client"
// components/AICustomerService.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react'; // Add any icon library like lucide-react

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

const AICustomerService = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! How can I assist you today?", isUser: false },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(36).substr(2, 9), text: data.message, isUser: false },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          text: "Sorry, I couldn't connect. Try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputMessage,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    await sendMessage(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white shadow-xl rounded-lg w-80 md:w-96 h-[500px] flex flex-col border border-gray-200 transition-all">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Customer Service</span>
            <button onClick={() => setIsOpen(false)} className="text-white">
              ×
            </button>
          </div>
          <div
            ref={scrollAreaRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[75%] ${
                    msg.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm border'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-4 bg-white border-t">
          <input
  type="text"
  value={inputMessage}
  onChange={(e) => setInputMessage(e.target.value)}
  onKeyPress={handleKeyPress}
  placeholder="Type your message..."
  className="flex-1 p-2 border rounded-lg text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
  disabled={isLoading}
/>

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white p-2 rounded-full ml-2 hover:bg-blue-700 transition-all"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICustomerService;
