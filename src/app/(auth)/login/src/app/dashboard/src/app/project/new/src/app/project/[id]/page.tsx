'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]); setInput(''); setIsLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, prompt: input })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not generate response.' }]);
    } finally { setIsLoading(false); }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">RIYA AI v2 Workspace</h1>
          <Link href={`/project/${projectId}/publish`}><Button variant="ghost">Publish Center</Button></Link>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Start Building</h2>
              <p className="text-gray-500 mt-2">Describe the software you want RIYA AI v2 to build.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border dark:border-gray-700'}`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto py-4 px-4 flex space-x-4">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Describe your project..." className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" disabled={isLoading} />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>{isLoading ? 'Generating...' : 'Send'}</Button>
        </div>
      </div>
    </main>
  );
                         }
