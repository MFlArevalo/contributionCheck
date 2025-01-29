/* eslint-disable no-undef */
const path = require("path");
const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

const packageJson = require("./package.json");

const urlDev = "https://localhost:3000/";
const urlProd = "https://www.contoso.com/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    devtool: dev ? "source-map" : false,
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      vendor: ["react", "react-dom", "core-js", "@fluentui/react-components"],
      taskpane: ["./src/taskpane/index.tsx", "./src/taskpane/taskpane.html"],

      commands: "./src/commands/commands.ts",
    },
    optimization: {
      runtimeChunk: "single",
    },
    output: {
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
      plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.paths.json" })],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico|ttf)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        TARGET_ENV: JSON.stringify("production"), // for some reasons it odes not work.
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        hash: true,
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "vendor", "taskpane"],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["commands"],
      }),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"],
      }),
      new webpack.DefinePlugin({
        "process.env": {
          REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL),
          REACT_APP_VERSION: JSON.stringify(packageJson.version),
          REACT_APP_AUTH0_URL: JSON.stringify(process.env.REACT_APP_AUTH0_URL),
          REACT_APP_AUTH0_CLIENT_ID: JSON.stringify(process.env.REACT_APP_AUTH0_CLIENT_ID),
          REACT_APP_AUTH0_AUD: JSON.stringify(process.env.REACT_APP_AUTH0_AUD),
          REACT_APP_WEBSOCKET_URL: JSON.stringify(process.env.REACT_APP_WEBSOCKET_URL)
        },
      }),
    ],
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  if (dev) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        hash: true,
        filename: "index.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "vendor", "taskpane"],
      }),
    );
  }

  return config;
};
