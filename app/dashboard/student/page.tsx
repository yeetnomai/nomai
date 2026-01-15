'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (!data.authenticated || data.user.role !== 'student') {
                    router.push('/login');
                } else {
                    setUser(data.user);
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (!user) return null;

    return (
        <div>
            <nav className="navbar navbar-light bg-white shadow-sm mb-4 rounded">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">ระบบนักศึกษา</span>
                    <div className="d-flex align-items-center gap-3">
                        <span>สวัสดี, {user.name}</span>
                        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">ออกจากระบบ</button>
                    </div>
                </div>
            </nav>

            <div className="row">
                <div className="col-md-4">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            ข้อมูลส่วนตัว
                        </div>
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="bi bi-person-circle display-1 text-primary"></i>
                            </div>

                            <div className="text-start mt-3">
                                <p><strong>ชื่อ-นามสกุล:</strong> {user.name}</p>
                                <p><strong>ชื่อผู้ใช้:</strong> {user.username}</p>
                                <p><strong>วันเกิด:</strong> {user.dob}</p>
                                <p><strong>เบอร์โทรศัพท์:</strong> {user.phone}</p>
                                <p><strong>รหัสแผนก:</strong> {user.department_id}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header bg-success text-white">
                            ประกาศ / กิจกรรม
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                <a href="#" className="list-group-item list-group-item-action">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1 text-dark">ยินดีต้อนรับเปิดเทอมใหม่</h5>
                                        <small className="text-muted">3 วันที่แล้ว</small>
                                    </div>
                                    <p className="mb-1 text-dark">ขอให้นักศึกษาทุกคนเตรียมความพร้อมสำหรับการเรียน...</p>
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1 text-dark">กำหนดการลงทะเบียนเรียนเพิ่ม-ถอน</h5>
                                        <small className="text-muted">1 สัปดาห์ที่แล้ว</small>
                                    </div>
                                    <p className="mb-1 text-dark">กิจกรรมเพิ่มถอนรายวิชาเริ่มตั้งแต่วันที่...</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
