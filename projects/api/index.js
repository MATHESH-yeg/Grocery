const app = require("../server/index");
export default function handler(req, res) {
  res.status(200).json({ status: "API WORKS" });
}

module.exports = app;
