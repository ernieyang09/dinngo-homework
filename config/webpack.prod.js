const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (_, argvs) =>

  merge(common(argvs), {
    mode: "production",
    output: {
      publicPath: process.env.ASSET_PATH || "/",
    },
  });

