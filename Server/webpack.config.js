const path = require("path");
const { version } = require("./package.json");
const webpack = require("webpack");
// const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: {
    argon2: "commonjs argon2",
    // prisma:'commonjs prisma'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(version),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
