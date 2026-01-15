import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, newPassword } = body;

        if (!username || !newPassword) {
            return NextResponse.json(
                { error: 'Username and new password are required' },
                { status: 400 }
            );
        }

        const student = db.getStudentByUsername(username);

        if (!student) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const success = db.resetStudentPassword(student.student_id, hashedPassword);

        if (success) {
            return NextResponse.json({ success: true, message: 'Password updated successfully' });
        } else {
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
