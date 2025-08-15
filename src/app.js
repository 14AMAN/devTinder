const sequelize = require("./config/database");
const app = require("express")();

const User = require("./config/models/users");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const becrypt = require("bcrypt");
app.use(require("express").json());

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
      email: email.toLowerCase(), // Ensure email is stored in lowercase
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
    const isPasswordValid = await becrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// app.put("/users/", async(req, res))
app.patch("/users", async (req, res) => {
  try {
    const { id, password, newPassword } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else if (user.password !== password) {
      return res.status(400).json({ error: "Incorrect pasword" });
    } else {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/users", async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else if (user.password !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    } else {
      await user.destroy();
      res.json({ message: "User deleted successfully" });
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
