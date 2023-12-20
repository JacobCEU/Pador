const con_db = require('../models/con_db');

const paycard = async (req, res) => {
    const { bank_id, card_type, ref_no } = req.body;

    // Add validation for required fields
    if (!bank_id || !card_type || !ref_no) {
        return res.status(400).json({
            successful: false,
            message: "Required fields* cannot be empty."
        });
    }

    // Assuming you have the logic to validate the credit card and bank details here...

    // Fetch the serviceid and payment_status from appointment_tbl
    const fetchQuery = `
        SELECT serviceid, payment_status, amount
        FROM appointment_tbl
        WHERE ref_no = ?;
    `;

    con_db.database.query(fetchQuery, [ref_no], async (error, rows) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).json({
                successful: false,
                message: "Error in query."
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                successful: false,
                message: "No appointment found with the provided reference number."
            });
        }

        const { serviceid, payment_status, amount } = rows[0];

        if (payment_status !== 'Unpaid') {
            return res.status(400).json({
                successful: false,
                message: "Payment has already been made for this appointment."
            });
        }

        // Fetch the service price from the service_choice table
        const serviceFetchQuery = `
            SELECT price
            FROM service_choice
            WHERE serviceid = ?;
        `;

        con_db.database.query(serviceFetchQuery, [serviceid], async (error, serviceRows) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({
                    successful: false,
                    message: "Error in query."
                });
            }

            if (serviceRows.length === 0) {
                return res.status(404).json({
                    successful: false,
                    message: "No service found with the provided serviceid."
                });
            }

            const serviceCost = serviceRows[0].price;

            // Check if the amount is sufficient to cover the service cost
            if (amount < serviceCost) {
                return res.status(400).json({
                    successful: false,
                    message: "Payment unsuccessful. Insufficient funds."
                });
            }

            // Perform the deduction in the appointment_tbl and set payment_status to 'Paid'
            const updateQuery = `
                UPDATE appointment_tbl
                SET amount = amount - ?, payment_status = 'Paid'
                WHERE ref_no = ? AND payment_status = 'Unpaid';
            `;

            con_db.database.query(updateQuery, [serviceCost, ref_no], (error, result) => {
                if (error) {
                    console.error('Database Error:', error);
                    return res.status(500).json({
                        successful: false,
                        message: "Error in query."
                    });
                } else {
                    // Check if any rows were affected, indicating a successful update
                    if (result.affectedRows > 0) {
                        // You can add additional logic here if needed
                        return res.status(200).json({
                            successful: true,
                            message: "Payment successful. Payment status updated to 'Paid'."
                        });
                    } else {
                        return res.status(404).json({
                            successful: false,
                            message: "No unpaid appointment found with the provided reference number."
                        });
                    }
                }
            });
        });
    });
};

module.exports = {
    paycard
};


