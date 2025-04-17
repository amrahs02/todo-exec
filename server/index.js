const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const TodoModel = require("./models/todoModel");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

//fix cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  } 

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if the user is authenticated

mongoose
  .connect(process.env.MONGOURI)
  .then(console.log("Mongodb is connected"))
  .catch("Getting some error while connecting with mongo server");

//register with jwt

app.post("/register", (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  const newUser = new userModel({ name, email, password,role });
  newUser
    .save()
    .then(() => {
      const token = jwt.sign({ id: newUser._id, email }, JWT_SECRET);
      res.status(201).json({ message: "User registered successfully", token });
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get("/profile", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.status(200).json({ message: "User profile", user });
  });
});

//login with jwt
//login with jwt

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email, role: user.role }, JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});
//logout
app.post("/logout", (req, res) => {
  //\

  res.status(200).json({ message: "Logout successful" });
});

// //create todo in db (mongodb)

app.post("/create", authenticateToken, (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  const todoModel = new TodoModel({ title, description, user: userId });
  todoModel
    .save()
    .then((todo) => {
      res.status(200).json(todo);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

//read
app.get("/todos", authenticateToken, (req, res) => {
  const userId = req.user.id;

  TodoModel.find({ user: userId })
    .then((todos) => {
      res.status(200).json(todos);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// //get single todo
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  TodoModel.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(200).json(todo);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// //delete

// detele todo
app.delete("/todos/:_id", (req, res) => {
  const { _id } = req.params;
  TodoModel.findByIdAndDelete(_id)
    .then((todo) => {
      if (!todo) return res.status(404).json({ message: "Todo not found" });
      res.status(200).json({ message: "Todo deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});


// UPDATE toddo
app.put("/todos/:_id", (req, res) => {
  const { _id } = req.params;
  const { title, description } = req.body;
  TodoModel.findByIdAndUpdate(
    _id,
    { title, description },
    { new: true }
  )
    .then((todo) => {
      if (!todo) return res.status(404).json({ message: "Todo not found" });
      res.status(200).json(todo);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};



app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch users" });
  }
});

app.get("/api/admin/todos", authenticateToken, isAdmin, async (req, res) => {
  try {
    const todos = await TodoModel.find().populate("user", "name email");
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch todos" });
  }
});



app.listen(process.env.PORT, () => {
  console.log("Server is running on port 5000");
});
