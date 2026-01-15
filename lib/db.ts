import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Student, AdminUser, Department } from './types';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Initial seed data
const initialData: DatabaseSchema = {
    departments: [
        { department_id: 1, department_name: 'เทคโนโลยีคอมพิวเตอร์', code: 'COM' },
        { department_id: 2, department_name: 'การบัญชี', code: 'ACC' },
        { department_id: 3, department_name: 'การตลาด', code: 'MKT' }
    ],
    students: [],
    admins: [
        {
            admin_id: 1,
            username: 'admin',
            // password: 'adminpassword'
            password_hash: bcrypt.hashSync('adminpassword', 10),
            email: 'admin@college.ac.th',
            role: 'superadmin'
        },
        {
            admin_id: 2,
            username: 'Nomai',
            password_hash: bcrypt.hashSync('1234', 10),
            email: 'nomai@college.ac.th',
            role: 'superadmin'
        }
    ]
};

function readDb(): DatabaseSchema {
    if (!fs.existsSync(DB_PATH)) {
        writeDb(initialData);
        return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (e) {
        return initialData;
    }
}

function writeDb(data: DatabaseSchema) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
    getDepartments: () => readDb().departments,
    getStudentByUsername: (username: string) => readDb().students.find(s => s.username === username),
    getAdminByUsername: (username: string) => readDb().admins.find(a => a.username === username),
    createStudent: (student: Omit<Student, 'student_id'>) => {
        const data = readDb();
        const newStudent = {
            ...student,
            student_id: (data.students.length > 0 ? Math.max(...data.students.map(s => s.student_id)) : 0) + 1
        };
        data.students.push(newStudent);
        writeDb(data);
        return newStudent;
    },
    getAllStudents: () => readDb().students,
    deleteStudent: (id: number) => {
        const data = readDb();
        data.students = data.students.filter(s => s.student_id !== id);
        writeDb(data);
    },
    resetStudentPassword: (id: number, newPasswordHash: string) => {
        const data = readDb();
        const student = data.students.find(s => s.student_id === id);
        if (student) {
            student.password_hash = newPasswordHash;
            writeDb(data);
            return true;
        }
        return false;
    },
    updateStudentProfileImage: (id: number, imageBase64: string) => {
        const data = readDb();
        const student = data.students.find(s => s.student_id === id);
        if (student) {
            student.profile_image = imageBase64;
            writeDb(data);
            return true;
        }
        return false;
    }
};
