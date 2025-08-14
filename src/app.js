const sequelize = require("./config/database");
const app = require("express")();

const User = require("./config/models/users");
app.use(require("express").json());

// Route to insert a new user
app.post("/users", async (req, res) => {
  try {
    // Ensure the table exists
    await User.sync();
    const inputData = req.body;
    const user = await User.create(inputData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const email = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log(email);
    if (!email) res.status(404).json({ error: "User not found" });
    else res.json(email);
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
