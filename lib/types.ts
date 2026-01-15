export interface Department {
    department_id: number;
    department_name: string;
    code: string;
}

export interface Student {
    student_id: number;
    prefix: string;
    first_name: string;
    last_name: string;
    dob: string; // YYYY-MM-DD
    phone: string;
    department_id: number;
    username: string; // first_name-last_name
    password_hash: string;
    profile_image?: string; // Base64 string
}

export interface AdminUser {
    admin_id: number;
    username: string;
    password_hash: string;
    email: string;
    role: string;
}

export interface DatabaseSchema {
    departments: Department[];
    students: Student[];
    admins: AdminUser[];
}
