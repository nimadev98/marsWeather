const express = require("express");
const nodeCache = require("node-cache");

const apiModel = require("../models/api.model");

const router = express.Router();
const apiCache = new nodeCache();

router.get("/api/mars", async (req, res) => {
  let data = {};
  if (apiCache.has("mars")) {
    data = apiCache.get("mars");
  } else {
    const newData = await apiModel.getData();
    apiCache.set("mars", newData, 60 * 5);
    data = newData;
  }

  if (req.premium) {
    if (req.count < 500) {
      res.json(data);
    } else {
      res.json({ error: "Too Much Request For Today" });
    }
  } else {
    if (req.count < 50) {
      res.json(data);
    } else {
      res.json({ error: "Too Much Request For Today" });
    }
  }
});

module.exports = router;
