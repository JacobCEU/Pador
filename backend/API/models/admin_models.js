const admin_model = (adminid,username,password,name)=>{

    let Admin = {
        adminid: adminid,
        username: username,
        passwordL: password,
        name: name
    }
    
    return Admin
    
    }
    module.exports = {
        admin_model
}