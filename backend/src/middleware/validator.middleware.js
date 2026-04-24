const{body,validationResult} = require('express-validator');

const MEDICAPS_EMAIL_DOMAIN = '@medicaps.ac.in';

const isMedicapsEmail = (email = '') =>
    String(email).trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN);

const respondValidationErrors = (req,res,next)=>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});


} 
next();

}
const validateLogin = [
body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .custom((value) => {
        if (!isMedicapsEmail(value)) {
            throw new Error('Only @medicaps.ac.in email is allowed');
        }
        return true;
    }),
body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
respondValidationErrors




];
const validateRegister = [
body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .custom((value) => {
        if (!isMedicapsEmail(value)) {
            throw new Error('Only @medicaps.ac.in email is allowed');
        }
        return true;
    }),
body('username').notEmpty().withMessage('Username is required'),
body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
body('phone').isMobilePhone().withMessage('Invalid phone number'),
body('fullName.firstName').notEmpty().withMessage('First name is required'),
body('fullName.lastName').notEmpty().withMessage('Last name is required'),
respondValidationErrors



];

const validateForgotPasswordRequest = [
body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .custom((value) => {
        if (!isMedicapsEmail(value)) {
            throw new Error('Only @medicaps.ac.in email is allowed');
        }
        return true;
    }),
respondValidationErrors
];

const validateResetPasswordByToken = [
body('newPassword')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters long'),
respondValidationErrors
];

module.exports = {
    validateLogin,
    validateRegister,
    validateForgotPasswordRequest,
    validateResetPasswordByToken
}