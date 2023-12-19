const con_db = require('../models/con_db');
const bcrypt = require('bcrypt');

const addAdmin = async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;

    if (!username || !password || !name) {
        res.status(400).json({
            successful: false,
            message: 'Fields cannot be empty.',
        });
    } else if (username.includes(' ')) {
        res.status(400).json({
            successful: false,
            message: 'Username must not contain spaces.',
        });
    } else if (password.length < 7) {
        res.status(400).json({
            successful: false,
            message: 'Password is too weak, please enter more than 7 characters.',
        });
    } else {
        let usernameCheckQuery = `SELECT username FROM admin_tbl WHERE username = '${username}'`;
        // Checking if username already exists
        con_db.database.query(usernameCheckQuery, async (err, usernameRows) => {
            if (err) {
                res.status(500).json({
                    successful: false,
                    message: err,
                });
            } else {
                if (usernameRows.length > 0) {
                    res.status(400).json({
                        successful: false,
                        message: 'This username already exists.',
                    });
                } else {
                    // Example: Hashing the password
                    let hashedPassword = await bcrypt.hash(password, 10);

                    // Example: Inserting data into the database
                    let insertQuery = `INSERT INTO admin_tbl (name, username, password) VALUES (?, ?, ?)`;
                    con_db.database.query(
                        insertQuery,
                        [name, username, hashedPassword],
                        (err, rows) => {
                            if (err) {
                                res.status(500).json({
                                    successful: false,
                                    message: err,
                                });
                            } else {
                                res.status(200).json({
                                    successful: true,
                                    message: 'Successfully signed up new admin!',
                                });
                            }
                        }
                    );
                }
            }
        });
    }
};


const adminLogin = async (req, res, next) => {
    try {
        let username = req.body.username;
        let password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({
                successful: false,
                message: 'Invalid input',
            });
        }

        let searchQuery = 'SELECT password, name as adminName FROM admin_tbl WHERE username = ?';
        con_db.database.query(searchQuery, [username], async (err, rows) => {
            if (err) {
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

            let storedPassword = rows[0].password;
            let adminName = rows[0].adminName; // Update variable name to match the query

            let isPasswordMatched = await bcrypt.compare(password, storedPassword);

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
        });
    } catch (error) {
        return res.status(500).json({
            successful: false,
            message: 'Internal Server Error',
        });
    }
};


const viewAll = async (req, res, next) => {
    try {
        // Query to retrieve appointments for today
        const query = `
            SELECT a.ref_no, a.suffix, a.first_name, a.middle_name, a.last_name, a.contact_no, a.email, a.date, a.time, a.serviceid, a.note, a.status, sc.service_name
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

            // Format date and time for each appointment
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
        // Get today's date in the format 'YYYY-MM-DD'
        const todayDate = new Date().toISOString().split('T')[0];
        
        // Formatted date for display
        const displayDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Query to retrieve appointments for today with first_name, last_name, and service_name
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

            // Format time for each appointment
            const formattedAppointments = rows.map(appointment => {
                return {
                    status: appointment.status,
                    time: formatTime(appointment.time),
                    service_name: appointment.service_name,
                    ref_no: appointment.ref_no,
                    first_name: appointment.first_name,
                    last_name: appointment.last_name,
                };
            });

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

        // Query to retrieve all details of the selected ref_no
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

            // Format date
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }).format(new Date(appointmentDetails.date));

            // Format time
            const formattedTime = formatTime(appointmentDetails.time);

            // Update the appointmentDetails with formatted date and time
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

        // Check if the appointment exists
        const checkQuery = `
            SELECT status
            FROM appointment_tbl
            WHERE ref_no = ?
        `;

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

            // Update or delete based on the current status
            if (currentStatus === 'Ongoing') {
                // Update status to Canceled
                const updateQuery = `
                    UPDATE appointment_tbl
                    SET status = 'Canceled'
                    WHERE ref_no = ?
                `;

                con_db.database.query(updateQuery, [refNo], (err) => {
                    if (err) {
                        return res.status(500).json({
                            successful: false,
                            message: 'Internal Server Error',
                        });
                    }

                    return res.status(200).json({
                        successful: true,
                        message: 'Appointment canceled successfully',
                    });
                });
            } else if (currentStatus === 'Finished' || currentStatus === 'Canceled') {
                // Delete the appointment
                const deleteQuery = `
                    DELETE FROM appointment_tbl
                    WHERE ref_no = ?
                `;

                con_db.database.query(deleteQuery, [refNo], (err) => {
                    if (err) {
                        return res.status(500).json({
                            successful: false,
                            message: 'Internal Server Error',
                        });
                    }

                    return res.status(200).json({
                        successful: true,
                        message: 'Appointment deleted successfully',
                    });
                });
            } else {
                return res.status(400).json({
                    successful: false,
                    message: 'Invalid appointment status',
                });
            }
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
        const countQuery = `
            SELECT 
                (SELECT COUNT(*) FROM appointment_tbl WHERE status = 'Finished') as finishedCount,
                (SELECT COUNT(*) FROM appointment_tbl WHERE status = 'Ongoing') as ongoingCount,
                (SELECT COUNT(*) FROM appointment_tbl WHERE status = 'Canceled') as canceledCount
        `;

        con_db.database.query(countQuery, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            const result = {
                successful: true,
                finishedCount: rows[0].finishedCount,
                ongoingCount: rows[0].ongoingCount,
                canceledCount: rows[0].canceledCount
            };

            return res.status(200).json(result);
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

        // Update status to Finished
        const updateQuery = `
            UPDATE appointment_tbl
            SET status = 'Finished'
            WHERE ref_no = ?
        `;

        con_db.database.query(updateQuery, [refNo], (err) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: 'Internal Server Error',
                });
            }

            return res.status(200).json({
                successful: true,
                message: 'Appointment marked as Finished successfully',
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

        // Check if the appointment exists
        const checkQuery = `
            SELECT payment_status
            FROM appointment_tbl
            WHERE ref_no = ?
        `;

        con_db.database.query(checkQuery, [refNo], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    successful: false,
                    message: '1Internal Server Error',
                });
            }

            if (rows.length === 0) {
                return res.status(404).json({
                    successful: false,
                    message: 'Appointment not found',
                });
            }

            const currentPaymentStatus = rows[0].payment_status;

            // Update payment_status to Paid if it's Unpaid, and vice versa
            const newPaymentStatus = currentPaymentStatus === 'Unpaid' ? 'Paid' : 'Unpaid';

            // Update payment_status in the database
            const updateQuery = `
                UPDATE appointment_tbl
                SET payment_status = ?
                WHERE ref_no = ?
            `;

            con_db.database.query(updateQuery, [newPaymentStatus, refNo], (err) => {
                if (err) {
                    return res.status(500).json({
                        successful: false,
                        message: 'Internal Server Error',
                    });
                }

                return res.status(200).json({
                    successful: true,
                    message: `Payment status updated to ${newPaymentStatus} successfully`,
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


// Function to format time
const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? 'pm' : 'am';
    return `${formattedHours}:${minutes}${period}`;
};

module.exports = {
    adminLogin,
    addAdmin,
    viewAll,
    viewToday,
    viewSelected,
    countAppointmentsByStatus,
    finishAppointment,
    cancelAppointment,
    updatePaymentStatus
};