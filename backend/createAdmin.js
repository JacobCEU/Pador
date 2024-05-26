const bcrypt = require('bcrypt');
const con_db = require('../backend/API/models/con_db'); // Adjust the path as necessary

const createAdmin = async (username, password, name) => {
    if (!username || !password || !name) {
        console.error('Fields cannot be empty.');
        return;
    }

    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const insertQuery = `INSERT INTO admin_tbl (name, username, password) VALUES (?, ?, ?)`;

        con_db.database.query(insertQuery, [name, username, hashedPassword], (err) => {
            if (err) {
                console.error('Error inserting admin:', err);
            } else {
                console.log('Successfully signed up new admin!');
            }
        });
    } catch (err) {
        console.error('Error hashing password:', err);
    }
};


createAdmin('admin4', 'password123', 'usernapogi');

