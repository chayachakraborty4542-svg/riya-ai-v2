'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const res = await fetch('/api/project', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/project/${data.projectId}`);
      }
    } finally { setIsLoading(false); }
  };

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input id="name" name="name" label="Project Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" name="description" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Project'}</Button>
        </form>
      </div>
    </main>
  );
}
