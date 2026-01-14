import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Student } from '@/lib/types';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prefix, first_name, last_name, dob, phone, department_id, password } = body;

        // Simple validation
        if (!prefix || !first_name || !last_name || !dob || !phone || !department_id || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const username = `${first_name}-${last_name}`;

        // Check duplicate
        const existingStudent = db.getStudentByUsername(username);
        if (existingStudent) {
            return NextResponse.json({ error: 'Student with this name already exists' }, { status: 409 });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const newStudent = db.createStudent({
            prefix,
            first_name,
            last_name,
            dob,
            phone,
            department_id: Number(department_id),
            username,
            password_hash
        });

        return NextResponse.json({ success: true, student: newStudent });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
