const express = require("express");
const connectToDatabase = require("./db/connect");

const app = express();
const PORT = 3333;

connectToDatabase();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`App running in http://localhost:${PORT}`);
});
