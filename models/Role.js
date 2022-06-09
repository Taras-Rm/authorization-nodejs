const { Schema, model } = require("mongoose");

const Role = new Schema({
  role: { type: String, require: true, default: "USER" },
});

module.exports = model("Role", Role)