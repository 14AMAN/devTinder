const validator = require("validator");
const { isEmail, isAlpha, isStrongPassword, isURL } = validator;

function validateSignUpData(req) {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    age,
    gender,
    skills,
    aboutMe,
    photoUrl,
  } = req.body;

  // firstName: required, 2-30 chars, alpha
  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.trim().length < 2 ||
    firstName.trim().length > 30 ||
    !isAlpha(firstName.trim())
  ) {
    throw new Error("First Name must be 2-30 alphabetic characters.");
  }

  // lastName: optional, 0-30 chars, alpha if present
  if (
    lastName &&
    (typeof lastName !== "string" ||
      lastName.trim().length > 30 ||
      (lastName.trim().length > 0 && !isAlpha(lastName.trim())))
  ) {
    throw new Error("Last Name must be up to 30 alphabetic characters.");
  }

  // username: required, 8-20 chars
  if (
    !username ||
    typeof username !== "string" ||
    username.trim().length < 8 ||
    username.trim().length > 20
  ) {
    throw new Error("Username must be 8-20 characters long.");
  }

  // email: required, 5-50 chars, valid email, lowercase
  if (
    !email ||
    typeof email !== "string" ||
    email.trim().length < 5 ||
    email.trim().length > 50 ||
    !isEmail(email.trim())
  ) {
    throw new Error(
      "Email must be valid, lowercase, and 5-50 characters long."
    );
  }

  // password: required, 6-12 chars, strong
  if (
    !password ||
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 12 ||
    !isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be 6-12 characters, with at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol."
    );
  }

  // age: required, 18-120
  if (typeof age !== "number" || age < 18 || age > 120) {
    throw new Error("Age must be a number between 18 and 120.");
  }

  // gender: required, 'M', 'F', or 'O'
  if (!["M", "F", "O"].includes(gender)) {
    throw new Error("Gender must be 'M', 'F', or 'O'.");
  }

  // skills: optional, array of strings, max 10, each <= 30 chars
  if (skills) {
    if (!Array.isArray(skills)) {
      throw new Error("Skills must be an array of strings.");
    }
    if (skills.length > 10) {
      throw new Error("You can have at most 10 skills.");
    }
    for (const skill of skills) {
      if (typeof skill !== "string" || skill.length > 30) {
        throw new Error("Each skill must be a string up to 30 characters.");
      }
    }
  }

  // aboutMe: optional, max 500 chars
  if (aboutMe && (typeof aboutMe !== "string" || aboutMe.length > 500)) {
    throw new Error("About Me must be up to 500 characters.");
  }

  // photoUrl: optional, valid url, max 255 chars
  if (
    photoUrl &&
    (typeof photoUrl !== "string" || photoUrl.length > 255 || !isURL(photoUrl))
  ) {
    throw new Error("Photo URL must be a valid URL up to 255 characters.");
  }
}

function validateLoginData(req) {
  const { email, password } = req.body;
  if (!email || !isEmail(email.trim())) {
    throw new Error("Email is required and must be valid!");
  }
  if (!password) {
    throw new Error("Password is required!");
  }
}

module.exports = { validateSignUpData, validateLoginData };
