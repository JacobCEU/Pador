const con_db = require('../models/con_db');

const bookAppointment = async (req, res, next) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let middle_name = req.body.middle_name || 'n/a'; // Use 'n/a' if middle_name is not provided
    let suffix = req.body.suffix || 'n/a'; // Use 'n/a' if suffix is not provided
    let contact_no = req.body.contact_no;
    let email = req.body.email || 'n/a'; // Use 'n/a' if email is not provided
    let date = req.body.date;
    let time = req.body.time;
    let serviceid = req.body.serviceid;
    let note = req.body.note;

    // Add validation for required fields
    if (!first_name || !last_name || !contact_no || !date || !time || !serviceid) {
        return res.status(400).json({
            successful: false,
            message: "Required fields* cannot be empty."
        });
    }

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
        note: note
    };

    let query = `
        INSERT INTO appointment_tbl
        (first_name, last_name, middle_name, suffix, contact_no, email, date, time, serviceid, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log('Query:', query);
    console.log('Parameters:', [
        Appoint.first_name,
        Appoint.last_name,
        Appoint.suffix,
        Appoint.middle_name,
        Appoint.contact_no,
        Appoint.email,
        Appoint.date,
        Appoint.time,
        Appoint.serviceid,
        Appoint.note
    ]);

    con_db.database.query(query, [
        Appoint.first_name,
        Appoint.last_name,
        Appoint.suffix,
        Appoint.middle_name,
        Appoint.contact_no,
        Appoint.email,
        Appoint.date,
        Appoint.time,
        Appoint.serviceid,
        Appoint.note
    ], (error, result) => {
        if (error) {
            console.error('Database Error:', error);
            res.status(500).json({
                successful: false,
                message: "Error in query."
            });
        } else {
            const ref_no = result.insertId; // Retrieve the auto-incremented ID (ref_no)

            res.status(200).json({
                successful: true,
                message: "Successfully booked an appointment",
                ref_no: ref_no
            });
        }
    });
};


const viewAppointmentByID = (req, res, next) => {
    let ref_no = req.query.ref_no;
    let contact_no = req.query.contact_no;
  
    if (!ref_no || !contact_no) {
      res.status(500).json({
        successful: false,
        message: "Nothing provided",
      });
    } else {
     
    let query = `
    SELECT first_name, last_name, middle_name, suffix, contact_no, email, date, time, service_name, ref_no, note
    FROM appointment_tbl
    INNER JOIN service_choice ON appointment_tbl.serviceid = service_choice.serviceid
    WHERE ref_no = ?
`;
  
      con_db.database.query(query, [ref_no, contact_no], (error, rows, result) => {
        if (error) {
          console.error("Error in query:", error);
          res.status(500).json({
            successful: false,
            message: "Error in query.",
          });
        } else {
          if (rows.length > 0) {
            res.status(200).json({
              successful: true,
              message: "Successfully get all details",
              data: rows,
            });
          } else {
            res.status(404).json({
              successful: false,
              message: "Reference Number doesn't exist",
            });
          }
        }
      });
    }
  };
  

const searchRef = (req, res, next) => {
    let ref_no = req.query.ref_no;
    let contact_no = req.query.contact_no;

    if (!contact_no || !ref_no) {
        console.log('Missing contact_no or ref_no');
        return res.status(400).json({
            successful: false,
            message: "Please enter required credentials."
        });
    }

    console.log(req.query);

    let query = `
        SELECT first_name, last_name, middle_name, suffix, contact_no, email, date, time, service_name, ref_no, note
        FROM appointment_tbl
        INNER JOIN service_choice ON appointment_tbl.serviceid = service_choice.serviceid
        WHERE ref_no = ? AND contact_no = ?
    `;

    con_db.database.query(query, [ref_no, contact_no], (error, rows, result) => {
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
    viewAppointmentByID,
    searchRef
};
