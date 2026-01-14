"use client";

import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface Student {
    student_id: number;
    department_id: number;
}

interface Department {
    department_id: number;
    department_name: string;
}

interface Props {
    students: Student[];
    departments: Department[];
}

export default function StudentDistributionChart({ students, departments }: Props) {
    const data = useMemo(() => {
        if (!students.length || !departments.length) return [];

        const counts = students.reduce((acc, student) => {
            acc[student.department_id] = (acc[student.department_id] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return departments.map(dept => ({
            name: dept.department_name,
            count: counts[dept.department_id] || 0
        })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
    }, [students, departments]);

    if (data.length === 0) {
        return <div className="text-center p-4 text-muted">No data available for graph</div>;
    }

    const COLORS = ['#00d2ff', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981'];

    return (
        <div className="card shadow-sm border-0 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-header bg-transparent border-bottom border-secondary">
                <h5 className="mb-0 text-white fw-bold">Overview: Student Distribution by Department</h5>
            </div>
            <div className="card-body" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={130}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                borderRadius: '8px',
                                backdropFilter: 'blur(4px)'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
