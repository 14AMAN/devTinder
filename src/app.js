const sequelize = require("./config/database");
const app = require("express")();
const jwt = require("jsonwebtoken");
const User = require("./config/models/users");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const becrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const authUser = require("./middleware/auth");
app.use(require("express").json());
app.use(cookieParser()); // Middleware to parse cookies

// Route to insert a new user
app.post("/users", async (req, res) => {
  try {
    // Validate the request body
    validateSignUpData(req);
    // Encryption logic can be added here if needed
    const passwordHash = becrypt.hashSync(req.body.password, 10);
    const {
      firstName,
      lastName,
      username,
      email,
      age,
      gender,
      skills,
      aboutMe,
      photoUrl,
    } = req.body;
    // Ensure the table exists
    await User.sync();
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email.trim().toLowerCase(), // Ensure email is stored in lowercase
      password: passwordHash, // Store the hashed password
      age: age,
      gender: gender,
      skills: skills,
      aboutMe: aboutMe,
      photoUrl: photoUrl,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    // Validate the request body
    validateLoginData(req);
    // Ensure email is in lowercase
    req.body.email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await user.validatePassword(req.body.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      const token = await user.getJWT();
      // Optionally, you can remove the password from the response
      res.cookie("token", token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 3600000, // 1 hour
      });
      res.json("Login successful");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// app.put("/users/", async(req, res))
app.patch("/users", authUser, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const { id } = req.user; // Get user ID from the authenticated request
    const hashedNewPassword = await becrypt.hash(newPassword, 10);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else if (await becrypt.compare(password, user.password)) {
      user.password = hashedNewPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      return res.status(400).json({ error: "Incorrect pasword" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/users", authUser, async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id } = req.user; // Get user ID from the authenticated request
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else if (
      email === user.email &&
      (await becrypt.compare(password, user.password))
    ) {
      await user.destroy();
      res.clearCookie("token"); // Clear the cookie after deletion
      res.json({ message: "User deleted successfully and logged out" });
    } else {
      return res.status(400).json({ error: "Invalid Crediatials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.get("/user", async (req, res) => {
//   try {
//     // Find all users
//     const users = await User.findAll();
//     console.log(users.every((user) => user instanceof User)); // true
//     console.log("All users:", JSON.stringify(users, null, 2));
//     res.send("data sent!");
//   } catch (error) {
//     res.status(500).send("Database connection failed: " + error.message);
//   }
// });

// Test the database connection
app.get("/profile", authUser, async (req, res) => {
  //
  const isTokenValid = req.user; // Access the user info from the request
  res.send((await User.findByPk(isTokenValid.id)) || "Profile is empty.");
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected!");
    // Start the server only after successful database connection
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
