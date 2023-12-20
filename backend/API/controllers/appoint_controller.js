const con_db = require('../models/con_db');

const bookAppointment = async (req, res, next) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let middle_name = req.body.middle_name || 'n/a';
    let suffix = req.body.suffix || 'n/a';
    let contact_no = req.body.contact_no;
    let email = req.body.email || 'n/a';
    let date = req.body.date;
    let time = req.body.time;
    let serviceid = req.body.serviceid;
    let bank_id = req.body.bank_id;
    let note = req.body.note;

    // Validate Philippines phone number format
    const philippinePhoneNumberRegex = /^9\d{9}$/;
    if (!philippinePhoneNumberRegex.test(contact_no)) {
        return res.status(400).json({
            successful: false,
            message: "Contact number must be a valid Philippines phone number (9XXXXXXXXX)."
        });
    }

    // Validate email format if provided
    if (email !== 'n/a' && !isValidEmail(email)) {
        return res.status(400).json({
            successful: false,
            message: "Invalid email format."
        });
    }

    // Validate date and time not in the past
    if (isDateTimePastCurrent(date, time)) {
        return res.status(400).json({
            successful: false,
            message: "Appointment date and time cannot be in the past."
        });
    }

    // Validate appointment time within opening and closing hours
    const openingTime = '11:00'; // 11:00 am
    const closingTime = '17:00'; // 5:00 pm
    const appointmentDateTime = new Date(`${date} ${time}`);
    const openingDateTime = new Date(`${date} ${openingTime}`);
    const closingDateTime = new Date(`${date} ${closingTime}`);

    if (appointmentDateTime < openingDateTime || appointmentDateTime > closingDateTime) {
        return res.status(400).json({
            successful: false,
            message: "Appointments can only be booked between 11:00 am and 5:00 pm."
        });
    }

    // Proceed with your existing code to insert the new appointment
    let Appoint = {
        first_name: first_name,
        last_name: last_name,
        suffix: suffix,
        middle_name: middle_name,
        contact_no: contact_no,
        email: email,
        date: date,
        time: time,
        serviceid: serviceid,
        bank_id: bank_id,
        note: note
    };

    let query = `
        INSERT INTO appointment_tbl
        (bank_id, serviceid, first_name, last_name, middle_name, suffix, contact_no, email, date, time, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    con_db.database.query(query, [
        Appoint.bank_id,
        Appoint.serviceid,
        Appoint.first_name,
        Appoint.last_name,
        Appoint.middle_name,
        Appoint.suffix,
        Appoint.contact_no,
        Appoint.email,
        Appoint.date,
        Appoint.time,
        Appoint.note
    ], (error, result) => {
        if (error) {
            console.error('Database Error:', error);
            res.status(500).json({
                successful: false,
                message: "Error in query.",
                error: error.message
            });
        } else {
            const ref_id = result.insertId;
            const date = Appoint.date.replace(/-/g, '');

            const customRefNo = `${ref_id}${date}`;

            let customRefQuery = `UPDATE appointment_tbl
                SET ref_no = ${customRefNo}
                WHERE ref_id = ${ref_id};`;

            con_db.database.query(customRefQuery, [customRefNo, ref_id], (updateError) => {
                if (updateError) {
                    console.error('Database Update Error:', updateError);
                    res.status(500).json({
                        successful: false,
                        message: "Error updating ref_no in the database."
                    });
                } else {
                    res.status(200).json({
                        successful: true,
                        message: "Successfully booked an appointment",
                        ref_no: customRefNo
                    });
                }
            });
        }
    });
};



// const viewAppointmentByID = (req, res, next) => {
//     let ref_no = req.query.ref_no;
//     let contact_no = req.query.contact_no;

//     // Function to check if the input is a valid reference number
//     const isValidRefNo = (refNo) => /^\d{10}$/.test(refNo);

//     // Function to check if the input is a valid contact number
//     const isValidContactNo = (contactNo) => /^\d{10}$/.test(contactNo);

//     if (ref_no == null || ref_no == " " || contact_no == null || contact_no == " ") {
//         res.status(500).json({
//             successful: false,
//             message: "Please enter credentials",
//         });
//     } else if (!isValidRefNo(ref_no)) {
//         res.status(500).json({
//             successful: false,
//             message: "Invalid reference number",
//         });
//     } else if (!isValidContactNo(contact_no)) {
//         res.status(500).json({
//             successful: false,
//             message: "Invalid contact number",
//         });
//     } else {
//         let query = `
//         SELECT first_name, last_name, middle_name, suffix, contact_no, email, date, time, service_name, ref_no, note
//         FROM appointment_tbl
//         INNER JOIN service_choice ON appointment_tbl.serviceid = service_choice.serviceid
//         WHERE ref_no = ?
//     `;

//         con_db.database.query(query, [ref_no, contact_no], (error, rows, result) => {
//             if (error) {
//                 console.error("Error in query:", error);
//                 res.status(500).json({
//                     successful: false,
//                     message: "Error in view query.",
//                 });
//             } else {
//                 if (rows.length > 0) {
//                     res.status(200).json({
//                         successful: true,
//                         message: "Successfully get all details",
//                         data: rows,
//                     });
//                 } else {
//                     res.status(404).json({
//                         successful: false,
//                         message: "Reference Number doesn't exist",
//                     });
//                 }
//             }
//         });
//     }
// };

const searchRef = (req, res) => {
    let ref_no = req.query.ref_no;
    let contact_no = req.query.contact_no;

    // Validation for proper ref_no format
    const refNoRegex = /^\d{10}$/;
    if (!ref_no || !refNoRegex.test(ref_no)) {
        console.log('Invalid ref_no format');
        return res.status(400).json({
            successful: false,
            message: "Please enter a valid reference number."
        });
    }

    // Validation for proper contact_no format
    const contactNoRegex = /^9\d{9}$/;
    if (!contact_no || !contactNoRegex.test(contact_no)) {
        console.log('Invalid contact_no format');
        return res.status(400).json({
            successful: false,
            message: "Please enter a valid contact number."
        });
    }

    console.log(req.query);

    let query = `
        SELECT 
            first_name, last_name, middle_name, suffix, contact_no, email, 
            date, time, service_name, ref_no, note, payment_status, status
        FROM appointment_tbl
        INNER JOIN service_choice ON appointment_tbl.serviceid = service_choice.serviceid
        WHERE ref_no = ? AND contact_no = ?`;

    con_db.database.query(query, [ref_no, contact_no], (error, rows) => {
        if (error) {
            console.error('Error in query:', error);
            return res.status(500).json({
                successful: false,
                message: "Error in query."
            });
        }

        if (rows.length > 0) {
            const appointmentDetails = rows[0];

            // Check if the reference number and contact number match
            if (appointmentDetails.contact_no === contact_no && appointmentDetails.ref_no == ref_no) {
                // Send details in the response
                return res.status(200).json({
                    successful: true,
                    message: "Successfully get all details",
                    data: appointmentDetails
                });
            } else {
                // If the numbers don't match, return appropriate response
                return res.status(400).json({
                    successful: false,
                    message: "The credentials don't seem to match, Please try again."
                });
            }
        } else {
            return res.status(404).json({
                successful: false,
                message: "The credentials don't seem to match, Please try again."
            });
        }
    });
};

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to check if the date and time are past the current date and time
function isDateTimePastCurrent(inputDate, inputTime) {
    const appointmentDateTime = new Date(`${inputDate}T${inputTime}`);
    const currentDateTime = new Date();
    return appointmentDateTime < currentDateTime;
}

module.exports = {
    bookAppointment,
    // viewAppointmentByID,
    searchRef
};
