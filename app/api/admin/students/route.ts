import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    // Check admin
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'));
    if (sessionData.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const students = db.getAllStudents();
    return NextResponse.json(students);
}
