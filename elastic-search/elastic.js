const { Client } = require("@elastic/elasticsearch");

const ES_INDEX = "videos";

const esClient = new Client({
  node: "http://localhost:9200",
  apiVersion: "8.13.4",
});

const initEs = async () => {
  try {
    const indexExists = await esClient.indices.exists({
      index: ES_INDEX,
    });

    if (!indexExists) {
      await esClient.indices.create({
        index: ES_INDEX,
        body: {
          mappings: {
            properties: {
              title: { type: "text" },
              cover: { type: "keyword" },
              hlsUrl: { type: "keyword" },
              views: { type: "integer" },
              createdAt: { type: "date" },
              user: {
                properties: {
                  _id: { type: "keyword" },
                  login: { type: "text" },
                  avatar: { type: "keyword" },
                },
              },
            },
          },
        },
      });
      console.log(`Index ${ES_INDEX} create`);
    } else {
      console.log(`Index ${ES_INDEX} earlier create`);
    }
  } catch (error) {
    console.log(`Error init: ${error}`);
  }
};

const indexVideo = async (video) => {
  try {
    await esClient.index({
      index: ES_INDEX,
      id: video._id.toString(),
      document: {
        title: video.title,
        cover: video.cover,
        hlsUrl: video.hlsUrl,
        views: video.views,
        createdAt: video.createdAt,
        user: {
          _id: video.user._id?.toString?.() || video.user.toString(),
          login: video.user.login || "",
          avatar: video.user.avatar || "",
        },
      },
    });
    console.log(`Video ${video._id} indexed`);
  } catch (err) {
    console.error("Indexing error:", err);
  }
};

const deleteVideoFromIndex = async (videoId) => {
  try {
    await esClient.delete({
      index: ES_INDEX,
      id: videoId.toString(),
    });
    await esClient.indices.refresh({ index: ES_INDEX });
    console.log(`Deleted from ES: ${videoId}`);
  } catch (err) {
    if (err.meta?.statusCode !== 404) {
      console.error("Delete from ES error:", err);
    }
  }
};

module.exports = {
  esClient,
  initEs,
  indexVideo,
  deleteVideoFromIndex,
  VIDEO_INDEX: ES_INDEX,
};
