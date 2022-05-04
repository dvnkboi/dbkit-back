const mongoose = require("mongoose");
const validator = require("validator"); //use to validate input
const Types = require("mongoose").Schema.Types;


const schema = new mongoose.Schema(_template_Schema);

schema.pre("save", async function(next) {
  // your presave code here
  next();
});

schema.set('toObject', { getters: true, setters: true });
schema.set('toJSON', { getters: true, setters: true });

const _Template_ = mongoose.model("_Template_", schema);
module.exports = _Template_;
