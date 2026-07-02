'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError('');
    const res = await signIn('credentials', { redirect: false, email: formData.email, password: formData.password });
    if (res?.error) { setError('Invalid email or password'); setIsLoading(false); }
    else { router.push('/dashboard'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold">Sign in to your account</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input id="email" name="email" type="email" label="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input id="password" name="password" type="password" label="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <p className="text-center text-sm">Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link></p>
      </div>
    </div>
  );
}
