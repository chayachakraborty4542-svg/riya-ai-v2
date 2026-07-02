import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <Link href="/project/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">New Project</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No projects yet. Create one to get started!</div>
          ) : (
            projects.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id} className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{project.description || 'No description provided'}</p>
                <div className="text-xs text-gray-400">Last updated: {new Date(project.updatedAt).toLocaleDateString()}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
