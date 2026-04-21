import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const scenarios = await prisma.scenario.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(scenarios);
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scenario = await prisma.scenario.create({
      data: {
        name: body.name,
        lambda: body.lambda,
        mu: body.mu,
        s: body.s,
        duration: body.duration,
      },
    });
    return NextResponse.json(scenario);
  } catch (error) {
    console.error('Error creating scenario:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
