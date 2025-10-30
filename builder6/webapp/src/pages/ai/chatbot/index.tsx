import { useParams, useSearchParams } from 'react-router-dom';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export const ChatbotView = () => {
    const { chatbotId } = useParams();
      const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_B6_ROOT_URL}/api/v6/ai/chatbot/${chatbotId}/stream`,
    }),
  });
  const [input, setInput] = useState('');

  return (
<div className="flex flex-col h-screen bg-gray-50">
  {/* 顶部标题（可选） */}
  <div className="p-4 border-b border-gray-300 bg-white shadow-sm">
  <h1 className="text-xl font-semibold">AI Chat</h1>
  </div>

  <div className="flex-grow overflow-y-auto p-4 space-y-2">
    {messages.map((message) => (
      <div
        key={message.id}
        // 根据角色使用不同的颜色、对齐方式
        className={
          message.role === 'user'
            ? 'flex justify-end'
            : 'flex justify-start'
        }
      >
        <div
          className={
            message.role === 'user'
              ? 'bg-blue-100 rounded-lg p-3 max-w-sm text-gray-800'
              : 'bg-gray-100 rounded-lg p-3 max-w-sm text-gray-800'
          }
        >
          <span className="font-semibold mr-1">
            {message.role === 'user' ? 'You:' : 'AI:'}
          </span>
          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </div>
      </div>
    ))}
  </div>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (input.trim()) {
        sendMessage({ text: input });
        setInput('');
      }
    }}
    className="flex items-center p-4 border-t border-gray-300 bg-white"
  >
    <input
      className="flex-grow p-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      disabled={status !== 'ready'}
      placeholder="Say something..."
    />
    <button
      type="submit"
      disabled={status !== 'ready'}
      className={`px-4 py-2 rounded text-white transition-colors 
        ${status === 'ready' 
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-gray-400 cursor-not-allowed'
        }
      `}
    >
      Submit
    </button>
  </form>
</div>
    );
  };
  