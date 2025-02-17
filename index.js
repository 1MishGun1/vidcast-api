const express = require("express");
const connectToDatabase = require("./db/connect");

const mainRouter = require("./routes/index");
const upload = require("./controllers/UploadController");

const app = express();
const PORT = 3333;

connectToDatabase();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(mainRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`App running in http://localhost:${PORT}`);
});
