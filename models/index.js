const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const librarySchema = mongoose.Schema(
  {
    comments: {
      type: Array,
      // required: true,
    },
    title: {
      type: String,
      // required: true,
    },
  },
  {
    // timestamps: true,
  }
);

// add plugin that converts mongoose to json
librarySchema.plugin(toJSON);

/**
 * @typedef Library
 */
const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
