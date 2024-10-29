const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrpty = require("bcrypt");
const jwt = require("jsonwebtoken");
const { request } = require("http");
const app = express();
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "myDatabase.db");
const secreatKey = "Karthik121";

app.listen(3000, () => console.log(`Server Running At http://localhost:3000`));

const initializeDbAndServer = async () => {
  db = await open({
    driver: sqlite3.Database,
    filename: dbPath,
  });
};

app.post("/register", async (request, response) => {
  const { name, email, password } = request.body;
  try {
    console.log(email);
    const selectUser = await db.get(
      `SELECT * FROM users WHERE email = '${email}' `
    );
    if (selectUser) {
      return response.status(500).json({ message: "User Already Exist" });
    }
    const hashedPassword = await bcrpty.hash(password, 10);
    console.log(hashedPassword);
    const insertQuery = `INSERT INTO users(name,email,password) VALUES(
        '${name}',
        '${email}',
        '${hashedPassword}'
        )`;
    await db.run(insertQuery);
    response.status(201).json({ message: "Successfully Registered" });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const selectUser = await db.get(
      `SELECT * FROM users WHERE email = '${email}' `
    );
    if (selectUser === undefined) {
      return response.status(500).json({ message: "User Not Exist" });
    } else {
      const isPasswordMatched = await bcrpty.compare(
        password,
        selectUser.password
      );
      if (isPasswordMatched) {
        const userData = { email: email };
        const token = jwt.sign(userData, secreatKey, { expiresIn: "1h" });
        console.log(token);
        response.status(200).json({ jwtToken: token });
      } else {
        response.status(500).json({ message: "Invalid Password" });
      }
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

initializeDbAndServer();
