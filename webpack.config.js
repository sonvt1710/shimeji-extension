let popupConfig = {
  mode: "production",
  entry: './src/popup/index.js',
  output: {
    filename: 'popup/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.css$/i,
        use: ["to-string-loader", "css-loader"],
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
}

let contentScriptConfig = {
  mode: "production",
  entry: './src/index.js',
  output: {
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.css$/i,
        use: ["to-string-loader", "css-loader"],
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
}

module.exports = [popupConfig, contentScriptConfig]