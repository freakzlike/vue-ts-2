module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [
      {
        options: {
          resourceRegExp: {},
          contextRegExp: {}
        }
      }
    ]
  },
  devServer: {
    watchOptions: {
      ignored: {},
      aggregateTimeout: 600,
      poll: 2000
    },
    disableHostCheck: true,
    sockHost: 'localhost',
    sockPort: 8080
  }
}
