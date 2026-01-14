const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// English First Names
const firstNames = [
    "John", "Jane", "Michael", "Emily", "Chris", "Sarah", "David", "Jessica", "Daniel", "Ashley",
    "James", "Robert", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "William", "Joseph",
    "Thomas", "Charles", "Christopher", "Margaret", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra",
    "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin",
    "Brian", "George", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary"
];

// English Last Names
const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
];

// Hash for password "1234"
const PASSWORD_HASH = "$2b$10$8I2/7VWHOJfnvNJ2jDS1JOtRH7B6ZMkNmxxBATWTdk72ghHp7gKP2";

// Departments 1-12
const DEPARTMENT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

try {
    const rawData = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    // CLEANUP: Remove previously generated students (ID > 6)
    // IDs 1-6 are the manual/original ones we want to keep.
    const originalCount = data.students.length;
    data.students = data.students.filter(s => s.student_id <= 6);
    console.log(`Removed ${originalCount - data.students.length} old generated students.`);

    let nextStudentId = 7; // Start after the preserved IDs

    const newStudents = [];

    for (let i = 0; i < 120; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const username = `${firstName}-${lastName}-${getRandomInt(10, 99)}`.toLowerCase(); // Lowercase for english usernames usually looks better
        const departmentId = getRandomItem(DEPARTMENT_IDS);

        const student = {
            prefix: Math.random() > 0.5 ? "Mr." : "Ms.", // English prefixes
            first_name: firstName,
            last_name: lastName,
            dob: `200${getRandomInt(0, 9)}-${getRandomInt(1, 12).toString().padStart(2, '0')}-${getRandomInt(1, 28).toString().padStart(2, '0')}`,
            phone: `08${getRandomInt(10000000, 99999999)}`,
            department_id: departmentId,
            username: username,
            password_hash: PASSWORD_HASH,
            student_id: nextStudentId++
        };

        newStudents.push(student);
    }

    data.students.push(...newStudents);

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

    console.log(`Successfully added ${newStudents.length} new English-named students to database.`);

} catch (err) {
    console.error("Error seeding database:", err);
}
