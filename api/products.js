const app = require("../projects/server/index");
export default function handler(req, res) {
  res.status(200).json({ status: "API WORKS" });
}

module.exports = app;
