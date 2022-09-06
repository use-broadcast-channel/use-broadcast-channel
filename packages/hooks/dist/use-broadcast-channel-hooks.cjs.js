'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./use-broadcast-channel-hooks.cjs.prod.js");
} else {
  module.exports = require("./use-broadcast-channel-hooks.cjs.dev.js");
}
