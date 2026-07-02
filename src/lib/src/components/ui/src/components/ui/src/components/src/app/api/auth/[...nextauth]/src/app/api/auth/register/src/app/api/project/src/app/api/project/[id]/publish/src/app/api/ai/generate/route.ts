import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are RIYA AI v2, an autonomous, production-grade software engineering system. Produce reliable, maintainable, secure, and deployment-ready software. Always produce production-ready code.`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { projectId, prompt } = await req.json();
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!project || project.userId !== session.user.id) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    await prisma.message.create({ data: { projectId, role: 'user', content: prompt } });

    const history = project.messages.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history, { role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const aiResponse = response.choices[0].message.content;
    await prisma.message.create({ data: { projectId, role: 'assistant', content: aiResponse || '' } });

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
