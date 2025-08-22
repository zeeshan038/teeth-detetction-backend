// NPM package
const Joi = require("joi");

//Signup Schma
module.exports.signupSchema = (payload) => {
  const schema = Joi.object({
    firstName: Joi.string().messages({
      "string.empty": "FirstName is required.",
      "any.required": "First Name is a mandatory field.",
    }),
    lastName: Joi.string().messages({
      "string.empty": "LastName is required.",
      "any.required": "Last Name is a mandatory field.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is a mandatory field.",
    }),
    password: Joi.string().min(6).max(200).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password cannot exceed 200 characters.",
      "string.empty": "Password is required.",
      "any.required": "Password is a mandatory field.",
    }),
    phoneNo: Joi.number().messages({
      "number.empty": "Phone Number is required.",
      "any.required": "Phone Number is a mandatory field.",
    }),
    dob: Joi.date().messages({
      "date.empty": "Date of Birth is required.",
      "any.required": "Date of Birth is a mandatory field.",
    }),
    role: Joi.string().required().messages({
      "string.empty": "Role is required.",
      "any.required": "Role is a mandatory field.",
    }),
    speciality: Joi.string().messages({
      "string.empty": "Speciality is required.",
      "any.required": "Speciality is a mandatory field.",
    }),
    profileImage: Joi.string().messages({
      "string.empty": "Profile Image is required.",
      "any.required": "Profile Image is a mandatory field.",
    }),
  }).unknown(false);

  const result = schema.validate(payload);
  return result;
};

//Login Schema
module.exports.loginSchema = (payload) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is a mandatory field.",
    }),
    password: Joi.string().min(6).max(200).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password cannot exceed 200 characters.",
      "string.empty": "Password is required.",
      "any.required": "Password is a mandatory field.",
    }),
  }).unknown(false);
  const result = schema.validate(payload);
  return result;
};

// user schema
module.exports.userSchema = async (payload) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
      "any.required": "Name is a mandatory field.",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is a mandatory field.",
    }),
    profileImage: Joi.string().uri().messages({
      "string.uri": "Profile image must be a valid URL.",
    }),
  }).unknown(false);

  const result = schema.validate(payload);
  return result;
};
//password schema
module.exports.passwordSchema = (payload) => {
  const schema = Joi.object({
    currentPassword: Joi.string().min(6).max(1024).required().messages({
      "string.empty": "Current password is required",
      "string.min":
        "Current password must be at least {#limit} characters long",
      "string.max": "Current password cannot exceed {#limit} characters",
      "any.required": "Current password is required",
    }),
    newPassword: Joi.string().min(6).max(1024).required().messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least {#limit} characters long",
      "string.max": "New password cannot exceed {#limit} characters",
      "any.required": "New password is required",
    }),
    confirmNewPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "New password and confirm new password must match",
        "any.required": "Confirm new password is required",
      }),
  }).unknown(false);

  const validationResult = schema.validate(payload);
  return validationResult;
};
