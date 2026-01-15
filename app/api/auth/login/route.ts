import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, type } = body;

        let user = null;
        let role = '';

        if (type === 'admin') {
            const admin = db.getAdminByUsername(username);
            if (admin && await bcrypt.compare(password, admin.password_hash)) {
                user = admin;
                role = admin.role; // 'superadmin'
            }
        } else {
            // Student
            const student = db.getStudentByUsername(username);
            if (student && await bcrypt.compare(password, student.password_hash)) {
                user = student;
                role = 'student';
            }
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Set session
        const sessionData = {
            id: type === 'admin' ? (user as any).admin_id : (user as any).student_id,
            username: user.username,
            role: role,
            name: type === 'student' ? `${(user as any).first_name} ${(user as any).last_name}` : user.username,
            department_id: type === 'student' ? (user as any).department_id : null
        };

        // In a real app, sign this with a secret
        const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');

        const response = NextResponse.json({ success: true, user: sessionData });

        (await cookies()).set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            sameSite: 'lax',
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
