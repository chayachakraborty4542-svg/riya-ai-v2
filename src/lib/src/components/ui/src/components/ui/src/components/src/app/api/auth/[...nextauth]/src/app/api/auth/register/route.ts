import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
    const result = schema.safeParse(body);
    if (!result.success) return NextResponse.json({ message: 'Invalid input' }, { status: 400 });

    const { email, password } = result.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: 'Email already in use' }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashedPassword } });
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
