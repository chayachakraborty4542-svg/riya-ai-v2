import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import PublishCenter from '@/components/PublishCenter';

export default async function PublishPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { publishConfig: true }
  });

  if (!project || project.userId !== session.user.id) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <PublishCenter projectId={project.id} initialConfig={project.publishConfig} />
    </main>
  );
}
