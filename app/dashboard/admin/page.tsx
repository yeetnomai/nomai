'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IntroOverlay from '@/components/IntroOverlay';
import StudentDistributionChart from '@/components/StudentDistributionChart';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDept, setFilterDept] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Authenticate
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (!data.authenticated || data.user.role !== 'superadmin') {
                    router.push('/login');
                } else {
                    setUser(data.user);
                    fetchData();
                }
            })
            .catch(() => router.push('/login'));
    }, [router]);

    const fetchData = async () => {
        setLoading(true);
        // Load Students and Departments
        try {
            const [stdRes, deptRes] = await Promise.all([
                fetch('/api/admin/students'),
                fetch('/api/departments')
            ]);
            const stdData = await stdRes.json();
            const deptData = await deptRes.json();
            setStudents(stdData);
            setDepartments(deptData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรายชื่อนักศึกษานี้?')) return;
        await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleResetPassword = async (id: number) => {
        if (!confirm('ยืนยันการรีเซ็ตรหัสผ่านเป็นวันเดือนปีเกิด (DDMMYYYY)?')) return;
        await fetch(`/api/admin/students/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reset_password' })
        });
        alert('รีเซ็ตรหัสผ่านเรียบร้อยแล้ว');
    };

    const filteredStudents = students.filter(s => {
        const matchDept = filterDept ? String(s.department_id) === filterDept : true;
        const matchSearch = search ?
            (s.first_name.includes(search) || s.last_name.includes(search) || s.username.includes(search)) : true;
        return matchDept && matchSearch;
    });

    if (!user) return null;

    return (
        <div className="animate-fade-in">
            <IntroOverlay message="ยินดีต้อนรับกลับ ท่านเปรมผู้ชนะสิบทิศ" />
            <nav className="navbar navbar-dark bg-transparent shadow-sm mb-4 rounded px-3 border-bottom border-secondary">
                <span className="navbar-brand mb-0 h1 fw-bold text-gradient">ระบบผู้ดูแลระบบ (Admin)</span>
                <div className="d-flex align-items-center gap-3 text-white">
                    <span className="fw-bold">{user.username}</span>
                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">ออกจากระบบ</button>
                </div>
            </nav>

            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card text-center shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h3 className="fw-bold text-primary display-4">{students.length}</h3>
                            <p className="mb-0 text-muted fw-bold">นักศึกษาทั้งหมด</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h3 className="fw-bold text-primary display-4">{departments.length}</h3>
                            <p className="mb-0 text-muted fw-bold">แผนกวิชา</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <StudentDistributionChart students={students} departments={departments} />

            <div className="card shadow-sm border-0">
                <div className="card-header bg-transparent d-flex justify-content-between align-items-center border-bottom border-secondary">
                    <h5 className="mb-0 text-white fw-bold">จัดการข้อมูลนักศึกษา</h5>
                    <button className="btn btn-primary btn-sm" onClick={fetchData}>Refresh</button>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ค้นหาชื่อ..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                value={filterDept}
                                onChange={(e) => setFilterDept(e.target.value)}
                            >
                                <option value="">ทุกแผนกวิชา</option>
                                {departments.map(d => (
                                    <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover table-dark table-striped border-secondary align-middle">
                            <thead>
                                <tr>
                                    <th className="fw-bold text-primary">ID</th>
                                    <th className="fw-bold text-primary">ชื่อ-นามสกุล</th>
                                    <th className="fw-bold text-primary">แผนก</th>
                                    <th className="fw-bold text-primary">เบอร์โทร</th>
                                    <th className="fw-bold text-primary">Username</th>
                                    <th className="fw-bold text-end">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-4 text-muted">ไม่พบข้อมูล</td></tr>
                                ) : (
                                    filteredStudents.map(s => (
                                        <tr key={s.student_id}>
                                            <td className="fw-bold">{s.student_id}</td>
                                            <td>{s.prefix} {s.first_name} {s.last_name}</td>
                                            <td>{departments.find(d => d.department_id === s.department_id)?.department_name || s.department_id}</td>
                                            <td>{s.phone}</td>
                                            <td>{s.username}</td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-warning text-dark fw-bold"
                                                        onClick={() => handleResetPassword(s.student_id)}
                                                        title="รีเซ็ตรหัสผ่าน"
                                                    >
                                                        Reset Pwd
                                                    </button>
                                                    <button
                                                        className="btn btn-danger fw-bold"
                                                        onClick={() => handleDelete(s.student_id)}
                                                        title="ลบ"
                                                    >
                                                        ลบ
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
