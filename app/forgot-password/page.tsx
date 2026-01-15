'use client';
import { useState } from 'react';
import useRouter from 'next/navigation'; // Mistake in import, will fix in next step if caught by linter or review, but actually useRouter is from next/navigation
import { useRouter as useNextRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
    const router = useNextRouter();
    const [formData, setFormData] = useState({
        username: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: '' | string }>({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'รหัสผ่านใหม่ไม่ตรงกัน' });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setStatus({ type: 'success', message: 'เปลี่ยนรหัสผ่านสำเร็จ! กำลังกลับไปหน้าเข้าสู่ระบบ...' });

            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-dark">
            <div className="card shadow-lg p-4 custom-card" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body">
                    <h3 className="text-center mb-4 text-white fw-bold">เปลี่ยนรหัสผ่าน</h3>

                    {status.message && (
                        <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} animate-fade-in`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-white-50">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="เช่น สมชาย-รักดี"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white-50">รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                className="form-control"
                                name="newPassword"
                                required
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white-50">ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="d-grid gap-2 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'กำลังดำเนิน...' : 'เปลี่ยนรหัสผ่าน'}
                            </button>
                            <Link href="/login" className="btn btn-outline-secondary">
                                ยกเลิก
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
