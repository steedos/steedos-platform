const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  externals: [
    nodeExternals(),
    'moleculer',
    '@mapbox/node-pre-gyp',
    '@nestjs/core',
    'node-gyp',
    '@mapbox/node-pre-gyp',
    'class-transformer',
    'class-transformer/storage'
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
