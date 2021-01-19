// npx webpack
let popupConfig = {
  entry: './src/popup/index.js',
  output: {
    filename: 'popup/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  }
}

let contentScriptConfig = {
  entry: './src/index.js',
  output: {
    filename: 'index.js'
  },
}

module.exports = [popupConfig,contentScriptConfig]