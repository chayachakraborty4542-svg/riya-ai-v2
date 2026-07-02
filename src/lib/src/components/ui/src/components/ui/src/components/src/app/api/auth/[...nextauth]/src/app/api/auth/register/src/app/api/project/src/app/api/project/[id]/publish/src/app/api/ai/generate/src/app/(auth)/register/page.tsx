'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RegisterSchema } from '@/lib/validators';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({});
    const result = RegisterSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors); return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) router.push('/login');
      else { const data = await res.json(); setErrors({ email: data.message || 'Registration failed' }); }
    } catch { setErrors({ email: 'Network error' }); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold">Create your account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input id="email" name="email" type="email" label="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} required />
          <Input id="password" name="password" type="password" label="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={errors.password} required />
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Register'}</Button>
        </form>
        <p className="text-center text-sm">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
      </div>
    </div>
  );
          }
