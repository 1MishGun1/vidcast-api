const mongoose = require("mongoose");
const { esClient, ES_INDEX } = require("../elastic-search/elastic");
const { indexVideo } = require("../elastic-search/elastic");
const Video = require("../models/Video");

const MONGO_URI = "mongodb://localhost:27017/vidcast-db";

const run = async () => {
  await mongoose.connect(MONGO_URI);
  const videos = await Video.find();

  for (const video of videos) {
    await indexVideo(video);
  }

  console.log("All videos indexed in Elastic");
  process.exit(0);
};

run();
