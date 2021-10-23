const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (argvs) =>
  merge(common(argvs), {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
      //new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
    ],
    output: {
      publicPath: "/",
      filename: "assets/[name].[contenthash].js",
    },
    devServer: {
      hot: true,
      host: "0.0.0.0",
      port: 8081,
    },
  });
