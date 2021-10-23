const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (argvs) => {
  return {
    entry: {
      index: "./src/index.tsx",
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "../src/"),
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new NodePolyfillPlugin(),
      new HtmlWebpackPlugin({
        chunks: ["index"],
        minify: false,
        template: "public/index.html",
        filename: "index.html",
        inject: "body",
        scriptLoading: "defer",
      }),

      new ForkTsCheckerWebpackPlugin(),
    ],
    output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "../build"),
    },
  };
};
