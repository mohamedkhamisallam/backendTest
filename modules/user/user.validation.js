
const { body} = require('express-validator');
const signupValidator=[
    body(`userName`).isString().withMessage(`invalid userName`),
    body(`email`).isString().withMessage(`invalid email`),
    body(`password`).isString().withMessage(`wrong password`),
    body('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
    
        // Indicates the success of this synchronous custom validator
        return true;
      }),
]

module.exports={signupValidator}