const { DataTypes } = require("sequelize");
const validate = require("validator");
const sequelize = require("../database");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true, // Remove whitespace from both ends
    unique: true,
    validate: {
      len: [8, 20], // Username must be between 3 and 20 characters
    },
  },
  email: {
    type: DataTypes.STRING,
    lowercase: true, // Ensure email is stored in lowercase
    trim: true, // Remove whitespace from both ends
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [5, 50], // Email must be between 5 and 50 characters
      isLowercase: true, // Ensure email is in lowercase
    },
  },
  password: {
    type: DataTypes.STRING,
    trim: true, // Remove whitespace from both ends
    validate: {
      len: [6, 12], // Password must be between 6 and 12 characters
      isStrongPassword: {
        args: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        },
        msg: "Password must be at least 6 characters long, contain at least one lowercase letter, one uppercase letter, and one number.",
      },
    },
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 18, // Ensure age is a non-negative integer
      max: 120, // Reasonable upper limit for age
    },
  },
  gender: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: [["M", "F", "O"]],
    },
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error("Skills must be an array of strings");
        }
        value.forEach((skill) => {
          if (typeof skill !== "string") {
            throw new Error("Each skill must be a string");
          }
          if (skill.length > 30) {
            throw new Error("Each skill must be 30 characters or less");
          }
        });
      },
      len(value) {
        if (value.length > 10) {
          throw new Error("You can have at most 10 skills");
        }
      },
    },
  },
  aboutMe: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500], // Limit the length of the aboutMe field
    },
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "https://images.app.goo.gl/g6BwhpCYdiMK5gbX9",
    validate: {
      isUrl: true, // Validate that the URL is in a valid format
      len: [0, 255], // Limit the length of the photoUrl field
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = User;
