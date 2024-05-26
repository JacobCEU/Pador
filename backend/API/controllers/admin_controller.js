const con_db = require('../models/con_db');
const bcrypt = require('bcrypt');




const addAdmin = async (req, res, next) => {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({
            successful: false,
            message: 'Fields cannot be empty.',
        });
    }
    
    if (username.includes(' ')) {
        return res.status(400).json({
            successful: false,
            message: 'Username must not contain spaces.',
        });
    }
    
    if (password.length < 7) {
        return res.status(400).json({
            successful: false,
            message: 'Password is too weak, please enter more than 7 characters.',
        });
    }

    const usernameCheckQuery = 'SELECT username FROM admin_tbl WHERE username = ?';
    
    con_db.database.query(usernameCheckQuery, [username], async (err, usernameRows) => {
        if (err) {
            return res.status(500).json({
                successful: false,
                message: 'Internal Server Error',
            });
        }

        if (usernameRows.length > 0) {
            return res.status(400).json({
                successful: false,
                message: 'This username already exists.',
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO admin_tbl (name, username, password) VALUES (?, ?, ?)';
            
            con_db.database.query(insertQuery, [name, username, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({
                        successful: false,
                        message: 'Internal Server Error',
                    });
                }
                
                return res.status(200).json({
                    successful: true,
                    message: 'Successfully signed up new admin!',
                });
            });
        } catch (hashError) {
            return res.status(500).json({
                successful: false,
                message: 'Error hashing the password',
            });
        }
    });
};

const adminLogin = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            successful: false,
            message: 'Invalid input',
        });
    }

    const searchQuery = 'SELECT password, name as adminName FROM admin_tbl WHERE username = ?';
    
    con_db.database.query(searchQuery, [username], async (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                successful: false,
                message: 'Internal Server Error',
            });
        }

        if (rows.length === 0) {
            return res.status(401).json({
                successful: false,
                message: 'Incorrect username or password',
            });
        }

        const storedPassword = rows[0].password;
        const adminName = rows[0].adminName;

        console.log('Stored password:', storedPassword);
        console.log('Provided password:', password);

        try {
            const isPasswordMatched = await bcrypt.compare(password, storedPassword);
            
            if (isPasswordMatched) {
                return res.status(200).json({
                    successful: true,
                    message: `Logged in successfully, Welcome: ${adminName}`,
                });
            } else {
                return res.status(401).json({
                    successful: false,
                    message: 'Incorrect username or password',
                });
            }
        } catch (compareError) {
            console.error('Error comparing passwords:', compareError);
            return res.status(500).json({
                successful: false,
                message: 'Error comparing the passwords',
            });
        }
    });
};

const viewAll = async (req, res, next) => {
    try {
        const query = `
            SELECT a.ref_no, a.suffix, a.first_name, a.middle_name, a.last_name, a.contact_no, a.email, a.date, a.time, a.serviceid, a.note, a.status, a.payment_status, sc.service_name
            FROM appointment_tbl a
            INNER JOIN service_choice sc ON a.serviceid = sc.serviceid
        `;

        con_db.database.query(query, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            if (rows.length === 0) {
                return res.status(200).json({
                    successful: true,
                    message: 'No appointments',
                });
            }

            const formattedAppointments = rows.map(appointment => {
                const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                const formattedTime = new Date(`2000-01-01 ${appointment.time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });

                return {
                    status: appointment.status,
                    note: appointment.note,
                    date: formattedDate,
                    time: formattedTime,
                    service_name: appointment.service_name,
                    ref_no: appointment.ref_no,
                    contact_no: appointment.contact_no,
                    email: appointment.email,
                    first_name: appointment.first_name,
                    middle_name: appointment.middle_name,
                    last_name: appointment.last_name,
                    suffix: appointment.suffix,
                    payment_status: appointment.payment_status,
                };
            });

            return res.status(200).json({
                successful: true,
                message: 'Appointments retrieved successfully',
                appointments: formattedAppointments,
            });
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};

const viewToday = async (req, res, next) => {
    try {
        const todayDate = new Date().toISOString().split('T')[0];
        
        const displayDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const query = `
            SELECT a.status, a.time, a.ref_no, a.first_name, a.last_name, s.service_name
            FROM appointment_tbl a
            INNER JOIN service_choice s ON a.serviceid = s.serviceid
            WHERE a.date = ?
        `;

        con_db.database.query(query, [todayDate], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            if (rows.length === 0) {
                return res.status(200).json({
                    successful: true,
                    message: `No appointments for today, ${displayDate}`,
                });
            }

            const formattedAppointments = rows.map(appointment => ({
                status: appointment.status,
                time: formatTime(appointment.time),
                service_name: appointment.service_name,
                ref_no: appointment.ref_no,
                first_name: appointment.first_name,
                last_name: appointment.last_name,
            }));

            return res.status(200).json({
                successful: true,
                message: `All appointments for today, ${displayDate}`,
                appointments: formattedAppointments,
            });
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};

const viewSelected = async (req, res, next) => {
    try {
        const refNo = req.params.ref_no;

        const query = `
            SELECT ref_no, serviceid, suffix, first_name, middle_name, last_name,
                   contact_no, email, date, time, note, status
            FROM appointment_tbl
            WHERE ref_no = ?
        `;

        con_db.database.query(query, [refNo], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            if (rows.length === 0) {
                return res.status(404).json({
                    successful: false,
                    message: 'Appointment not found',
                });
            }

            const appointmentDetails = rows[0];
            const formattedDate = new Date(appointmentDetails.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
            const formattedTime = formatTime(appointmentDetails.time);

            appointmentDetails.date = formattedDate;
            appointmentDetails.time = formattedTime;

            return res.status(200).json({
                successful: true,
                message: 'Appointment details retrieved successfully',
                appointment: appointmentDetails,
            });
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};

const cancelAppointment = async (req, res, next) => {
    try {
        const refNo = req.params.ref_no;

        const checkQuery = 'SELECT status FROM appointment_tbl WHERE ref_no = ?';

        con_db.database.query(checkQuery, [refNo], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            if (rows.length === 0) {
                return res.status(404).json({
                    successful: false,
                    message: 'Appointment not found',
                });
            }

            const currentStatus = rows[0].status;

            if (currentStatus === 'Cancelled') {
                return res.status(400).json({
                    successful: false,
                    message: 'Appointment is already cancelled',
                });
            }

            const updateQuery = 'UPDATE appointment_tbl SET status = "Cancelled" WHERE ref_no = ?';

            con_db.database.query(updateQuery, [refNo], (err) => {
                if (err) {
                    return res.status(500).json({
                        successful: false,
                        message: 'Internal Server Error',
                    });
                }

                return res.status(200).json({
                    successful: true,
                    message: 'Appointment cancelled successfully',
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};

const countAppointmentsByStatus = async (req, res, next) => {
    try {
        const query = 'SELECT status, COUNT(*) as count FROM appointment_tbl GROUP BY status';

        con_db.database.query(query, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            return res.status(200).json({
                successful: true,
                message: 'Appointment counts retrieved successfully',
                counts: rows,
            });
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};

const finishAppointment = async (req, res, next) => {
    try {
        const refNo = req.params.ref_no;

        const updateQuery = 'UPDATE appointment_tbl SET status = "Finished" WHERE ref_no = ?';

        con_db.database.query(updateQuery, [refNo], (err) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            return res.status(200).json({
                successful: true,
                message: 'Appointment finished successfully',
            });
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};

const updatePaymentStatus = async (req, res, next) => {
    try {
        const refNo = req.params.ref_no;

        const updateQuery = 'UPDATE appointment_tbl SET payment_status = "Paid" WHERE ref_no = ?';

        con_db.database.query(updateQuery, [refNo], (err) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            return res.status(200).json({
                successful: true,
                message: 'Payment status updated successfully',
            });
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};

// Utility function to format time
const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
};

module.exports = {
    addAdmin,
    adminLogin,
    viewAll,
    viewToday,
    viewSelected,
    cancelAppointment,
    countAppointmentsByStatus,
    finishAppointment,
    updatePaymentStatus
};
