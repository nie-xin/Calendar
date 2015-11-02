var webpack = require('webpack');

module.exports = {
  entry: './src',
  devtool: 'source-map',

  output: {
    path: 'builds',
    filename: 'bundle.js',
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      children: true,
      minChunks: 2,
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
    ],
  },
};
