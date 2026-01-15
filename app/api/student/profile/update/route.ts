
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageBase64 } = body;

        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session');

        if (!sessionToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Decode session (in production, use proper JWT verification)
        const sessionData = JSON.parse(Buffer.from(sessionToken.value, 'base64').toString());

        if (sessionData.role !== 'student') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!imageBase64) {
            return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
        }

        const success = db.updateStudentProfileImage(sessionData.id, imageBase64);

        if (success) {
            return NextResponse.json({ success: true, message: 'Profile image updated successfully' });
        } else {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

    } catch (error) {
        console.error('Update profile image error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
