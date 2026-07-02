import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ProjectSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = ProjectSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const { name, description } = result.data;
    const project = await prisma.project.create({
      data: { userId: session.user.id, name, description, publishConfig: { create: {} } }
    });
    return NextResponse.json({ projectId: project.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
