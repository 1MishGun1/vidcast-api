const searchRouter = require("express").Router();
const { esClient, VIDEO_INDEX } = require("../elastic-search/elastic");

searchRouter.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing search query: q" });
  }

  try {
    const { hits } = await esClient.search({
      index: VIDEO_INDEX,
      query: {
        match: {
          title: {
            query: query,
            fuzziness: "auto",
          },
        },
      },
    });

    const results = hits.hits.map((hit) => ({
      _id: hit._id,
      ...hit._source,
    }));

    res.json({ results });
  } catch (error) {
    console.error("Elastic search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = searchRouter;
