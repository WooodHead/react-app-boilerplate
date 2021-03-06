/* eslint-disable global-require, import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import baseConfig, {
  SRC_PATH,
  DIST_PATH,
  PUBLIC_PATH,
} from './webpack.config.base.babel';

const config = {
  ...baseConfig,

  entry: ['babel-polyfill', path.join(SRC_PATH, 'index')],

  output: {
    path: path.join(DIST_PATH, 'assets'),
    filename: 'app.js',
    publicPath: PUBLIC_PATH,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: __dirname,
        postcss: () => [require('autoprefixer')],
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: process.env.NODE_ENV !== 'production',
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../build/client/dll/lib-manifest.json'),
    }),
  ],

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader'],
        include: SRC_PATH,
        exclude: /node_modules/,
      },
    ],
  },

  cache: false,
};

export default config;
