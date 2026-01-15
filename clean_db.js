const fs = require('fs');
const path = require('path');

const dbPath = path.join('data', 'db.json');
try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(raw);
    
    if (data.students) {
        data.students = data.students.map(s => {
            const { profile_image, ...rest } = s;
            return rest;
        });
    }
    
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log('Successfully removed profile_image from db.json');
} catch (e) {
    console.error('Error processing db.json:', e);
}
