const fs = require('fs');
const path = require('path');

const dbPath = path.join('data', 'db.json');
try {
    if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf8');
        const data = JSON.parse(raw);
        
        let changed = false;
        if (data.students) {
            data.students = data.students.map(s => {
                if (s.profile_image) {
                    const { profile_image, ...rest } = s;
                    changed = true;
                    return rest;
                }
                return s;
            });
        }
        
        if (changed) {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
            console.log('Successfully removed profile_image fields');
        } else {
            console.log('No profile_image fields found');
        }
    }
} catch (e) {
    console.error('Error:', e);
}
