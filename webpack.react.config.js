const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    mainFields: ["main", "module", "browser"],
  },
  entry: ["babel-regenerator-runtime", "./src/app.tsx"],
  target: "electron-renderer",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "../build/renderer"),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4000,
    publicPath: "/",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({ title: "srtool" }),
    new MiniCssExtractPlugin(),
  ],
};
