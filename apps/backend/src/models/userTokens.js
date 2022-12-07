const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  refresh_token: { type: String, required: true },
});

module.exports = mongoose.model("UserTokens", userTokenSchema);
