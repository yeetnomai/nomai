import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'));
    if (sessionData.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    db.deleteStudent(Number(id));
    return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'));
    if (sessionData.role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (body.action === 'reset_password') {
        // Reset to DOB. But I need to know the DOB.
        // I need to fetch the student first.
        const students = db.getAllStudents();
        const student = students.find(s => s.student_id === Number(id));
        if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // DOB YYYY-MM-DD -> DDMMYYYY
        const dobObj = new Date(student.dob);
        const day = String(dobObj.getDate()).padStart(2, '0');
        const month = String(dobObj.getMonth() + 1).padStart(2, '0');
        const year = dobObj.getFullYear();
        const passwordPlain = `${day}${month}${year}`;

        const hash = await bcrypt.hash(passwordPlain, 10);
        db.resetStudentPassword(Number(id), hash);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
