const appoint_model = (ref_id, ref_no, bank_id,serviceid,first_name,last_name, suffix, middle_name,contact_no,email,date,time,note)=>{

    let Appoint = {
        ref_id: ref_id,
        ref_no: ref_no,
        bank_id: bank_id,
        serviceid: serviceid,
        first_name: first_name,
        last_name: last_name,
        suffix: suffix,
        middle_name: middle_name,
        contact_no: contact_no,
        email: email,
        date: date,
        time: time,
        note: note,
        amount: amount
    }
    
    return Appoint
    
    }
    module.exports = {
        appoint_model
    }