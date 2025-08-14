const app = require("express")();

app.use(
  "/user",
  (req, res, next) => {
    console.log("User route accessed");
    // res.send("User route");
    next(); // Call next middleware
  },
  (req, res) => {
    console.log("This is a second middleware for user route");
    res.send("Second middleware for user route");
  }
);
// The above code defines a middleware for the "/user" route.
// The first middleware logs a message and calls `next()` to pass control to the next middleware.
// The second middleware logs another message and sends a response.
// The response will only be sent after both middlewares have executed.

app.use(
  "/provider",
  (req, res, next) => {
    console.log("User route accessed");
    res.send("User route");
    next(); // Call next middleware
  },
  (req, res) => {
    console.log("This is a second middleware for user route");
    res.send("Second middleware for user route");
  }
);
// The above code defines a middleware for the "/provider" route.
// The first middleware logs a message and sends a response immediately.
// The `next()` call here will not execute the second middleware because the response has already been sent.
// The second middleware will not run in this case.

app.use(
  "/rider",
  (req, res, next) => {
    console.log("User route accessed");
    // res.send("User route");
    next(); // Call next middleware
  },
  (req, res, next) => {
    console.log("This is a second middleware for user route");
    // res.send("Second middleware for user route");
    next(); // Call next middleware
  },
  (req, res, next) => {
    console.log("This is a third middleware for user route");
    // res.send("Third middleware for user route");
    next(); // Call next middleware
  },
  (req, res, next) => {
    console.log("This is a fourth middleware for user route");
    res.send("Fourth middleware for user route");
    // next(); // Call next middleware
  }
);

// Use of the middlewares:

app.use("/admin", (req, res, next) => {
  console.log("Admin route accessed");
  token = "123abc"; // Example token
  if (token !== "123abc") {
    res.status(401).send("Unauthorized access"); // Call next middleware
  } else {
    next();
  }
});

app.get("/admin/getAllData", (req, res) => {
  console.log("Admin route accessed");
  res.send("All data for admin");
});
app.get("/admin/deleteData", (req, res) => {
  console.log("Admin delete route accessed");
  res.send("Data deleted by admin");
});
app.put("/admin/updateData", (req, res) => {
  console.log("Admin update route accessed");
  res.send("Data updated by admin");
});
app.post("/admin/createData", (req, res) => {
  console.log("Admin create route accessed");
  res.send("Data created by admin");
});

app.use("/", (err, req, res, next) => {
  console.error("Something went wrong");
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
