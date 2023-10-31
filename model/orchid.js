const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orchidSchema = new Schema(
  {
    name: { type: String, require: true },
    image: { type: String, require: true },
    isNatural: { type: Boolean, default: false },
    origin: { type: String, require: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", require: true },
  },
  { timestamps: true }
);

const Orchids = mongoose.model("Orchids", orchidSchema);
module.exports = Orchids;
