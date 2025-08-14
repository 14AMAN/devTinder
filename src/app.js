const sequelize = require("./config/database");
const app = require("express")();

const User = require("./config/models/users");
app.use(require("express").json());

// Route to insert a new user
app.post("/users", async (req, res) => {
  try {
    // Ensure the table exists
    await User.sync();
    const { username, email, password } = req.body;
    const user = await User.create({
      username,
      email,
      password,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const email = await User.findOne({
      where: {
        email: req.query.email,
      },
    });
    console.log(email);
    res.json(email);
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
