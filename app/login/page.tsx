'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');

    const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeParam === 'admin') {
            setLoginType('admin');
        } else if (typeParam === 'student') {
            setLoginType('student');
        }
    }, [typeParam]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: loginType })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect based on role
            if (data.user.role === 'superadmin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard/student');
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="row justify-content-center animate-fade-in">
            <div className="col-md-5">
                <div className="card shadow-sm animate-slide-up">
                    <div className="card-header bg-transparent border-bottom border-secondary p-0">
                        <ul className="nav nav-tabs nav-fill border-0" role="tablist">
                            <li className="nav-item">
                                <button
                                    className={`nav-link border-0 rounded-top py-3 ${loginType === 'student' ? 'active fw-bold text-primary bg-white bg-opacity-10' : 'text-white-50 hover-text-white'}`}
                                    onClick={() => setLoginType('student')}
                                    style={{ transition: 'all 0.3s ease' }}
                                >
                                    นักเรียน/นักศึกษา
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link border-0 rounded-top py-3 ${loginType === 'admin' ? 'active fw-bold text-primary bg-white bg-opacity-10' : 'text-white-50 hover-text-white'}`}
                                    onClick={() => setLoginType('admin')}
                                    style={{ transition: 'all 0.3s ease' }}
                                >
                                    ผู้ดูแลระบบ (Admin)
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body p-4">
                        <h3 className="text-center mb-4 text-white fw-bold">เข้าสู่ระบบ</h3>

                        {error && <div className="alert alert-danger animate-fade-in">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted">
                                    {loginType === 'student' ? 'ชื่อผู้ใช้ (ชื่อจริง-นามสกุล)' : 'ชื่อผู้ใช้'}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    placeholder={loginType === 'student' ? 'เช่น สมชาย-รักดี' : ''}
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">รหัสผ่าน</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    required
                                    placeholder={loginType === 'student' ? 'วันเดือนปีเกิด (DDMMYYYY)' : ''}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                                </button>
                                {loginType === 'student' && (
                                    <Link href="/register" className="btn btn-link text-decoration-none text-muted">
                                        ยังไม่มีบัญชี? ลงทะเบียน
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <Link href="/" className="btn btn-outline-secondary btn-sm animate-fade-in text-decoration-none">
                        <i className="bi bi-arrow-left me-2"></i>กลับไปหน้าเมนู
                    </Link>
                </div>
            </div>
        </div>

    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
