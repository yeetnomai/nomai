'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Department {
    department_id: number;
    department_name: string;
}

export default function Register() {
    const router = useRouter();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [formData, setFormData] = useState({
        prefix: 'นาย',
        first_name: '',
        last_name: '',
        department_id: '',
        dob: '',
        phone: '',
        password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch('/api/departments')
            .then(res => res.json())
            .then(data => setDepartments(data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirm_password) {
            setError('รหัสผ่านไม่ตรงกัน');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบด้วย ชื่อผู้ใช้: ' + data.student.username);
            setTimeout(() => {
                router.push('/login');
            }, 5000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="row justify-content-center animate-fade-in">
            <div className="col-md-8 col-lg-6">
                <div className="card shadow-sm animate-slide-up">
                    <div className="card-body p-4">
                        <h2 className="text-center mb-4 text-primary fw-bold">ลงทะเบียนนักศึกษาใหม่</h2>

                        {error && <div className="alert alert-danger animate-fade-in">{error}</div>}
                        {success && <div className="alert alert-success animate-fade-in">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted">คำนำหน้าชื่อ</label>
                                <select
                                    className="form-select"
                                    name="prefix"
                                    value={formData.prefix}
                                    onChange={handleChange}
                                >
                                    <option value="นาย">นาย</option>
                                    <option value="นางสาว">นางสาว</option>
                                    <option value="นาง">นาง</option>
                                </select>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted">ชื่อจริง</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="first_name"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted">นามสกุล</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">แผนกวิชา</label>
                                <select
                                    className="form-select"
                                    name="department_id"
                                    required
                                    value={formData.department_id}
                                    onChange={handleChange}
                                >
                                    <option value="">-- เลือกแผนกวิชา --</option>
                                    {departments.map(dept => (
                                        <option key={dept.department_id} value={dept.department_id}>
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">วัน/เดือน/ปีเกิด (ค.ศ.)</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="dob"
                                    required
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted">รหัสผ่าน</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="กำหนดรหัสผ่าน"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted">ยืนยันรหัสผ่าน</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirm_password"
                                        required
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                                    />
                                </div>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? 'กำลังบันทึก...' : 'ลงทะเบียน'}
                                </button>
                                <Link href="/login" className="btn btn-link text-decoration-none text-muted">
                                    มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
