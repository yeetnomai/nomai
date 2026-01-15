import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'));

        // Refresh data from DB if needed (optional)
        if (sessionData.role === 'student') {
            const student = db.getAllStudents().find(s => s.student_id === sessionData.id);
            if (student) {
                // Return fresh data
                return NextResponse.json({
                    authenticated: true,
                    user: {
                        ...sessionData,
                        dob: student.dob,
                        department_id: student.department_id
                    }
                });
            }
        }

        return NextResponse.json({ authenticated: true, user: sessionData });
    } catch (e) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
