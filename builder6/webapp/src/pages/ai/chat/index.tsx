import { useParams, useNavigate } from 'react-router-dom';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';

export const ChatView = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_B6_ROOT_URL}/api/v6/ai/chat/${chatId}/stream`,
    }),
  });
  const [input, setInput] = useState('');
  const [chat, setChat] = useState(null);

  // 若无 chatId，自动生成一个并跳转
  useEffect(() => {
    if (!chatId) {
      const newId = uuidv4();
      navigate(`/ai/chat/${newId}`, { replace: true });
    }
  }, [chatId, navigate]);

  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_B6_ROOT_URL}/api/v6/data/ai_chats/${chatId}`
        );
        const data = await res.json();
        // 假设服务端返回的 JSON 中包含 name 字段
        setChat(data ?? null);
      } catch (error) {
        console.error('获取 Chat 名称失败:', error);
      }
    };

    fetchChat();
  }, [chatId]);

  return (
<div className="flex flex-col h-screen bg-white">
  {/* 顶部标题（可选） */}
  <div className="p-4 border-b">
  <h1 className="text-xl font-semibold mb-0">{'Steedos AI'}</h1>
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
              ? 'bg-blue-100 rounded-lg p-3 max-w-full ml-10 text-gray-800 prose'
              : 'bg-gray-100 rounded-lg p-3 max-w-full text-gray-800 prose'
          }
        >
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              // 使用 react-markdown 来解析和渲染 Markdown 文本
              return (
                <ReactMarkdown 
                  key={index} 
                  remarkPlugins={[remarkGfm]}
                >
                  {part.text}
                </ReactMarkdown>
              );
            }
            return null;
          })}
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
    className="flex items-center p-4"
  >
    <input
      className="flex-grow p-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      disabled={status !== 'ready'}
      placeholder={'Ask me anything...'}
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
  