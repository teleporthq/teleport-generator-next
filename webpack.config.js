var webpack = require("webpack");
const libraryName = "teleport-generator-next";

module.exports = () => {
  return {
    entry: "./src/index.ts",
    output: {
      filename: "index.js",
      path: __dirname + "/dist",
      library: libraryName,
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: "this"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    }
  };
};
