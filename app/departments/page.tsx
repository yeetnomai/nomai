'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/departments')
            .then(res => res.json())
            .then(data => {
                setDepartments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mt-5 mb-5 animate-fade-in">
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">แผนกวิชาที่เปิดสอน</h1>
                <p className="lead text-muted">วิทยาลัยเทคนิคลำปาง มุ่งมั่นผลิตบุคลากรคุณภาพสู่สังคม</p>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row justify-content-center">
                    {departments.map((dept, index) => (
                        <div key={dept.department_id} className="col-md-6 col-lg-4 mb-4">
                            <div
                                className="card h-100 border-0 shadow-sm animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="card-body p-4 text-center">
                                    <div className="mb-3 text-primary">
                                        <i className="bi bi-laptop display-4"></i>
                                    </div>
                                    <h5 className="card-title fw-bold mb-2">{dept.department_name}</h5>
                                    <p className="card-text text-muted small">
                                        รหัสแผนก: {dept.department_id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-5">
                <Link href="/" className="btn btn-outline-primary px-4 py-2 rounded-pill">
                    <i className="bi bi-arrow-left me-2"></i>กลับไปหน้าหลัก
                </Link>
            </div>
        </div>
    );
}
