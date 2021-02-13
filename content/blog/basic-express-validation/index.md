---
title: Validate User Input Data with express-validator
date: "2021-02-13T00:00:00Z"
description: Sanitize and validate user-submitted inputs and return validation errors in Express
tags: ['express']
---

### Introduction

There's a well-known saying in the web development world: never trust user input ([and a relevant joke that programmers love to refer to](https://imgs.xkcd.com/comics/exploits_of_a_mom.png)). We're going to take a look at [express-validator](https://www.npmjs.com/package/express-validator) and how to easily verify a page where user submits data to register for your application.

### Basic Register Validation

What I usually do is apply all of my validations into a separate utility file and then import them into my controllers to separate the logic. Here's a basic example of a register validator:

```js
const { body, validationResult } = require('express-validator')

const signUpValidation = () => {
  return [
    body('email').isEmail(),
    body('username').notEmpty(),
    body('password').notEmpty(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
  
      return true;
    }),
  ]
}
```

<br />

While there's a [long list of available validators](https://github.com/validatorjs/validator.js#validators), I chose to keep it simple for this example, only checking if the email field is a valid email address, the username and password aren't empty, and then creating a custom validator for the confirm password to ensure they both match.

From here, I add the validate function middleware, which will pass the request **after** it's gone through validation of the fields specified above:

```js
const validate = (request, response, next) => {
  const errors = validationResult(request)

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  next()
}
```

<br />

This uses the validationResult function from express-validator to check for errors for the fields you specified, returning an array of errors if any of the fields did not pass the validation. If the error array isn't empty, we return it to the client-side, to loop through the errors of the fields that were invalid; otherwise, we use "next()" to pass on to the next middleware.

Now, export these utility functions and we'll use them in your controller like this:

```js
const usersRouter = require('express').Router()
const { signUpValidation, validate } = require('../utils/validator')

usersRouter.post('/', signUpValidation(), validate, async (request, response) => {
  // logic to hash the user's password and create a new user
})
```

<br />

It's important you place each middleware function in the correct order, with the function checking the body for the specified valiadations/sanitizations, and then the function that returns the errors based off of validation status.

### Conclusion

While this was a fairly simple implementation, express-validator makes it easy to quickly validate inputs and return input validation errors to the user with flexibility to even add custom error messages, despite their default messages being quite good.