const validator = require('validator');


const validate = (data) => {

    const mandatoryFields = ['firstName', 'emailId', 'password'];
    
    const isAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));

    if (!isAllowed) 
        throw new Error('Please provide all required fields: first name, email, and password');

    if (!validator.isEmail(data.emailId))
        throw new Error('Please enter a valid email address');

    // if (!validator.isStrongPassword(data.password))
    //     throw new Error('Weak Password');

    if (data.firstName.length < 3 || data.firstName.length > 10) 
        throw new Error("First name must be between 3 and 10 characters");

}

module.exports = validate;
