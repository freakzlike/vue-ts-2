const webpack = require('webpack')

// Split chunks only on production, cause it will break chai in tests
const optimization = process.env.NODE_ENV === 'production' ? {
  splitChunks: {
    minSize: 10000,
    maxSize: 250000
  }
} : undefined

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    ],
    optimization
  },

  devServer: {
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600,
      poll: 2000
    },
    disableHostCheck: true,
    sockHost: 'localhost',
    sockPort: 8080
  }
}
