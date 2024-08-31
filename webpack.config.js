const path = require("path");

module.exports = {
  // otras configuraciones
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
    },
  },
  // otras configuraciones
};
