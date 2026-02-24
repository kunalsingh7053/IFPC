const{body,validationResult} = require('express-validator');

const respondValidationErrors = (req,res,next)=>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});


} 
next();

}
const validateLogin = [
body('email').isEmail().withMessage('Invalid email format'),
body('username').notEmpty().withMessage('Username is required'),    
body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
respondValidationErrors




];
const validateRegister = [
body('email').isEmail().withMessage('Invalid email format'),
body('username').notEmpty().withMessage('Username is required'),
body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
body('phone').isMobilePhone().withMessage('Invalid phone number'),
body('fullName.firstName').notEmpty().withMessage('First name is required'),
body('fullName.lastName').notEmpty().withMessage('Last name is required'),
respondValidationErrors



];

module.exports = {
    validateLogin,
    validateRegister
}