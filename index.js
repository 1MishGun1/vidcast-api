const express = require("express");
const connectToDatabase = require("./db/connect");
const cors = require("cors");

const mainRouter = require("./routes/index");
const { initEs, indexVideo } = require("./elastic-search/elastic");
const Video = require("./models/Video");

const app = express();
const PORT = 3333;

connectToDatabase();
initEs();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(mainRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const startServer = async () => {
  try {
    const videos = await Video.find();
    for (const video of videos) {
      await indexVideo(video);
    }

    app.listen(PORT, () => {
      console.log(`App running in http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
